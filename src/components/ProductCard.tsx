import type { Producto } from '@/types';

export default function ProductCard({ prod, onSelect }:{
  prod: Producto; onSelect: (p: Producto) => void;
}) {
  return (
    <div onClick={() => onSelect(prod)}
      className="bg-white p-3 rounded-lg shadow hover:scale-105 transition-transform cursor-pointer">
      <div className="w-full aspect-[3/4] overflow-hidden rounded mb-2">
        <img src={prod.imagenes?.[0] || '/images/logo.jpg'} alt={prod.nombre}
             className="w-full h-full object-cover" />
      </div>
      <div className="min-h-[3.25rem]">
        <h4 className="text-[#4B2E2E] font-semibold text-center leading-tight break-words whitespace-normal text-sm">
          {prod.nombre}
        </h4>
      </div>
      <p className="text-[#8C4A2F] text-center text-sm">Q{prod.precio ?? 0}</p>
    </div>
  );
}
