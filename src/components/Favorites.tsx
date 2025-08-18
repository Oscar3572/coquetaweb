export default function Favorites() {
  const favs = ['benetint', 'bisu', 'pat'];
  return (
    <section className="py-16 bg-[#F6EDED] text-center">
      <h2 className="text-3xl font-bold text-[#4B2E2E] mb-8">Nuestros productos favoritos</h2>
      <div className="flex flex-wrap justify-center gap-6 max-w-6xl mx-auto">
        {favs.map((img) => (
          <div key={img} className="bg-white p-4 rounded shadow w-64">
            <img src={`/images/${img}.jpg`} className="mx-auto rounded w-full h-48 object-cover" />
            <p className="text-[#4B2E2E] mt-4 text-sm capitalize">{img}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
