'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

interface Producto {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  imagenes: string[];
  video?: string;
  categoria?: string;
  subcategoria?: string;
}

export default function ProductoPage() {
  const { id } = useParams();
  const [producto, setProducto] = useState<Producto | null>(null);
  const [nombreCategoria, setNombreCategoria] = useState('');
  const [media, setMedia] = useState<(string | { video: string })[]>([]);
  const [mediaIndex, setMediaIndex] = useState(0);

  useEffect(() => {
    const fetchProducto = async () => {
      if (!id || typeof id !== 'string') {
        console.warn('❌ ID inválido o no definido');
        return;
      }

      try {
        const ref = doc(db, 'productos', id);
        const snap = await getDoc(ref);
        if (!snap.exists()) {
          console.warn('❌ Producto no encontrado');
          return;
        }

        const data = snap.data() as Producto;

        const imagenes = Array.isArray(data.imagenes)
          ? data.imagenes.filter((url) => typeof url === 'string' && url.trim() !== '')
          : [];

        const medios: (string | { video: string })[] = [...imagenes];

        if (typeof data.video === 'string' && data.video.trim() !== '') {
          medios.push({ video: data.video });
        }

        setProducto(data);
        setMedia(medios);

        if (data.categoria) {
          try {
            const catRef = doc(db, 'categorias', data.categoria);
            const catSnap = await getDoc(catRef);
            setNombreCategoria(
              catSnap.exists() ? (catSnap.data().nombre as string) || data.categoria : data.categoria
            );
          } catch (e) {
            console.warn('⚠️ Error al obtener categoría:', e);
            setNombreCategoria(data.categoria);
          }
        }
      } catch (error) {
        console.error('❌ Error cargando producto:', error);
      }
    };

    fetchProducto();
  }, [id]);

  const mediaActual = media[mediaIndex] ?? null;

  const esImagen = typeof mediaActual === 'string' && mediaActual.trim() !== '';
  const esVideo =
    typeof mediaActual === 'object' &&
    mediaActual !== null &&
    'video' in mediaActual &&
    typeof mediaActual.video === 'string' &&
    mediaActual.video.trim() !== '';

  if (!producto) return <p className="p-4 font-roboto bg-black text-white">Cargando...</p>;

  const avanzar = () => setMediaIndex((mediaIndex + 1) % media.length);
  const retroceder = () => setMediaIndex((mediaIndex - 1 + media.length) % media.length);

  return (
    <main className="min-h-screen bg-[#EFEBCD] text-[#102820] p-6 font-roboto">
      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
        {/* Galería */}
        <div className="relative w-full rounded-lg shadow bg-white p-2">
          {esImagen ? (
            <img
              src={mediaActual as string}
              alt="Producto"
              className="w-full h-80 object-contain rounded"
            />
          ) : esVideo ? (
            <video
              src={(mediaActual as { video: string }).video}
              controls
              className="w-full h-80 object-contain rounded bg-black"
            />
          ) : (
            <div className="w-full h-80 flex items-center justify-center bg-gray-100 rounded">
              <span className="text-gray-400">Sin imagen/video</span>
            </div>
          )}

          {media.length > 1 && (
            <>
              <button
                onClick={retroceder}
                className="absolute top-1/2 left-2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full px-2 shadow"
              >
                &lt;
              </button>
              <button
                onClick={avanzar}
                className="absolute top-1/2 right-2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full px-2 shadow"
              >
                &gt;
              </button>
            </>
          )}
        </div>

        {/* Detalles del producto */}
        <div className="text-start space-y-3 font-roboto">
          <h1 className="text-3xl font-bold text-[#102820]">{producto.nombre}</h1>
          <p className="text-md text-[#6A3B1F]">{producto.descripcion}</p>
          <p className="text-xl font-semibold text-[#102820]">
            Precio: <span className="text-[#6A3B1F]">Q{producto.precio}</span>
          </p>
          <p className="text-md">Stock disponible: {producto.stock}</p>
          <p className="text-md">
            Categoría:{' '}
            <span className="font-semibold">
              {nombreCategoria || producto.categoria || 'Sin categoría'}
            </span>
          </p>
          {producto.subcategoria && (
            <p className="text-md">
              Subcategoría:{' '}
              <span className="font-semibold">{producto.subcategoria}</span>
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
