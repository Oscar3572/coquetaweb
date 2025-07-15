'use client';

import { useRouter } from 'next/navigation';
import { Box, ClipboardList, FileText, Layers, BarChart3 } from 'lucide-react';

export default function AdminDashboard() {
  const router = useRouter();

  const goTo = (path: string) => router.push(path);

  return (
    <div className="bg-white rounded-2xl shadow-xl p-10 font-['Times New Roman',serif]">
      <h1 className="text-3xl font-bold text-black mb-6">
        Bienvenida Coqueta Administración
      </h1>
      <p className="text-lg text-gray-700 mb-8">¿Qué deseas hacer hoy?</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          {
            label: 'Ver Inventario',
            icon: <Box size={28} />,
            path: '/admin/inventario',
          },
          {
            label: 'Registrar Producto',
            icon: <ClipboardList size={28} />,
            path: '/admin/registrar',
          },
          {
            label: 'Registro de Ventas',
            icon: <FileText size={28} />,
            path: '/admin/ventas',
          },
          {
            label: 'Crear Categorías/Subcategorías',
            icon: <Layers size={28} />,
            path: '/admin/categorias',
          },
          {
            label: 'Ver Reportes',
            icon: <BarChart3 size={28} />,
            path: '/admin/reportes',
          },
        ].map((item, idx) => (
          <div
            key={idx}
            onClick={() => goTo(item.path)}
            className="cursor-pointer bg-[#ffe6ec] hover:bg-[#fdb4bf] text-black border border-pink-200 rounded-xl p-6 flex items-center gap-4 shadow-sm transition-all"
          >
            {item.icon}
            <span className="text-lg">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
