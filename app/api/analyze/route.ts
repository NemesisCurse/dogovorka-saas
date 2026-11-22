import { NextResponse } from 'next/server';
import GigaChat from 'gigachat';
import { Agent } from 'node:https';
import mammoth from 'mammoth';
import { createClient } from '@/lib/supabase/server'; 

const httpsAgent = new Agent({
  rejectUnauthorized: false,
});

const client = new GigaChat({
  timeout: 600,
  model: 'GigaChat-2-Pro', 
  credentials: process.env.GIGACHAT_AUTH_KEY,
  scope: 'GIGACHAT_API_PERS',
  httpsAgent: httpsAgent,
});

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Необходима авторизация' }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('checks_used, checks_limit, plan')
      .eq('id', user.id)
      .single();

    if (!profile) {
      return NextResponse.json({ error: 'Профиль не найден' }, { status: 404 });
    }

    // Проверка лимита (теперь лимит 3)
    if (profile.plan === 'free' && profile.checks_used >= profile.checks_limit) {
      return NextResponse.json({ 
        error: 'Лимит бесплатных проверок исчерпан. Пожалуйста, оформите подписку "Профи".' 
      }, { status: 403 }); 
    }

    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'Файл не загружен' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    let contractText = '';

    if (file.type === 'application/pdf') {
      const pdf = (await import('pdf-parse')).default;
      const data = await pdf(buffer);
      contractText = data.text;
    } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || file.name.endsWith('.docx')) {
      const result = await mammoth.extractRawText({ buffer });
      contractText = result.value;
    } else if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
      contractText = await file.text();
    } else {
      return NextResponse.json({ error: 'Поддерживаются только PDF, DOCX и TXT' }, { status: 400 });
    }

    if (!contractText || contractText.trim().length === 0) {
      return NextResponse.json({ error: 'Файл пустой или не удалось прочитать текст' }, { status: 400 });
    }

    const truncatedText = contractText.slice(0, 30000);

    const prompt = `
      Ты — профессиональный AI-аудитор договоров. Твоя задача — защитить ИСПОЛНИТЕЛЯ от любых убытков, кабальных условий и потери прав.
      
      КРИТИЧЕСКИ ВАЖНО:
      1. Анализируй даже абсурдные, странные или замаскированные пункты.
      2. Если в тексте есть хотя бы намек на нарушение прав исполнителя или финансовый риск — ОБЯЗАТЕЛЬНО вынеси это в риски.
      
      Верни ТОЛЬКО валидный JSON-объект без какого-либо текста до или после:
      {
        "contract_type": "краткое описание типа договора",
        "overall_risk_score": 5,
        "summary": "1-2 предложения общего вывода о договоре",
        "risks": [
          {
            "clause_text": "точная цитата из договора",
            "risk_level": "high" | "medium" | "low", 
            "explanation": "объяснение риска",
            "recommendation": "как исправить"
          }
        ]
      }
      Если рисков нет, поле "risks" ДОЛЖНО быть пустым массивом: "risks": [].
      
      Текст договора:
      ${truncatedText}
    `;

    const response = await client.chat({
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.1,
    });

    const aiResponse = response.choices[0]?.message?.content;
    if (!aiResponse) throw new Error("Нейросеть вернула пустой ответ");

    let cleanJson = aiResponse.replace(/```json/g, '').replace(/```/g, '').trim();
    const start = cleanJson.indexOf('{');
    const end = cleanJson.lastIndexOf('}');
    if (start !== -1 && end !== -1) cleanJson = cleanJson.substring(start, end + 1);

    const report = JSON.parse(cleanJson);

    const safeRisks = Array.isArray(report.risks) ? report.risks.map((risk: any) => {
      let level = (risk.risk_level || '').toLowerCase();
      if (level.includes('высок') || level.includes('крит') || level === 'high') level = 'high';
      else if (level.includes('сред') || level === 'medium') level = 'medium';
      else level = 'low';
      return {
        clause_text: risk.clause_text || "Цитата не указана",
        risk_level: level, 
        explanation: risk.explanation || "Объяснение отсутствует",
        recommendation: risk.recommendation || "Рекомендация отсутствует"
      };
    }) : [];

    // Увеличиваем счетчик использованных проверок
    if (profile.plan === 'free') {
      await supabase
        .from('profiles')
        .update({ checks_used: profile.checks_used + 1 })
        .eq('id', user.id);
    }

    const safeReport = {
      contract_type: report.contract_type || "Договор (тип не определен)",
      overall_risk_score: report.overall_risk_score || 5,
      summary: report.summary || "Анализ завершен, но нейросеть не дала краткого вывода.",
      risks: safeRisks
    };

    return NextResponse.json(safeReport);

  } catch (error: any) {
    console.error('Server Error:', error);
    return NextResponse.json({ error: 'Внутренняя ошибка сервера: ' + error.message }, { status: 500 });
  }
}