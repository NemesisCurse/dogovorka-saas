"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const router = useRouter();

  // Алгоритм Луна для проверки валидности карты
  const isValidCard = (number: string) => {
    const cleanNumber = number.replace(/\D/g, '');
    if (cleanNumber.length !== 16) return false;
    
    let sum = 0;
    let shouldDouble = false;
    for (let i = cleanNumber.length - 1; i >= 0; i--) {
      let digit = parseInt(cleanNumber.charAt(i));
      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      sum += digit;
      shouldDouble = !shouldDouble;
    }
    return sum % 10 === 0;
  };

  // Автоформатирование номера карты (добавляет пробелы)
  const handleCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 16) value = value.slice(0, 16);
    const formatted = value.match(/.{1,4}/g)?.join(' ') || value;
    setCardNumber(formatted);
  };

  // Автоформатирование срока (добавляет слэш)
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 4) value = value.slice(0, 4);
    if (value.length >= 2) {
      value = value.slice(0, 2) + '/' + value.slice(2);
    }
    setExpiry(value);
  };

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();

    // Проверка номера карты
    if (!isValidCard(cardNumber)) {
      alert("❌ Ошибка: Неверный номер карты. Введите реальные 16 цифр.\n\nДля теста используйте: 4111 1111 1111 1111");
      return;
    }

    // Проверка срока действия
    if (!/^\d{2}\/\d{2}$/.test(expiry)) {
      alert("❌ Ошибка: Неверный формат срока действия. Используйте ММ/ГГ.");
      return;
    }

    // Проверка CVC
    if (cvc.length !== 3) {
      alert("❌ Ошибка: CVC код должен состоять из 3 цифр.");
      return;
    }

    setIsProcessing(true);
    
    setTimeout(() => {
      alert("✅ Тестовая оплата прошла успешно! В реальном проекте здесь будет интеграция с ЮKassa.");
      router.push("/dashboard");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Оформление подписки</h1>
          <p className="text-gray-500">Тариф «Профи» — 990 ₽/мес</p>
        </div>

        <form onSubmit={handlePayment} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Номер карты</label>
            <input 
              type="text" 
              placeholder="0000 0000 0000 0000" 
              value={cardNumber}
              onChange={handleCardChange}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-mono" 
              required 
            />
            <p className="text-xs text-gray-400 mt-1">Для теста: 4111 1111 1111 1111</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Срок действия</label>
              <input 
                type="text" 
                placeholder="ММ/ГГ" 
                value={expiry}
                onChange={handleExpiryChange}
                maxLength={5}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-mono" 
                required 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">CVC</label>
              <input 
                type="text" 
                placeholder="123" 
                value={cvc}
                onChange={(e) => setCvc(e.target.value.replace(/\D/g, ''))}
                maxLength={3}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-mono" 
                required 
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isProcessing}
            className="w-full mt-6 bg-green-500 text-white font-bold py-4 rounded-xl hover:bg-green-600 transition disabled:opacity-50 flex justify-center items-center"
          >
            {isProcessing ? "Соединение с банком..." : "Оплатить 990 ₽"}
          </button>
          
          <p className="text-xs text-center text-gray-400 mt-4">
            Нажимая кнопку, вы принимаете условия <Link href="/terms" className="underline">оферты</Link>.
          </p>
        </form>
        
        <div className="mt-6 text-center">
          <Link href="/" className="text-sm text-blue-600 hover:underline">← Вернуться на главную</Link>
        </div>
      </div>
    </div>
  );
}