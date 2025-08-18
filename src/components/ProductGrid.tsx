import type { Producto } from '@/types';
import ProductCard from './ProductCard';

export default function ProductGrid({ productos, onSelect }:{
  productos: Producto[]; onSelect:(p:Producto)=>void;
}) {
  return (
    <div className="max-w-6xl mx-auto grid grid-cols-3 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {productos.map((p) => (
        <div key={p.id} className="relative">
          <ProductCard prod={p} onSelect={onSelect} />
        </div>
      ))}
    </div>
  );
}
