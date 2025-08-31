'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Image from 'next/image';
import axios from 'axios';

interface Producto {
  id: string;
  nombre: string;
  descripcion: string;
  marca: string;
  tono: string;
  precioCompra?: number;
  precioVenta?: number;
  stock?: number;
  categoria: string;
  subcategoria: string;
  imagenes: string[];
  video?: string;
}

interface CategoriaData {
  id: string;
  nombre: string;
  subcategorias: string[];
}

/* ===== Helper: detectar móvil ===== */
function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < breakpoint);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, [breakpoint]);
  return isMobile;
}

/* ===== Modal para móvil ===== */
function MobileModal({
  title,
  children,
  onClose,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  // bloquear scroll del body mientras está abierto
  useEffect(() => {
    const { body } = document;
    const prev = body.style.overflow;
    body.style.overflow = 'hidden';
    return () => {
      body.style.overflow = prev;
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[60]">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        className="absolute inset-x-0 bottom-0 max-h-[85vh] rounded-t-2xl bg-white shadow-2xl
                   p-4 pb-6 overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button
            onClick={onClose}
            className="px-3 py-1 rounded-md border hover:bg-gray-50 active:scale-95"
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export default function InventarioPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [productoEditando, setProductoEditando] = useState<Producto | null>(null);
  const [categorias, setCategorias] = useState<CategoriaData[]>([]);
  const [subcategoriasDisponibles, setSubcategoriasDisponibles] = useState<string[]>([]);
  const [filtro, setFiltro] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('');
  const [filtroSubcategoria, setFiltroSubcategoria] = useState('');
  const [nuevasImagenes, setNuevasImagenes] = useState<File[]>([]);
  const [nuevoVideo, setNuevoVideo] = useState<File | null>(null);

  const isMobile = useIsMobile();

  useEffect(() => {
    const fetchProductos = async () => {
      const snapshot = await getDocs(collection(db, 'productos'));
      const data: Producto[] = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      })) as Producto[];
      setProductos(data);
      setProductoEditando(null);
    };

    const fetchCategorias = async () => {
      const snap = await getDocs(collection(db, 'categorias'));
      const data: CategoriaData[] = snap.docs.map((docSnap) => ({
        id: docSnap.id,
        nombre: docSnap.data().nombre,
        subcategorias: docSnap.data().subcategorias || [],
      }));
      setCategorias(data);
    };

    fetchProductos();
    fetchCategorias();
  }, []);

  useEffect(() => {
    const seleccionada = categorias.find(cat => cat.id === filtroCategoria);
    setSubcategoriasDisponibles(seleccionada ? seleccionada.subcategorias : []);
    setFiltroSubcategoria('');
  }, [filtroCategoria, categorias]);

  useEffect(() => {
    if (productoEditando?.categoria) {
      const cat = categorias.find(c => c.id === productoEditando.categoria);
      setSubcategoriasDisponibles(cat ? cat.subcategorias : []);
    }
  }, [productoEditando?.categoria, categorias]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!productoEditando) return;
    const { name, value } = e.target;
    setProductoEditando({ ...productoEditando, [name]: value });
  };

  const subirArchivoACloudinary = async (file: File, tipo: 'image' | 'video') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'coqueta_upload');
    const res = await axios.post(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/${tipo}/upload`,
      formData
    );
    return res.data.secure_url;
  };

  const handleGuardar = async () => {
    if (!productoEditando) return;

    const ref = doc(db, 'productos', productoEditando.id);
    let imagenesFinales = productoEditando.imagenes;
    let videoFinal = productoEditando.video;

    if (nuevasImagenes.length > 0) {
      const urls = await Promise.all(
        nuevasImagenes.map(img => subirArchivoACloudinary(img, 'image'))
      );
      imagenesFinales = urls;
    }

    if (nuevoVideo) {
      const url = await subirArchivoACloudinary(nuevoVideo, 'video');
      videoFinal = url;
    }

    const actualizado = {
      ...productoEditando,
      imagenes: imagenesFinales,
      video: videoFinal,
      precioCompra: Number(productoEditando.precioCompra),
      precioVenta: Number(productoEditando.precioVenta),
      stock: Number(productoEditando.stock),
    };

    await updateDoc(ref, actualizado);

    setProductos(prev => prev.map(p => (p.id === productoEditando.id ? actualizado : p)));
    setProductoEditando(actualizado);
    setNuevasImagenes([]);
    setNuevoVideo(null);
    alert('✅ Producto actualizado');

    // en móvil, cerramos el modal al guardar
    if (isMobile) setProductoEditando(null);
  };

  const productosFiltrados = productos.filter((p) =>
    p.nombre.toLowerCase().includes(filtro.toLowerCase()) &&
    (filtroCategoria ? p.categoria === filtroCategoria : true) &&
    (filtroSubcategoria ? p.subcategoria === filtroSubcategoria : true)
  );

  const EditorForm = (
    <div className="grid grid-cols-1 gap-3">
      <input name="nombre" value={productoEditando?.nombre ?? ''} onChange={handleInputChange} placeholder="Nombre" className="p-2 border rounded" />
      <input name="descripcion" value={productoEditando?.descripcion ?? ''} onChange={handleInputChange} placeholder="Descripción" className="p-2 border rounded" />
      <input name="marca" value={productoEditando?.marca ?? ''} onChange={handleInputChange} placeholder="Marca" className="p-2 border rounded" />
      <input name="tono" value={productoEditando?.tono ?? ''} onChange={handleInputChange} placeholder="Tono / Número" className="p-2 border rounded" />
      <input name="stock" type="number" value={productoEditando?.stock ?? ''} onChange={handleInputChange} placeholder="Stock" className="p-2 border rounded" />
      <input name="precioCompra" type="number" value={productoEditando?.precioCompra ?? ''} onChange={handleInputChange} placeholder="Precio Compra" className="p-2 border rounded" />
      <input name="precioVenta" type="number" value={productoEditando?.precioVenta ?? ''} onChange={handleInputChange} placeholder="Precio Venta" className="p-2 border rounded" />
      <select name="categoria" value={productoEditando?.categoria ?? ''} onChange={handleInputChange} className="p-2 border rounded">
        <option value="">Selecciona una categoría</option>
        {categorias.map((c) => (
          <option key={c.id} value={c.id}>{c.nombre}</option>
        ))}
      </select>
      <select name="subcategoria" value={productoEditando?.subcategoria ?? ''} onChange={handleInputChange} className="p-2 border rounded">
        <option value="">Selecciona una subcategoría</option>
        {subcategoriasDisponibles.map((s, i) => (
          <option key={i} value={s}>{s}</option>
        ))}
      </select>
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={(e) => {
          const files = Array.from(e.target.files ?? []).slice(0, 3);
          setNuevasImagenes(files);
        }}
        className="p-2 border rounded"
      />
      <input
        type="file"
        accept="video/*"
        onChange={(e) => setNuevoVideo(e.target.files?.[0] ?? null)}
        className="p-2 border rounded"
      />
      <div className="flex gap-2 justify-end">
        <button
          onClick={() => setProductoEditando(null)}
          className="px-4 py-2 rounded border hover:bg-gray-50"
        >
          Cancelar
        </button>
        <button
          onClick={handleGuardar}
          className="bg-[#D89BA4] hover:bg-[#c68793] text-white py-2 px-4 rounded"
        >
          Guardar Cambios
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fef9f6] text-[#4B2E2E] font-sans px-4 md:px-6 py-4">
      <h1 className="text-2xl md:text-3xl font-bold mb-4">Inventario de Productos</h1>

      <div className="flex flex-wrap gap-4 mb-6">
        <input
          placeholder="Buscar por nombre o marca..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="p-2 rounded border w-full md:w-1/3"
        />
        <select
          value={filtroCategoria}
          onChange={(e) => setFiltroCategoria(e.target.value)}
          className="p-2 rounded border w-full md:w-1/4"
        >
          <option value="">Todas las categorías</option>
          {categorias.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.nombre}</option>
          ))}
        </select>
        <select
          value={filtroSubcategoria}
          onChange={(e) => setFiltroSubcategoria(e.target.value)}
          className="p-2 rounded border w-full md:w-1/4"
        >
          <option value="">Todas las subcategorías</option>
          {subcategoriasDisponibles.map((sub, i) => (
            <option key={i} value={sub}>{sub}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Tabla scrollable en móvil */}
        <div className="w-full overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-[900px] w-full text-sm text-left">
            <thead className="sticky top-0 bg-pink-50">
              <tr>
                <th className="p-3">Imagen</th>
                <th className="p-3">Nombre</th>
                <th className="p-3">Marca</th>
                <th className="p-3">Descripción</th>
                <th className="p-3">Stock</th>
                <th className="p-3">Precio Venta</th>
                <th className="p-3">Ganancia</th>
                <th className="p-3 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productosFiltrados.map((p) => (
                <tr key={p.id} className={`border-t hover:bg-pink-50 ${productoEditando?.id === p.id ? 'bg-pink-100' : ''}`}>
                  <td className="p-3">
                    {p.imagenes?.[0] && <Image src={p.imagenes[0]} alt={p.nombre} width={45} height={45} />}
                  </td>
                  <td className="p-3">{p.nombre}</td>
                  <td className="p-3">{p.marca}</td>
                  <td className="p-3">{p.descripcion}</td>
                  <td className="p-3">{p.stock}</td>
                  <td className="p-3">{typeof p.precioVenta === 'number' ? `Q${p.precioVenta.toFixed(2)}` : '-'}</td>
                  <td className="p-3">
                    {typeof p.precioVenta === 'number' && typeof p.precioCompra === 'number'
                      ? `Q${(p.precioVenta - p.precioCompra).toFixed(2)}`
                      : '-'}
                  </td>
                  <td className="p-3 flex gap-2">
                    <button
                      onClick={() => setProductoEditando(p)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                    >
                      Editar
                    </button>
                    <button
                      onClick={async () => {
                        if (confirm('¿Estás seguro de eliminar este producto?')) {
                          await deleteDoc(doc(db, 'productos', p.id));
                          setProductos(prev => prev.filter(prod => prod.id !== p.id));
                          if (productoEditando?.id === p.id) setProductoEditando(null);
                        }
                      }}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Panel de edición:
            - Desktop: panel lateral a la par.
            - Móvil: modal flotante arriba. */}
        {!isMobile && productoEditando && (
          <div className="w-full md:w-2/5 bg-white p-6 rounded-xl shadow-md self-start">
            <h2 className="text-xl font-semibold mb-4">Editar Producto</h2>
            {EditorForm}
          </div>
        )}
      </div>

      {isMobile && productoEditando && (
        <MobileModal
          title="Editar Producto"
          onClose={() => setProductoEditando(null)}
        >
          {EditorForm}
        </MobileModal>
      )}
    </div>
  );
}
