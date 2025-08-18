// src/components/Header.tsx
'use client';
import { ShoppingCart } from 'lucide-react';

const getInitials = (name?: string) =>
  (name || 'LG')
    .trim()
    .split(/\s+/)
    .map((w) => w[0]?.toUpperCase())
    .slice(0, 2)
    .join('') || 'LG';

export default function Header({
  categorias,
  onPickCategoria,
  onSearch,
  onOpenCart,
  cartCount,
}: {
  categorias: string[];
  onPickCategoria: (c: string) => void;
  onSearch: (q: string) => void;
  onOpenCart: () => void;
  cartCount: number;
}) {
  return (
    <header className="bg-[#F7A8B8] p-4 flex flex-wrap justify-between items-center sticky top-0 z-50 shadow-md">
      <div className="flex items-center gap-2">
        <img src="/images/logo.jpg" alt="logo" className="w-8 h-8 rounded-full" />
        <span className="font-bold text-xl text-[#4B2E2E]">
          COQUETA <span className="font-normal italic text-sm">by Nicolle</span>
        </span>
      </div>

      <nav className="flex flex-wrap gap-4 items-center text-[#4B2E2E] mt-2 md:mt-0">
        <button className="hover:underline">Home</button>
        <button className="hover:underline">Shop</button>

        <div className="relative">
          <details>
            <summary className="cursor-pointer list-none hover:underline">Categorías ▾</summary>
            <div className="absolute bg-white mt-2 shadow rounded-md w-44 z-50">
              {categorias.map((c) => (
                <button
                  key={c}
                  onClick={() => onPickCategoria(c)}
                  className="block px-4 py-2 text-left w-full hover:bg-pink-100 text-[#4B2E2E]"
                >
                  {c}
                </button>
              ))}
            </div>
          </details>
        </div>

        <a href="#ofertas" className="hover:underline">
          Ofertas
        </a>
        <a href="#contacto" className="hover:underline">
          Contacto
        </a>

        <input
          type="text"
          placeholder="Buscar productos..."
          onChange={(e) => onSearch(e.target.value)}
          className="rounded-full px-4 py-1 text-sm bg-white shadow-inner outline-none"
        />

        {/* Carrito */}
        <div className="relative cursor-pointer" onClick={onOpenCart} aria-label="Abrir carrito">
          <ShoppingCart />
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full px-1">
              {cartCount}
            </span>
          )}
        </div>

        {/* Avatar/Login (LG) */}
        <a
          href="/login"
          className="ml-1 inline-flex items-center justify-center w-9 h-9 rounded-full bg-white text-[#4B2E2E] font-semibold shadow hover:bg-pink-50"
          title="Iniciar sesión"
          aria-label="Iniciar sesión"
        >
          {getInitials('LG')}
        </a>
      </nav>
    </header>
  );
}
