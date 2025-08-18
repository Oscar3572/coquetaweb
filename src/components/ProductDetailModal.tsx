// src/components/ProductDetailModal.tsx
'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { Producto } from '@/types';

export default function ProductDetailModal({
  producto,
  onClose,
  onAddToCart,
}: {
  producto: Producto;
  onClose: () => void;
  onAddToCart: (p: Producto, q: number) => void;
}) {
  const imgs = useMemo(() => {
    const arr = Array.isArray(producto.imagenes) ? producto.imagenes : [];
    return arr.length ? arr : ['/images/logo.jpg'];
  }, [producto]);

  const [idx, setIdx] = useState(0);
  const [qty, setQty] = useState(1);
  const panelRef = useRef<HTMLDivElement>(null);

  // Texto de descripción (acepta varios campos)
  const desc =
    producto.descripcion ??
    (producto as any).detalle ??
    (producto as any).subtitulo ??
    '';

  // Evitar scroll del body mientras el modal está abierto
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  // Cerrar con Esc
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  // Cerrar haciendo click fuera del panel
  const onBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!panelRef.current) return;
    if (!panelRef.current.contains(e.target as Node)) onClose();
  };

  const goPrev = () => setIdx((i) => (i - 1 + imgs.length) % imgs.length);
  const goNext = () => setIdx((i) => (i + 1) % imgs.length);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 p-4 md:p-6"
      onMouseDown={onBackdropClick}
      aria-modal="true"
      role="dialog"
    >
      <div
        ref={panelRef}
        className="relative mx-auto bg-white text-[#4B2E2E] rounded-xl shadow-lg w-full max-w-md md:max-w-4xl overflow-hidden max-h-[90vh]"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Cerrar */}
        <button
          onClick={onClose}
          className="absolute right-3 top-3 inline-flex items-center justify-center w-9 h-9 rounded-full bg-neutral-100 hover:bg-neutral-200"
          aria-label="Cerrar"
        >
          ✕
        </button>

        {/* Contenido con scroll si se necesita */}
        <div className="md:flex gap-6 p-4 md:p-6 overflow-y-auto">
          {/* MEDIA / CARRUSEL */}
          <div className="md:w-1/2 w-full">
            <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-neutral-100">
              <img
                src={imgs[idx]}
                alt={producto.nombre}
                className="w-full h-full object-cover"
              />

              {imgs.length > 1 && (
                <>
                  <button
                    onClick={goPrev}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white shadow"
                    aria-label="Anterior"
                  >
                    ‹
                  </button>
                  <button
                    onClick={goNext}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white shadow"
                    aria-label="Siguiente"
                  >
                    ›
                  </button>
                </>
              )}
            </div>

            {imgs.length > 1 && (
              <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                {imgs.map((src, i) => (
                  <button
                    key={i}
                    onClick={() => setIdx(i)}
                    className={`shrink-0 w-16 aspect-square rounded-md overflow-hidden border ${
                      i === idx ? 'border-rose-400' : 'border-neutral-200'
                    }`}
                    aria-label={`Imagen ${i + 1}`}
                  >
                    <img src={src} alt={`thumb-${i}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* INFO */}
          <div className="md:w-1/2 w-full mt-4 md:mt-0 text-[#4B2E2E]">
            <h3 className="text-2xl md:text-3xl font-semibold leading-snug break-words whitespace-normal">
              {producto.nombre}
            </h3>

            <p className="text-amber-800 font-semibold text-xl mt-1">
              Q{producto.precio}
            </p>

            <p className="text-sm text-neutral-700 mt-1">
              {producto.stock > 0
                ? `Disponible (${producto.stock} ${producto.stock === 1 ? 'unidad' : 'unidades'})`
                : 'Agotado'}
            </p>

            {/* DESCRIPCIÓN */}
            {desc && (
              <div className="mt-3 text-sm text-neutral-700 leading-relaxed">
                <p className="whitespace-pre-line">{desc}</p>
              </div>
            )}

            {/* CANTIDAD */}
            <div className="flex items-center gap-3 mt-4">
              <label className="text-sm" htmlFor="qty-input">
                Cantidad:
              </label>
              <input
                id="qty-input"
                type="number"
                min={1}
                value={qty}
                onChange={(e) =>
                  setQty(Math.max(1, Number(e.target.value) || 1))
                }
                className="w-20 h-10 rounded border border-neutral-300 px-2 text-[#4B2E2E] bg-white"
              />
            </div>

            {/* BOTONES */}
            <div className="flex flex-col sm:flex-row gap-3 mt-4">
              <button
                type="button"
                onClick={() => onAddToCart(producto, qty)}
                className="flex-1 h-11 rounded-full bg-rose-400 hover:bg-rose-500 text-white font-medium"
              >
                Añadir al carrito
              </button>

              <a
                target="_blank"
                rel="noopener noreferrer"
                href={`https://wa.me/50234850804?text=${encodeURIComponent(
                  `Hola, me interesa: ${producto.nombre} (Q${producto.precio}) x${qty}`
                )}`}
                className="flex-1 h-11 rounded-full bg-green-500 hover:bg-green-600 text-white font-medium text-center leading-[44px]"
              >
                WhatsApp
              </a>
            </div>

            <button
              onClick={onClose}
              className="mt-4 text-rose-600 underline"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
