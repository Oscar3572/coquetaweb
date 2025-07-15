'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface CategoriaData {
  nombre: string;
  subcategorias: string[];
}

export default function RegistrarProductoPage() {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [marca, setMarca] = useState('');
  const [tono, setTono] = useState('');
  const [precioCompra, setPrecioCompra] = useState('');
  const [precioVenta, setPrecioVenta] = useState('');
  const [stock, setStock] = useState('');
  const [categoria, setCategoria] = useState('');
  const [subcategoria, setSubcategoria] = useState('');
  const [imagenes, setImagenes] = useState<File[]>([]);
  const [video, setVideo] = useState<File | null>(null);
  const [categorias, setCategorias] = useState<CategoriaData[]>([]);
  const [subcategoriasDisponibles, setSubcategoriasDisponibles] = useState<string[]>([]);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'categorias'));
        const categoriasData: CategoriaData[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.nombre && data.subcategorias) {
            categoriasData.push({
              nombre: data.nombre,
              subcategorias: data.subcategorias,
            });
          }
        });
        setCategorias(categoriasData);
      } catch (error) {
        console.error('Error al obtener categorías:', error);
      }
    };

    fetchCategorias();
  }, []);

  useEffect(() => {
    const seleccionada = categorias.find((cat) => cat.nombre === categoria);
    setSubcategoriasDisponibles(seleccionada ? seleccionada.subcategorias : []);
    setSubcategoria('');
  }, [categoria, categorias]);

  const handleImagenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selected = Array.from(e.target.files).slice(0, 3);
      setImagenes(selected);
    }
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setVideo(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      imagenes.forEach((img, index) => {
        formData.append(`imagen${index}`, img);
      });

      if (video) {
        formData.append('video', video);
      }

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Error al subir archivos');
      }

      const urls: string[] = data.urls;
      const imagenUrls = urls.filter((url) => url.includes('/image/'));
      const videoUrl = urls.find((url) => url.includes('/video/')) || null;

      await addDoc(collection(db, 'productos'), {
        nombre,
        descripcion,
        marca,
        tono,
        precioCompra: Number(precioCompra),
        precioVenta: Number(precioVenta),
        stock: Number(stock),
        categoria,
        subcategoria,
        imagenes: imagenUrls,
        video: videoUrl,
        creadoEn: new Date(),
      });

      alert('✅ Producto registrado correctamente');

      setNombre('');
      setDescripcion('');
      setMarca('');
      setTono('');
      setPrecioCompra('');
      setPrecioVenta('');
      setStock('');
      setCategoria('');
      setSubcategoria('');
      setImagenes([]);
      setVideo(null);
    } catch (error) {
      console.error('Error al registrar producto:', error);
      alert('❌ Ocurrió un error al registrar el producto.');
    }
  };

  return (
    <div className="bg-[#ffe6ec] min-h-screen py-10 px-6">
      <div className="bg-white p-6 rounded-xl shadow-md max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-[#4B2E2E] mb-6 font-[Times_New_Roman]">
          Registrar producto
        </h1>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 font-[Times_New_Roman]">
          <input type="text" placeholder="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} className="p-2 border rounded text-black" />
          <input type="text" placeholder="Descripción" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} className="p-2 border rounded text-black" />
          <input type="text" placeholder="Marca" value={marca} onChange={(e) => setMarca(e.target.value)} className="p-2 border rounded text-black" />
          <input type="text" placeholder="Tono o número" value={tono} onChange={(e) => setTono(e.target.value)} className="p-2 border rounded text-black" />
          <input type="number" placeholder="Precio compra" value={precioCompra} onChange={(e) => setPrecioCompra(e.target.value)} className="p-2 border rounded text-black" />
          <input type="number" placeholder="Precio venta" value={precioVenta} onChange={(e) => setPrecioVenta(e.target.value)} className="p-2 border rounded text-black" />
          <input type="number" placeholder="Stock" value={stock} onChange={(e) => setStock(e.target.value)} className="p-2 border rounded text-black" />

          <select value={categoria} onChange={(e) => setCategoria(e.target.value)} className="p-2 border rounded text-black">
            <option value="">Selecciona una categoría</option>
            {categorias.map((cat, i) => (
              <option key={i} value={cat.nombre}>{cat.nombre}</option>
            ))}
          </select>

          <select value={subcategoria} onChange={(e) => setSubcategoria(e.target.value)} className="p-2 border rounded text-black">
            <option value="">Selecciona una subcategoría</option>
            {subcategoriasDisponibles.map((sub, i) => (
              <option key={i} value={sub}>{sub}</option>
            ))}
          </select>

          <div className="md:col-span-2 flex flex-col gap-2">
            <label className="text-black">Seleccionar imágenes (máx 3)</label>
            <input type="file" accept="image/*" multiple onChange={handleImagenChange} className="p-2 border rounded text-black" />
          </div>

          <div className="md:col-span-2 flex flex-col gap-2">
            <label className="text-black">Seleccionar video (opcional)</label>
            <input type="file" accept="video/*" onChange={handleVideoChange} className="p-2 border rounded text-black" />
          </div>

          <div className="md:col-span-2 flex justify-center">
            <button type="submit" className="bg-pink-500 text-white px-6 py-2 rounded hover:bg-pink-600 transition">
              Guardar producto
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
