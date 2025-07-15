// Aquí tienes el módulo completo de registro de ventas integrado
'use client';

import { useEffect, useState, useMemo } from 'react';
import { db } from '@/lib/firebase';
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  addDoc,
  Timestamp,
} from 'firebase/firestore';

interface Producto {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  categoria: string;
  subcategoria?: string;
  imagenes: string[];
  video?: string;
  categoriaNombre?: string;
  subcategoriaNombre?: string;
}

interface VentaItem {
  producto: Producto;
  cantidad: number;
}

export default function RegistroVentas() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<string[]>([]);
  const [subcategorias, setSubcategorias] = useState<string[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');
  const [subcategoriaSeleccionada, setSubcategoriaSeleccionada] = useState('');
  const [venta, setVenta] = useState<VentaItem[]>([]);
  const [efectivo, setEfectivo] = useState<number>(0);
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const prodSnap = await getDocs(collection(db, 'productos'));
      const catSnap = await getDocs(collection(db, 'categorias'));
      const subSnap = await getDocs(collection(db, 'subcategorias'));

      setProductos(prodSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Producto[]);
      setCategorias(catSnap.docs.map(doc => doc.data().nombre));
      setSubcategorias(subSnap.docs.map(doc => doc.data().nombre));
    };
    fetchData();
  }, []);

  const productosFiltrados = useMemo(() => {
    return productos.filter(prod => {
      const coincideNombre = prod.nombre?.toLowerCase().includes(busqueda.toLowerCase());
      const coincideCategoria = !categoriaSeleccionada || prod.categoriaNombre === categoriaSeleccionada;
      const coincideSubcategoria = !subcategoriaSeleccionada || prod.subcategoriaNombre === subcategoriaSeleccionada;
      return coincideNombre && coincideCategoria && coincideSubcategoria;
    });
  }, [productos, busqueda, categoriaSeleccionada, subcategoriaSeleccionada]);

  const agregarProducto = (producto: Producto) => {
    const existente = venta.find(item => item.producto.id === producto.id);
    if (existente) {
      setVenta(prev => prev.map(item =>
        item.producto.id === producto.id
          ? { ...item, cantidad: item.cantidad + 1 }
          : item
      ));
    } else {
      setVenta(prev => [...prev, { producto, cantidad: 1 }]);
    }
  };

  const cambiarCantidad = (id: string, cantidad: number) => {
    setVenta(prev => prev.map(item =>
      item.producto.id === id ? { ...item, cantidad } : item
    ));
  };

  const eliminarProducto = (id: string) => {
    setVenta(prev => prev.filter(item => item.producto.id !== id));
  };

  const total = useMemo(() => {
    return venta.reduce((sum, item) => sum + item.producto.precio * item.cantidad, 0);
  }, [venta]);

  const cambio = useMemo(() => {
    return efectivo - total;
  }, [efectivo, total]);

  const registrarVenta = async () => {
    if (venta.length === 0) {
      setMensaje('Agrega productos para registrar la venta.');
      return;
    }
    if (efectivo < total) {
      setMensaje('El efectivo recibido es insuficiente.');
      return;
    }
    try {
      await addDoc(collection(db, 'ventas'), {
        fecha: Timestamp.now(),
        productos: venta.map(item => ({
          id: item.producto.id,
          nombre: item.producto.nombre,
          cantidad: item.cantidad,
          precio: item.producto.precio,
        })),
        total,
        efectivo,
        cambio,
      });

      for (const item of venta) {
        const ref = doc(db, 'productos', item.producto.id);
        await updateDoc(ref, {
          stock: item.producto.stock - item.cantidad
        });
      }

      setMensaje('¡Venta registrada exitosamente!');
      setVenta([]);
      setEfectivo(0);
    } catch (e) {
      console.error(e);
      setMensaje('Ocurrió un error al registrar la venta.');
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto bg-white min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Registro de Ventas</h1>

      <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          type="text"
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
          placeholder="Buscar por nombre"
          className="border px-4 py-2 rounded"
        />
        <select
          value={categoriaSeleccionada}
          onChange={e => setCategoriaSeleccionada(e.target.value)}
          className="border px-4 py-2 rounded"
        >
          <option value=''>Todas las categorías</option>
          {categorias.map((cat, i) => (
            <option key={i} value={cat}>{cat}</option>
          ))}
        </select>
        <select
          value={subcategoriaSeleccionada}
          onChange={e => setSubcategoriaSeleccionada(e.target.value)}
          className="border px-4 py-2 rounded"
        >
          <option value=''>Todas las subcategorías</option>
          {subcategorias.map((sub, i) => (
            <option key={i} value={sub}>{sub}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {productosFiltrados.map((prod) => (
          <div key={prod.id} className="border p-3 rounded shadow">
            <img
              src={prod.imagenes?.[0] || ''}
              alt={prod.nombre}
              className="w-full h-32 object-cover rounded mb-2"
            />
            <h3 className="font-semibold text-sm">{prod.nombre}</h3>
            <p className="text-sm text-gray-600">Q{prod.precio}</p>
            <button
              className="bg-pink-500 text-white mt-2 px-3 py-1 rounded text-sm"
              onClick={() => agregarProducto(prod)}
            >
              Agregar
            </button>
          </div>
        ))}
      </div>

      <h2 className="text-lg font-bold mb-2">Productos seleccionados</h2>
      {venta.length === 0 ? (
        <p className="text-sm">No hay productos agregados.</p>
      ) : (
        <table className="w-full mb-4 text-sm">
          <thead>
            <tr>
              <th className="text-left">Nombre</th>
              <th>Cantidad</th>
              <th>Precio</th>
              <th>Subtotal</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {venta.map(item => (
              <tr key={item.producto.id}>
                <td>{item.producto.nombre}</td>
                <td>
                  <input
                    type="number"
                    min={1}
                    max={item.producto.stock}
                    value={item.cantidad}
                    onChange={e => cambiarCantidad(item.producto.id, parseInt(e.target.value))}
                    className="w-16 border rounded px-1 py-0.5"
                  />
                </td>
                <td>Q{item.producto.precio}</td>
                <td>Q{(item.producto.precio * item.cantidad).toFixed(2)}</td>
                <td>
                  <button
                    onClick={() => eliminarProducto(item.producto.id)}
                    className="text-red-600 hover:underline"
                  >
                    Quitar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="mb-2 font-medium">Total: Q{total.toFixed(2)}</div>

      <div className="flex items-center gap-4 mb-4">
        <label htmlFor="efectivo">Efectivo recibido:</label>
        <input
          type="number"
          id="efectivo"
          value={efectivo}
          onChange={e => setEfectivo(parseFloat(e.target.value))}
          className="border px-3 py-1 rounded"
        />
      </div>

      <div className="mb-4 font-medium">
        Cambio: Q{cambio < 0 ? '0.00' : cambio.toFixed(2)}
      </div>

      <button
        onClick={registrarVenta}
        className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
      >
        Registrar venta
      </button>

      {mensaje && <p className="mt-4 text-pink-600 font-medium">{mensaje}</p>}
    </div>
  );
}
