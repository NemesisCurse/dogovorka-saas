"use client";

import { useState } from "react";
import Link from "next/link";

export default function SupportPage() {
  const [isSending, setIsSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("Вопрос по оплате");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    setError("");
    
    try {
      const response = await fetch('/api/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, subject, message })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Ошибка при отправке');
      }

      setSent(true);
      setEmail("");
      setMessage("");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
        
        <div className="text-center mb-8">
          <div className="text-4xl mb-4">💬</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Служба поддержки</h1>
          <p className="text-gray-500">Мы отвечаем в течение 24 часов</p>
        </div>

        {sent ? (
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
            <div className="text-3xl mb-2">✅</div>
            <h2 className="text-lg font-bold text-green-800 mb-2">Сообщение отправлено!</h2>
            <p className="text-sm text-green-700 mb-6">
              Мы получили ваш вопрос и скоро свяжемся с вами по указанному email.
            </p>
            <button 
              onClick={() => setSent(false)}
              className="text-blue-600 font-semibold hover:underline"
            >
              Отправить еще одно сообщение
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center border border-red-200">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ваш Email</label>
              <input 
                type="email" 
                placeholder="name@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                required 
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Тема обращения</label>
              <select 
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
              >
                <option>Вопрос по оплате</option>
                <option>Ошибка в работе сервиса</option>
                <option>Вопрос по тарифам</option>
                <option>Другое</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Сообщение</label>
              <textarea 
                rows={4} 
                placeholder="Опишите вашу проблему..." 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none" 
                required 
              ></textarea>
            </div>

            <button 
              type="submit" 
              disabled={isSending}
              className="w-full mt-2 bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition disabled:opacity-50"
            >
              {isSending ? "Отправка в Telegram..." : "Отправить сообщение"}
            </button>
          </form>
        )}

        <div className="mt-8 pt-6 border-t text-center text-sm text-gray-500">
          <p className="mb-2">Или напишите нам напрямую:</p>
          <a href="mailto:support@example.com" className="text-blue-600 font-medium hover:underline">
            support@example.com
          </a>
        </div>

        <div className="mt-6 text-center">
          <Link href="/" className="text-sm text-gray-500 hover:text-blue-600 transition">← На главную</Link>
        </div>
      </div>
    </div>
  );
}