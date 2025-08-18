'use client';
import Link from "next/link";
import { ReactNode, useState, useEffect } from "react";
import {
  LayoutDashboard,
  Box,
  ClipboardList,
  FileText,
  Layers,
  BarChart3,
  LogOut,
  X,
  Menu
} from 'lucide-react';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  // Cierra el drawer al cambiar tamaño a desktop
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setOpen(false);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return (
    <div className="min-h-screen font-[Times_New_Roman] bg-[#ffe6ec] flex">

      {/* Topbar solo móvil */}
      <div className="md:hidden sticky top-0 z-40 w-full bg-[#ffddd9] p-3 flex items-center justify-between shadow">
        <button
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 text-[#4B2E2E]"
          aria-label="Abrir menú"
        >
          <Menu size={22} />
          <span className="font-semibold">Menú</span>
        </button>
        <h1 className="text-[#4B2E2E] font-bold">COQUETA</h1>
        <button
          onClick={() => (window.location.href = '/login')}
          className="text-[#4B2E2E] text-sm"
        >
          Salir
        </button>
      </div>

      {/* Backdrop móvil */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar: drawer en móvil, fijo en desktop */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-[#ffddd9] p-6 shadow-xl flex flex-col justify-between transform transition-transform duration-200
        ${open ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
      >
        <div>
          {/* Header del drawer en móvil */}
          <div className="md:hidden flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-pink-800">COQUETA</h2>
            <button
              onClick={() => setOpen(false)}
              className="p-1 rounded hover:bg-[#fde4ea]"
              aria-label="Cerrar menú"
            >
              <X size={20} />
            </button>
          </div>

          <h2 className="hidden md:block text-xl font-bold text-pink-800 mb-8">COQUETA</h2>

          <nav className="flex flex-col gap-1 text-black">
            <Link href="/admin" className="flex items-center gap-2 px-3 py-2 rounded hover:bg-[#fde4ea] transition" onClick={() => setOpen(false)}>
              <LayoutDashboard size={20} /> Dashboard
            </Link>
            <Link href="/admin/inventario" className="flex items-center gap-2 px-3 py-2 rounded hover:bg-[#fde4ea] transition" onClick={() => setOpen(false)}>
              <Box size={20} /> Inventario
            </Link>
            <Link href="/admin/registrar" className="flex items-center gap-2 px-3 py-2 rounded hover:bg-[#fde4ea] transition" onClick={() => setOpen(false)}>
              <ClipboardList size={20} /> Registrar Producto
            </Link>
            <Link href="/admin/ventas" className="flex items-center gap-2 px-3 py-2 rounded hover:bg-[#fde4ea] transition" onClick={() => setOpen(false)}>
              <FileText size={20} /> Registro de Ventas
            </Link>
            <Link href="/admin/categorias" className="flex items-center gap-2 px-3 py-2 rounded hover:bg-[#fde4ea] transition" onClick={() => setOpen(false)}>
              <Layers size={20} /> Categorías
            </Link>
            <Link href="/admin/reportes" className="flex items-center gap-2 px-3 py-2 rounded hover:bg-[#fde4ea] transition" onClick={() => setOpen(false)}>
              <BarChart3 size={20} /> Reportes
            </Link>
          </nav>
        </div>

        <button
          onClick={() => (window.location.href = '/login')}
          className="flex items-center gap-2 text-black hover:text-[#d32f2f] transition"
        >
          <LogOut size={20} /> Cerrar sesión
        </button>
      </aside>

      {/* Contenido */}
      <main className="flex-1 w-full p-4 md:p-10 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
