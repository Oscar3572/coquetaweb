export default function Hero() {
  return (
    <section className="bg-[#FDE9EF] min-h-[60vh] flex items-center px-6 py-10">
      <div className="max-w-7xl w-full mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div className="text-center md:text-left">
          <h1 className="text-5xl font-extrabold text-[#4B2E2E] mb-2">
            COQUETA <span className="italic font-normal">by Nicolle</span>
          </h1>
          <p className="text-[#6B4E4E] text-base md:text-lg mb-6">
            Productos de belleza que resaltan lo mejor de ti.
          </p>
          <a href="#catalogo" className="bg-[#D8A48F] hover:bg-[#bb8588] text-white px-6 py-2 rounded-full">
            Ver productos
          </a>
        </div>
        <div className="grid grid-cols-2 gap-4 justify-center">
          <img src="/images/benetint.jpg" className="rounded-lg shadow-lg w-full h-40 object-cover" />
          <img src="/images/bisu.jpg" className="rounded-lg shadow-lg w-full h-40 object-cover" />
          <img src="/images/pat.jpg" className="rounded-lg shadow-lg w-full h-40 object-cover col-span-2" />
        </div>
      </div>
    </section>
  );
}
