import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      {/* Навигация */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto border-b">
        <div className="font-bold text-2xl text-blue-600">Договорка</div>
        <div className="flex gap-4 items-center">
          <Link href="/auth/login" className="text-gray-600 hover:text-blue-600 font-medium transition hidden sm:block">
            Войти
          </Link>
          <Link href="/dashboard" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition">
            Личный кабинет
          </Link>
        </div>
      </nav>

      {/* Главный экран */}
      <header className="text-center py-24 px-4 bg-gray-50">
        <h1 className="text-5xl font-extrabold tracking-tight mb-6 max-w-3xl mx-auto">
          Заказчик прислал договор? <br/> <span className="text-blue-600">Проверьте его за 30 секунд.</span>
        </h1>
        <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
          Искусственный интеллект проанализирует ваш договор, найдет скрытые риски и подскажет, как их исправить.
        </p>
        <Link href="/dashboard" className="inline-block px-8 py-4 bg-blue-600 text-white text-lg font-bold rounded-xl shadow-lg hover:bg-blue-700 transition transform hover:-translate-y-1">
          Проверить договор бесплатно
        </Link>
        <p className="text-sm text-gray-400 mt-4">Первые 3 проверки — бесплатно. Без привязки карты.</p>
      </header>

      {/* Как это работает */}
      <section className="py-20 max-w-5xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Как это работает</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="text-4xl mb-4">📄</div>
            <h3 className="font-bold text-xl mb-2">1. Загрузите файл</h3>
            <p className="text-gray-500">PDF, DOCX или TXT. Мы безопасно извлечем текст.</p>
          </div>
          <div className="text-center p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="text-4xl mb-4">🧠</div>
            <h3 className="font-bold text-xl mb-2">2. ИИ анализирует</h3>
            <p className="text-gray-500">Нейросеть находит кабальные условия, штрафы и скрытые уловки.</p>
          </div>
          <div className="text-center p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="text-4xl mb-4">🛡️</div>
            <h3 className="font-bold text-xl mb-2">3. Получите отчет</h3>
            <p className="text-gray-500">Вы видите цитату из договора и готовую рекомендацию, как исправить.</p>
          </div>
        </div>
      </section>

      {/* Тарифы */}
      <section className="py-20 bg-gray-50 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Простые и честные тарифы</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Free */}
            <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
              <h3 className="text-2xl font-bold mb-2">Старт</h3>
              <p className="text-gray-500 mb-6">Для знакомства с сервисом</p>
              <div className="text-4xl font-bold mb-6">0 ₽</div>
              <ul className="space-y-3 mb-8 text-sm text-gray-600">
                <li>✅ 3 проверки в месяц</li>
                <li>✅ Базовые риски</li>
                <li>✅ Экспорт в PDF</li>
              </ul>
              <Link href="/dashboard" className="block text-center w-full py-3 bg-gray-100 text-gray-800 font-semibold rounded-lg hover:bg-gray-200 transition">
                Начать бесплатно
              </Link>
            </div>
            {/* Pro */}
            <div className="bg-white p-8 rounded-2xl border-2 border-blue-600 shadow-xl relative transform md:-translate-y-4">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wide">Популярный</div>
              <h3 className="text-2xl font-bold mb-2">Профи</h3>
              <p className="text-gray-500 mb-6">Для фрилансеров и агентств</p>
              <div className="text-4xl font-bold mb-6">990 ₽ <span className="text-lg text-gray-400 font-normal">/мес</span></div>
              <ul className="space-y-3 mb-8 text-sm text-gray-600">
                <li>✅ Безлимитные проверки</li>
                <li>✅ Все скрытые риски</li>
                <li>✅ Рекомендации по исправлению</li>
                <li>✅ Приоритетная поддержка</li>
              </ul>
              <Link href="/checkout" className="block text-center w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition">
                Оформить подписку
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Футер */}
      <footer className="border-t py-10 text-center text-sm text-gray-500">
        <p className="mb-4">© 2026 Договорка. Все права защищены.</p>
        <div className="flex justify-center gap-6">
          <Link href="/support" className="hover:text-blue-600 font-medium">Поддержка</Link>
          <Link href="/terms" className="hover:text-blue-600">Пользовательское соглашение</Link>
          <Link href="/privacy" className="hover:text-blue-600">Политика конфиденциальности</Link>
        </div>
      </footer>
    </div>
  );
}