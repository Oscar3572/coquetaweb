'use client';
import { useEffect, useMemo, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import type { Producto } from '@/types';

export function useProducts() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<string[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');
  const [subcategoriaSeleccionada, setSubcategoriaSeleccionada] = useState('');
  const [filtroActivo, setFiltroActivo] = useState(0);

  useEffect(() => {
    const fetchAll = async () => {
      const snapProd = await getDocs(collection(db, 'productos'));
      const productosRaw = snapProd.docs.map(d => ({ id: d.id, ...d.data() })) as Producto[];

      const snapCat = await getDocs(collection(db, 'categorias'));
      const catMap = Object.fromEntries(snapCat.docs.map(d => [d.id, d.data().nombre]));

      const snapSub = await getDocs(collection(db, 'subcategorias'));
      const subMap = Object.fromEntries(snapSub.docs.map(d => [d.id, d.data().nombre]));

      setProductos(productosRaw.map(p => ({
        ...p,
        categoriaNombre: catMap[p.categoria] || 'Sin categoría',
        subcategoriaNombre: subMap[p.subcategoria || ''] || ''
      })));

      setCategorias(snapCat.docs.map(d => d.data().nombre));
    };
    fetchAll();
  }, []);

  const productosFiltrados = useMemo(() => {
    return productos.filter((p) => {
      const q = busqueda.toLowerCase();
      const okBusqueda = p.nombre?.toLowerCase().includes(q);
      const okCat = !categoriaSeleccionada || p.categoriaNombre === categoriaSeleccionada;
      const okSub = !subcategoriaSeleccionada || p.subcategoria === subcategoriaSeleccionada;
      return okBusqueda && okCat && okSub;
    });
  }, [productos, busqueda, categoriaSeleccionada, subcategoriaSeleccionada, filtroActivo]);

  return {
    categorias,
    productosFiltrados,
    // filtros + setters
    busqueda, setBusqueda,
    categoriaSeleccionada, setCategoriaSeleccionada,
    subcategoriaSeleccionada, setSubcategoriaSeleccionada,
    setFiltroActivo,
  };
}
