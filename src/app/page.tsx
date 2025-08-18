'use client';
import { useState } from 'react';
import { useProducts } from '@/hooks/useProducts';
import { useCart } from '@/hooks/useCart';
import type { Producto } from '@/types';

import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Favorites from '@/components/Favorites';
import ProductGrid from '@/components/ProductGrid';
import ProductDetailModal from '@/components/ProductDetailModal';
import CartPanel from '@/components/CartPanel';
import Footer from '@/components/Footer';

export default function HomePage() {
  const {
    categorias, productosFiltrados,
    setBusqueda, setCategoriaSeleccionada
  } = useProducts();

  const { carrito, add, total, count, setCarrito } = useCart();

  const [mostrarCarrito, setMostrarCarrito] = useState(false);
  const [productoActivo, setProductoActivo] = useState<Producto | null>(null);

  return (
    <div className="font-serif bg-[#FDE9EF] min-h-screen relative">
      <Header
        categorias={categorias}
        onPickCategoria={(c)=>{ setCategoriaSeleccionada(c); document.getElementById('catalogo')?.scrollIntoView({behavior:'smooth'}) }}
        onSearch={setBusqueda}
        onOpenCart={()=>setMostrarCarrito(true)}
        cartCount={count}
      />

      <Hero />
      <Favorites />

      {/* CATÁLOGO */}
      <section id="catalogo" className="bg-[#F6EDED] px-6 pb-24 pt-8">
        <h2 className="text-3xl font-bold text-[#4B2E2E] mb-6 text-center">Catálogo de productos</h2>
        <ProductGrid
          productos={productosFiltrados}
          onSelect={(p)=>setProductoActivo(p)}
        />
      </section>

      <Footer />

      {/* MODAL DETALLE */}
      {productoActivo && (
        <ProductDetailModal
          producto={productoActivo}
          onClose={()=>setProductoActivo(null)}
          onAddToCart={(p, q)=>{ add(p, q); alert('Producto añadido al carrito'); }}
        />
      )}

      {/* CARRITO */}
      {mostrarCarrito && (
        <CartPanel
          items={carrito}
          total={total}
          onClose={()=>setMostrarCarrito(false)}
        />
      )}
    </div>
  );
}
