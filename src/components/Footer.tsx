export default function Footer() {
  return (
    <footer className="bg-[#F7A8B8] text-[#4B2E2E] px-6 py-10 mt-16">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        <div className="flex items-center gap-2">
          <img src="/images/logo.jpg" className="w-10 h-10 rounded-full" />
          <span className="text-lg font-bold">
            COQUETA <span className="italic font-normal">by Nicolle</span>
          </span>
        </div>
        <div className="text-center text-sm">Navegación • Home • Shop • Ofertas • Contacto</div>
        <div className="text-right text-sm">
          <p>&quot;Tu belleza, tu esencia, tu poder.&quot;</p>
          <p className="mt-2">&copy; 2025 Coqueta by Nicolle.</p>
        </div>
      </div>
    </footer>
  );
}
