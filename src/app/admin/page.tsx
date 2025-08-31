'use client';

import { useRouter } from 'next/navigation';
import {
  Box,
  ClipboardList,
  FileText,
  Layers,
  BarChart3,
  type LucideIcon,   // <-- ESTE es el tipo correcto
} from 'lucide-react';
// Alternativa equivalente:
// import type { LucideIcon } from 'lucide-react';

type Item = {
  label: string;
  icon: LucideIcon;
  path: string;
};

export default function AdminDashboard() {
  const router = useRouter();
  const goTo = (path: string) => router.push(path);

  const items: Item[] = [
    { label: 'Ver Inventario', icon: Box, path: '/admin/inventario' },
    { label: 'Registrar Producto', icon: ClipboardList, path: '/admin/registrar' },
    { label: 'Registro de Ventas', icon: FileText, path: '/admin/ventas' },
    { label: 'Crear Categorías/Subcategorías', icon: Layers, path: '/admin/categorias' },
    { label: 'Ver Reportes', icon: BarChart3, path: '/admin/reportes' },
  ];

  return (
    <section className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 md:p-10 font-['Times_New_Roman',serif]">
      <h1 className="text-2xl sm:text-3xl font-bold text-black mb-3 sm:mb-4">
        Bienvenida Coqueta Administración
      </h1>
      <p className="text-base sm:text-lg text-gray-700 mb-5 sm:mb-8">
        ¿Qué deseas hacer hoy?
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {items.map((item, idx) => {
          const Icon = item.icon;
          return (
            <button
              key={idx}
              type="button"
              onClick={() => goTo(item.path)}
              aria-label={item.label}
              className="text-left cursor-pointer bg-[#ffe6ec] hover:bg-[#fdb4bf] active:scale-[0.99]
                         text-black border border-pink-200 rounded-xl
                         px-4 py-4 sm:px-5 sm:py-5
                         flex items-center gap-3 sm:gap-4 shadow-sm transition-all
                         focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-400"
            >
              <Icon className="w-6 h-6 md:w-7 md:h-7" />
              <span className="text-base sm:text-lg">{item.label}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
