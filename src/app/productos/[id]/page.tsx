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
}

export default function ProductoPage() {
  const { id } = useParams();
  const [producto, setProducto] = useState<Producto | null>(null);
  const [mediaIndex, setMediaIndex] = useState(0);

  useEffect(() => {
    const fetchProducto = async () => {
      const docRef = doc(db, 'productos', id as string);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setProducto({ id: docSnap.id, ...docSnap.data() } as Producto);
      }
    };
    fetchProducto();
  }, [id]);

  if (!producto) {
    return <div className="text-center text-lg p-10">Cargando producto...</div>;
  }

  const media = [...producto.imagenes];
  if (producto.video) media.push(producto.video);
  const isVideo = media[mediaIndex]?.includes('.mp4');

  return (
    <div className="min-h-screen bg-[#FDE9EF] font-serif p-6">
      <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-lg p-6 flex flex-col md:flex-row gap-6">
        {/* Carrusel */}
        <div className="relative w-full md:w-1/2 h-80">
          {isVideo ? (
            <video controls src={media[mediaIndex]} className="w-full h-full object-cover rounded-lg" />
          ) : (
            <img src={media[mediaIndex]} alt="media" className="w-full h-full object-cover rounded-lg" />
          )}

          <button
            onClick={() => setMediaIndex((prev) => (prev === 0 ? media.length - 1 : prev - 1))}
            className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-black bg-opacity-30 text-white rounded-full px-2 text-2xl hover:scale-125"
          >
            ‹
          </button>
          <button
            onClick={() => setMediaIndex((prev) => (prev + 1) % media.length)}
            className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-black bg-opacity-30 text-white rounded-full px-2 text-2xl hover:scale-125"
          >
            ›
          </button>
        </div>

        {/* Info */}
        <div className="md:w-1/2">
          <h1 className="text-3xl font-bold text-[#4B2E2E] mb-2">{producto.nombre}</h1>
          <p className="text-[#6B4E4E] mb-4 max-h-32 overflow-y-auto">{producto.descripcion}</p>
          <p className="text-xl font-bold text-[#8C4A2F] mb-1">Q{producto.precio}</p>
          <p className="text-sm text-[#4B2E2E] mb-4">
            {producto.stock > 0 ? 'Disponible' : 'Agotado'} ({producto.stock} unidades)
          </p>

          {/* Botones */}
          <div className="flex flex-wrap gap-4 mt-4">
            <button
              onClick={() => alert('Producto añadido al carrito')} // aquí podrías integrar con context
              className="bg-[#bb8588] hover:bg-[#a46d77] text-white px-6 py-2 rounded-full text-sm font-medium"
            >
              Añadir al carrito
            </button>

            <a
              href={`https://wa.me/50235724563?text=${encodeURIComponent(
  `Hola, quiero comprar *${producto.nombre}* a Q${producto.precio}.\n\nVer producto: https://coquetabynicolle.com/productos/${producto.id}`
)}`}

              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full text-sm font-medium"
            >
              Comprar por WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
