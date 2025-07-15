'use client';
import Link from "next/link";
import { ReactNode } from "react";
import {
  LayoutDashboard,
  Box,
  ClipboardList,
  FileText,
  Layers,
  BarChart3,
  LogOut
} from 'lucide-react';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen font-[Times_New_Roman] bg-[#ffe6ec]">
      {/* Sidebar */}
      <aside className="w-64 bg-[#ffddd9] p-6 shadow-xl flex flex-col justify-between">
        <div>
          <h2 className="text-xl font-bold text-pink-800 mb-8">COQUETA</h2>
          <nav className="flex flex-col gap-1 text-black">
            <Link href="/admin" className="flex items-center gap-2 px-3 py-2 rounded hover:bg-[#fde4ea] transition">
              <LayoutDashboard size={20} /> Dashboard
            </Link>
            <Link href="/admin/inventario" className="flex items-center gap-2 px-3 py-2 rounded hover:bg-[#fde4ea] transition">
              <Box size={20} /> Inventario
            </Link>
            <Link href="/admin/registrar" className="flex items-center gap-2 px-3 py-2 rounded hover:bg-[#fde4ea] transition">
              <ClipboardList size={20} /> Registrar Producto
            </Link>
            <Link href="/admin/ventas" className="flex items-center gap-2 px-3 py-2 rounded hover:bg-[#fde4ea] transition">
              <FileText size={20} /> Registro de Ventas
            </Link>
            <Link href="/admin/categorias" className="flex items-center gap-2 px-3 py-2 rounded hover:bg-[#fde4ea] transition">
              <Layers size={20} /> Categorías
            </Link>
            <Link href="/admin/reportes" className="flex items-center gap-2 px-3 py-2 rounded hover:bg-[#fde4ea] transition">
              <BarChart3 size={20} /> Reportes
            </Link>
          </nav>
        </div>

        {/* Cerrar sesión */}
        <button
          onClick={() => window.location.href = '/login'}
          className="flex items-center gap-2 text-black hover:text-[#d32f2f] transition"
        >
          <LogOut size={20} /> Cerrar sesión
        </button>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-10 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
