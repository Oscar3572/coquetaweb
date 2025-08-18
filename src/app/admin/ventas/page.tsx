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
    <div className="p-4 md:p-6 max-w-7xl mx-auto bg-white min-h-screen text-black">
      <h1 className="text-2xl md:text-3xl font-extrabold text-gray-800 mb-6">📦 Registro de Ventas</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <input
          type="text"
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
          placeholder="🔍 Buscar producto..."
          className="border px-4 py-2 rounded shadow text-black"
        />
        <select
          value={categoriaSeleccionada}
          onChange={e => setCategoriaSeleccionada(e.target.value)}
          className="border px-4 py-2 rounded shadow text-black"
        >
          <option value=''>Todas las categorías</option>
          {categorias.map((cat, i) => (
            <option key={i} value={cat}>{cat}</option>
          ))}
        </select>
        <select
          value={subcategoriaSeleccionada}
          onChange={e => setSubcategoriaSeleccionada(e.target.value)}
          className="border px-4 py-2 rounded shadow text-black"
        >
          <option value=''>Todas las subcategorías</option>
          {subcategorias.map((sub, i) => (
            <option key={i} value={sub}>{sub}</option>
          ))}
        </select>
      </div>

      {/* Catálogo compacto y responsive */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6 mb-8">
        {productosFiltrados.map((prod) => (
          <div key={prod.id} className="border rounded-xl p-3 shadow hover:shadow-lg transition">
            <img
              src={prod.imagenes?.[0] || ''}
              alt={prod.nombre}
              className="w-full h-32 object-cover rounded-md mb-2"
            />
            <h3 className="font-bold text-sm line-clamp-2">{prod.nombre}</h3>
            <p className="text-sm text-gray-600 mb-2">Q{prod.precio}</p>
            <button
              className="bg-pink-600 hover:bg-pink-700 text-white px-3 py-1 rounded text-sm w-full"
              onClick={() => agregarProducto(prod)}
            >
              Agregar
            </button>
          </div>
        ))}
      </div>

      <div className="bg-gray-50 p-4 rounded shadow mb-6 overflow-x-auto">
        <h2 className="text-lg font-bold mb-2">🛒 Productos seleccionados</h2>
        {venta.length === 0 ? (
          <p className="text-sm text-gray-600">No hay productos agregados.</p>
        ) : (
          <table className="min-w-[700px] w-full text-sm text-left">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-2">Producto</th>
                <th>Cantidad</th>
                <th>Precio</th>
                <th>Subtotal</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {venta.map(item => (
                <tr key={item.producto.id} className="border-t">
                  <td className="p-2">{item.producto.nombre}</td>
                  <td>
                    <input
                      type="number"
                      min={1}
                      max={item.producto.stock}
                      value={item.cantidad}
                      onChange={e => cambiarCantidad(item.producto.id, parseInt(e.target.value))}
                      className="w-16 border rounded px-1 py-0.5 text-black"
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

        <div className="mt-4 font-semibold text-gray-800">Total: Q{total.toFixed(2)}</div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-2">
          <label htmlFor="efectivo" className="text-sm font-medium">Efectivo recibido:</label>
          <input
            type="number"
            id="efectivo"
            value={efectivo}
            onChange={e => setEfectivo(parseFloat(e.target.value))}
            className="border px-3 py-1 rounded text-black"
          />
        </div>

        <div className="mt-2 font-semibold text-gray-800">
          Cambio: Q{cambio < 0 ? '0.00' : cambio.toFixed(2)}
        </div>

        <button
          onClick={registrarVenta}
          className="bg-green-600 text-white mt-4 px-6 py-2 rounded hover:bg-green-700"
        >
          Registrar venta
        </button>

        {mensaje && <p className="mt-4 text-pink-600 font-medium">{mensaje}</p>}
      </div>
    </div>
  );
}
