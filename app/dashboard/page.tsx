"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function DashboardPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [report, setReport] = useState<any>(null); 
  const [agreed, setAgreed] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return alert("Выберите файл");
    if (!agreed) return alert("Необходимо согласиться с условиями");
    
    setIsUploading(true);
    setReport(null); 
    
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/analyze', { 
        method: 'POST',
        body: formData 
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        if (response.status === 403) {
          const goToPay = confirm(data.error + "\n\nПерейти на страницу оплаты?");
          if (goToPay) router.push('/checkout');
          return;
        }
        throw new Error(data.error);
      }
      
      setReport(data);
    } catch (error: any) {
      alert("Ошибка при анализе: " + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-black">
      <header className="bg-white border-b px-6 py-4 flex justify-between items-center shadow-sm">
        <Link href="/" className="font-bold text-xl text-blue-600 hover:text-blue-800 transition">
          ← На главную (Договорка)
        </Link>
        <div className="flex items-center gap-6">
          <Link href="/support" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition flex items-center gap-1">
            <span>💬</span> Поддержка
          </Link>
          <button onClick={handleLogout} className="text-sm font-medium text-gray-500 hover:text-red-500 transition">
            Выйти
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto mt-10 px-4 pb-20">
        
        {!report ? (
          <>
            <div className="text-center mb-8 mt-6">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Ваш заказчик прислал договор?
              </h1>
              <p className="text-lg text-gray-600">
                Проверьте его на скрытые риски за 30 секунд.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <span className="text-lg">⚖️</span> Важная правовая информация
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed mb-4">
                Сервис «Договорка» использует технологии искусственного интеллекта. Результаты анализа носят <strong>справочный (информационный) характер</strong> и <strong>не являются юридической консультацией</strong> или заключением. 
                Ознакомьтесь с <Link href="/terms" target="_blank" className="text-blue-600 hover:underline">Пользовательским соглашением</Link> и <Link href="/privacy" target="_blank" className="text-blue-600 hover:underline">Политикой конфиденциальности</Link>.
              </p>
              
              <label className="flex items-start gap-3 cursor-pointer group">
                <input 
                  type="checkbox" 
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-1 w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <span className="text-xs text-gray-700 group-hover:text-gray-900 transition">
                  Я понимаю, что отчет сгенерирован ИИ, может содержать неточности и <strong>не заменяет консультацию юриста</strong>. Я принимаю на себя все риски.
                </span>
              </label>
            </div>

            <form onSubmit={handleUpload} className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-10 text-center hover:bg-gray-50 transition cursor-pointer relative">
                <input 
                  type="file" 
                  accept=".pdf,.docx,.txt" 
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="text-gray-500">
                  {file ? (
                    <span className="font-semibold text-blue-600">{file.name}</span>
                  ) : (
                    <>
                      <p className="font-medium text-lg mb-1">Нажмите, чтобы выбрать файл</p>
                      <p className="text-sm">Форматы: PDF, DOCX, TXT</p>
                    </>
                  )}
                </div>
              </div>

              <button 
                type="submit" 
                disabled={!file || !agreed || isUploading}
                className="w-full mt-6 bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
              >
                {isUploading ? "ИИ анализирует договор..." : "Проверить договор"}
              </button>
            </form>
          </>
        ) : (
          <div className="space-y-6 mt-8">
            {/* Блок с кнопками управления (скрывается при печати) */}
            <div className="flex justify-between items-center mb-4 no-print">
              <button onClick={() => { setReport(null); setFile(null); setAgreed(false); }} className="text-blue-600 text-sm hover:underline inline-block">
                ← Проверить другой договор
              </button>
              
              <button 
                onClick={() => window.print()} 
                className="bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-900 transition flex items-center gap-2 shadow-sm"
              >
                📥 Скачать в PDF
              </button>
            </div>

            <div className="bg-white rounded-xl border p-6 shadow-sm">
              <div className="flex items-baseline justify-between">
                <div>
                  <p className="text-sm text-gray-500">{report.contract_type}</p>
                  <h2 className="text-2xl font-bold mt-1">Отчёт о рисках</h2>
                </div>
                <div className="text-right">
                  <div className={`text-5xl font-bold ${report.overall_risk_score >= 7 ? 'text-red-600' : report.overall_risk_score >= 4 ? 'text-yellow-600' : 'text-green-600'}`}>
                    {report.overall_risk_score}<span className="text-2xl text-gray-400">/10</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">индекс риска</p>
                </div>
              </div>
              <p className="mt-4 text-gray-700">{report.summary}</p>
            </div>

            {(report.risks || []).map((risk: any, i: number) => {
              const level = (risk.risk_level || 'low').toLowerCase();
              const isHigh = level === 'high';
              const isMedium = level === 'medium';
              
              const borderColor = isHigh ? 'border-red-500' : isMedium ? 'border-yellow-500' : 'border-green-500';
              const bgColor = isHigh ? 'bg-red-100 text-red-800' : isMedium ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800';
              const label = isHigh ? 'Высокий риск' : isMedium ? 'Средний риск' : 'Низкий риск';

              return (
                <div key={i} className={`bg-white rounded-xl border-l-4 p-5 shadow-sm ${borderColor}`}>
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`text-xs font-semibold px-2 py-1 rounded ${bgColor}`}>
                      {label}
                    </span>
                  </div>
                  <blockquote className="text-sm text-gray-600 italic border-l-2 border-gray-200 pl-3 mb-3">
                    «{risk.clause_text}»
                  </blockquote>
                  <p className="text-gray-800 mb-3">{risk.explanation}</p>
                  <div className="bg-blue-50 rounded-lg p-3">
                    <p className="text-xs font-semibold text-blue-800 mb-1">💡 Как исправить</p>
                    <p className="text-sm text-blue-900">{risk.recommendation}</p>
                  </div>
                </div>
              );
            })}
            
            {(!report.risks || report.risks.length === 0) && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center">
                <p className="font-medium text-yellow-800">ИИ не нашел очевидных рисков</p>
                <p className="text-sm text-yellow-700 mt-1">
                  Однако это не гарантия безопасности. Проконсультируйтесь с юристом перед подписанием.
                </p>
              </div>
            )}

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center mt-8">
              <p className="text-xs text-gray-400 leading-relaxed">
                Настоящий отчет сгенерирован AI-моделью и может содержать неточности. Он не является юридическим заключением.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}