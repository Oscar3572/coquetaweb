'use client';
import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { ShoppingCart } from 'lucide-react';

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
}

export default function HomePage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<string[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');
  const [mostrarCategorias, setMostrarCategorias] = useState(false);
  const [productoActivo, setProductoActivo] = useState<Producto | null>(null);
  const [mediaIndex, setMediaIndex] = useState(0);
  const [carrito, setCarrito] = useState<{ producto: Producto, cantidad: number }[]>([]);
  const [mostrarCarrito, setMostrarCarrito] = useState(false);


useEffect(() => {
  const fetchProductos = async () => {
    const snapProd = await getDocs(collection(db, 'productos'));
    const productosRaw = snapProd.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Producto[];

    const snapCat = await getDocs(collection(db, 'categorias'));
    const catMap = Object.fromEntries(
      snapCat.docs.map((doc) => [doc.id, doc.data().nombre])
    );

    const productosConNombreCategoria: Producto[] = productosRaw.map(prod => ({
      ...prod,
      categoriaNombre: catMap[prod.categoria] || 'Sin categoría'
    }));

    setProductos(productosConNombreCategoria);
  };

  const fetchCategorias = async () => {
    const snapshot = await getDocs(collection(db, 'categorias'));
    const data = snapshot.docs.map(doc => doc.data().nombre);
    setCategorias(data);
  };


    
    fetchProductos();
    fetchCategorias();
  }, []);

  const productosFiltrados = productos.filter(prod => {
    const coincideBusqueda = prod.nombre?.toLowerCase().includes(busqueda.toLowerCase());
    const coincideCategoria = !categoriaSeleccionada || prod.categoriaNombre?.toLowerCase() === categoriaSeleccionada.toLowerCase();
    return coincideBusqueda && coincideCategoria;
  });
return (
  <div className='font-serif bg-[#FDE9EF] min-h-screen relative'>
    {/* NAVBAR */}
    <header className='bg-[#F7A8B8] p-4 flex flex-wrap justify-between items-center sticky top-0 z-50 shadow-md'>
      <div className='flex items-center gap-2'>
        <img src='/images/logo.jpg' alt='logo' className='w-8 h-8 rounded-full' />
        <span className='font-bold text-xl text-[#4B2E2E]'>COQUETA <span className='font-normal italic text-sm'>by Nicolle</span></span>
      </div>
      <nav className='flex flex-wrap gap-4 items-center text-[#4B2E2E] mt-2 md:mt-0'>
        <a href='#catalogo' className='hover:underline'>Home</a>
        <a href='#catalogo' className='hover:underline'>Shop</a>
        <div className='relative'>
          <button onClick={() => setMostrarCategorias(!mostrarCategorias)} className='hover:underline'>Categorías ▾</button>
          {mostrarCategorias && (
            <div className='absolute bg-white mt-2 shadow rounded-md w-44 z-50'>
              {categorias.map((cat, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setCategoriaSeleccionada(cat);
                    setMostrarCategorias(false);
                    setProductoActivo(null);
                    document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className='block px-4 py-2 text-left w-full hover:bg-pink-100 text-[#4B2E2E]'
                >{cat}</button>
              ))}
            </div>
          )}
        </div>
        <a href='#ofertas' className='hover:underline'>Ofertas</a>
        <a href='#contacto' className='hover:underline'>Contacto</a>
        <input
          type='text'
          placeholder='Buscar productos...'
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className='rounded-full px-4 py-1 text-sm bg-white shadow-inner outline-none'
        />
        <div className='relative cursor-pointer' onClick={() => setMostrarCarrito(true)}>
          <ShoppingCart />
          {carrito.length > 0 && (
            <span className='absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full px-1'>
              {carrito.reduce((total, item) => total + item.cantidad, 0)}
            </span>
          )}
        </div>
      </nav>
    </header>



{/* HERO */}
<section className='bg-[#FDE9EF] min-h-[80vh] flex items-center px-6 py-10'>
  <div className='max-w-7xl w-full mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center'>
    <div className='text-center md:text-left'>
      <h1 className='text-5xl font-extrabold text-[#4B2E2E] mb-2'>COQUETA <span className='italic font-normal'>by Nicolle</span></h1>
      <h2 className='text-3xl text-[#4B2E2E] font-semibold mb-4'>¡Bienvenidos!</h2>
      <p className='text-[#6B4E4E] text-base md:text-lg mb-6'>
        Productos de belleza que resaltan lo mejor de ti con calidad, elegancia y amor propio.
      </p>
      <button
        onClick={() => document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' })}
        className='bg-[#D8A48F] hover:bg-[#bb8588] text-white px-6 py-2 rounded-full'
      >
        Ver productos
      </button>
    </div>
    <div className='grid grid-cols-2 gap-4 justify-center'>
      <img src='/images/benetint.jpg' alt='benetint' className='rounded-lg shadow-lg w-full h-40 object-cover' />
      <img src='/images/bisu.jpg' alt='bisu' className='rounded-lg shadow-lg w-full h-40 object-cover' />
      <img src='/images/pat.jpg' alt='pat' className='rounded-lg shadow-lg w-full h-40 object-cover col-span-2' />
    </div>
  </div>
</section>

{/* FAVORITOS */}
<section className='py-16 bg-[#F6EDED] text-center'>
  <h2 className='text-3xl font-bold text-[#4B2E2E] mb-8'>Nuestros productos favoritos</h2>
  <div className='flex flex-wrap justify-center gap-6 max-w-6xl mx-auto'>
    {['benetint', 'bisu', 'pat'].map((img, i) => (
      <div key={i} className='bg-white p-4 rounded shadow w-64'>
        <img src={`/images/${img}.jpg`} alt={img} className='mx-auto rounded w-full h-48 object-cover' />
        <p className='text-[#4B2E2E] mt-4 text-sm'>
          {img === 'benetint' && 'Tintes líquidos para labios con acabado natural.'}
          {img === 'bisu' && 'Labiales Bisu de larga duración y tonos vibrantes.'}
          {img === 'pat' && 'Brillos con fragancia y color suave para el día a día.'}
        </p>
      </div>
    ))}
  </div>
</section>


{/* CATÁLOGO */}
<section id='catalogo' className='bg-[#F6EDED] px-6 pb-24 pt-8'>
  <h2 className='text-3xl font-bold text-[#4B2E2E] mb-6 text-center'>Catálogo de productos</h2>
  <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6'>
    {productosFiltrados.map((prod) => (
      <div
        key={prod.id}
        onClick={() => setProductoActivo(prodActivo => prodActivo?.id === prod.id ? null : prod)}
        className='bg-white p-3 rounded-lg shadow hover:scale-105 transition-transform cursor-pointer'
      >
        <img
          src={prod.imagenes?.[0] || '/images/logo.jpg'}
          alt={prod.nombre || 'producto'}
          className='h-32 w-full object-cover rounded mb-2'
        />
        <h4 className='text-[#4B2E2E] font-semibold text-center text-sm'>{prod.nombre || ''}</h4>
        <p className='text-[#8C4A2F] text-center text-sm'>Q{prod.precio ?? 0}</p>
      </div>
    ))}
  </div>



{productoActivo && (
  <div className='mt-12 bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto'>
    <div className='flex flex-col md:flex-row gap-6'>
      {/* CARRUSEL DE MEDIOS */}
      <div className='w-full md:w-1/2 relative'>
        <div className='relative w-full h-64 overflow-hidden rounded'>
          {(() => {
            const media = [...(productoActivo.imagenes || [])];
            if (productoActivo.video) media.push(productoActivo.video);
            const current = media[mediaIndex] || '';
            return current.includes('mp4') ? (
              <video controls src={current} className='w-full h-full object-cover rounded' />
            ) : (
              <img src={current} alt='media' className='w-full h-full object-cover rounded' />
            );
          })()}
        </div>

{/* FLECHAS */}
<button
  onClick={() =>
    setMediaIndex(i =>
      i === 0
        ? (productoActivo.video ? productoActivo.imagenes.length : productoActivo.imagenes.length - 1)
        : i - 1
    )
  }
  className='absolute top-1/2 left-2 transform -translate-y-1/2 text-3xl text-white bg-transparent hover:scale-125 transition-transform'
>
  ‹
</button>
<button
  onClick={() => {
    const mediaLength = productoActivo.video
      ? productoActivo.imagenes.length + 1
      : productoActivo.imagenes.length;
    setMediaIndex(i => (i + 1) % mediaLength);
  }}
  className='absolute top-1/2 right-2 transform -translate-y-1/2 text-3xl text-white bg-transparent hover:scale-125 transition-transform'
>
  ›
</button>
</div>


{/* INFO PRODUCTO */}
<div className='md:w-1/2'>
  <h2 className='text-3xl font-bold text-[#4B2E2E] mb-2'>{productoActivo.nombre || ''}</h2>
  <p className='text-sm text-[#4B2E2E] mb-4 break-words max-h-24 overflow-y-auto'>
    {productoActivo.descripcion || 'Sin descripción.'}
  </p>
  <p className='text-xl font-bold text-[#8C4A2F] mb-1'>Q{productoActivo.precio ?? 0}</p>
  <p className='text-sm text-[#4B2E2E] mb-4'>
    {productoActivo.stock > 0 ? 'Disponible' : 'Agotado'} ({productoActivo.stock ?? 0} unidades)
  </p>

  {/* CANTIDAD */}
  <div className='flex items-center gap-3 mb-4'>
    <label htmlFor='cantidad' className='text-sm text-[#4B2E2E]'>Cantidad:</label>
    <input
      id='cantidadInput'
      type='number'
      min={1}
      max={productoActivo.stock}
      defaultValue={1}
      className='w-20 px-2 py-1 border rounded-md text-sm text-black'
      onChange={(e) => {
        const val = Number(e.target.value);
        if (val > productoActivo.stock) e.target.value = String(productoActivo.stock);
        if (val < 1) e.target.value = '1';
      }}
    />
  </div>


{/* BOTONES */}
<div className='flex flex-wrap gap-3 mb-4'>
  <button
    onClick={() => {
      const cantidadInput = document.getElementById('cantidadInput') as HTMLInputElement;
      const cantidad = parseInt(cantidadInput.value);
      if (isNaN(cantidad) || cantidad < 1) return;

      setCarrito((prev) => {
        const existe = prev.find(item => item.producto.id === productoActivo.id);
        if (existe) {
          return prev.map(item =>
            item.producto.id === productoActivo.id
              ? { ...item, cantidad: item.cantidad + cantidad }
              : item
          );
        }
        return [...prev, { producto: productoActivo, cantidad }];
      });

      alert('Producto añadido al carrito');
    }}
    className='bg-[#bb8588] hover:bg-[#a46d77] text-white px-6 py-2 rounded-full text-sm font-medium'
  >
    Añadir al carrito
  </button>

<a
  href={`https://wa.me/50235724563?text=Hola%2C%20me%20interesa%20el%20producto%20${encodeURIComponent(productoActivo.nombre)}%20a%20Q${productoActivo.precio}`}
  target='_blank'
  rel='noopener noreferrer'
  className='bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full text-sm font-medium'
>
  Comprar por WhatsApp
</a>
</div>

{/* CERRAR */}
<button onClick={() => setProductoActivo(null)} className='text-pink-600 underline text-sm'>
  Cerrar
</button>
</div>
</div>
</div>
)}

</section>


      {/* CLIENTAS Y CONTACTO */}
<section id='contacto' className='px-6 py-16 bg-[#FDE9EF] text-[#4B2E2E]'>
  <h2 className='text-3xl font-bold text-center mb-8'>Lo que nuestras clientas dicen</h2>
  <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
    <div className='bg-white p-4 rounded-lg shadow-md'>
      <p>'Desde que uso los productos de Coqueta, me siento más segura y hermosa cada día.'</p>
      <span className='block text-right mt-2 font-semibold'>– Mariana</span>
    </div>
    <div className='bg-white p-4 rounded-lg shadow-md'>
      <p>'¡Me fascinan los labiales! Colores intensos, buena duración y huelen delicioso.'</p>
      <span className='block text-right mt-2 font-semibold'>– Camila</span>
    </div>
    <div className='bg-white p-4 rounded-lg shadow-md'>
      <p>'Excelente atención, productos de calidad y entrega rápida. ¡Gracias, Coqueta!'</p>
      <span className='block text-right mt-2 font-semibold'>– Laura</span>
    </div>
  </div>


        {/* Botón de WhatsApp + redes */}
<div className='text-center mt-10'>
  <p className='mb-3'>¿Tienes dudas o deseas un producto personalizado?</p>
  <a
    href='https://wa.me/50235724563'
    target='_blank'
    rel='noopener noreferrer'
    className='inline-block bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full shadow-md text-lg font-semibold transition-all'
  >
    Escríbenos por WhatsApp
  </a>
  <div className='mt-8 flex justify-center gap-6'>
    {/* Instagram */}
    <a
      href='https://www.instagram.com/coqueta_bynicolle/?igsh=YWFuZW13cnE3eDc2'
      target='_blank'
      rel='noopener noreferrer'
      aria-label='Instagram'
      className='bg-pink-100 hover:bg-pink-200 p-3 rounded-full shadow-md transition-transform transform hover:scale-110'
    >
      <svg className='h-6 w-6 text-pink-600' fill='currentColor' viewBox='0 0 24 24'>
        <path d='M7.75 2A5.75 5.75 0 002 7.75v8.5A5.75 5.75 0 007.75 22h8.5A5.75 5.75 0 0022 16.25v-8.5A5.75 5.75 0 0016.25 2h-8.5zm8.5 1.5A4.25 4.25 0 0120.5 7.75v8.5a4.25 4.25 0 01-4.25 4.25h-8.5A4.25 4.25 0 013.5 16.25v-8.5A4.25 4.25 0 017.75 3.5h8.5zM12 7a5 5 0 100 10 5 5 0 000-10zm0 1.5a3.5 3.5 0 110 7 3.5 3.5 0 010-7zm4.25-2a.75.75 0 100 1.5.75.75 0 000-1.5z' />
      </svg>
    </a>

{/* Facebook */}
<a
  href='https://www.facebook.com/share/1GQatn9G74/'
  target='_blank'
  rel='noopener noreferrer'
  aria-label='Facebook'
  className='bg-blue-100 hover:bg-blue-200 p-3 rounded-full shadow-md transition-transform transform hover:scale-110'
>
  <svg className='h-6 w-6 text-blue-600' fill='currentColor' viewBox='0 0 24 24'>
    <path d='M22 12a10 10 0 10-11.6 9.87v-7H8v-3h2.4V9.5c0-2.4 1.4-3.7 3.6-3.7 1 0 2 .2 2 .2v2.3h-1.1c-1.1 0-1.5.7-1.5 1.5v1.7h2.6l-.4 3h-2.2v7A10 10 0 0022 12z' />
  </svg>
</a>

{/* TikTok */}
<a
  href='https://www.tiktok.com/@coquetabynicolle?._t=ZM-8x8NAdba62X&_r=1'
  target='_blank'
  rel='noopener noreferrer'
  aria-label='TikTok'
  className='bg-gray-100 hover:bg-gray-200 p-3 rounded-full shadow-md transition-transform transform hover:scale-110'
>
  <svg className='h-6 w-6 text-black' fill='currentColor' viewBox='0 0 24 24'>
    <path d='M9.75 3h2.25v10.5a3.75 3.75 0 11-3.75-3.75h.75v2.25h-.75a1.5 1.5 0 101.5 1.5V3zM15 3c0 1.5 1.5 3 3 3v2.25c-1.5 0-3-1.5-3-3V3z' />
  </svg>
</a>

{/* WhatsApp */}
<a
  href='https://wa.me/50235724563'
  target='_blank'
  rel='noopener noreferrer'
  aria-label='WhatsApp'
  className='bg-green-100 hover:bg-green-200 p-3 rounded-full shadow-md transition-transform transform hover:scale-110'
>
  <svg className='h-6 w-6 text-green-600' fill='currentColor' viewBox='0 0 24 24'>
    <path d='M20.52 3.48A12 12 0 003.48 20.52L2 24l3.52-1.48A12 12 0 1020.52 3.48zM12 21.75a9.75 9.75 0 01-5.01-1.35l-.36-.22-2.09.88.7-2.18-.23-.36A9.75 9.75 0 1121.75 12 9.76 9.76 0 0112 21.75zm4.9-7.68c-.27-.13-1.6-.79-1.85-.88s-.43-.13-.61.13-.7.88-.86 1.06-.32.2-.59.07a7.9 7.9 0 01-2.32-1.43 8.7 8.7 0 01-1.61-2c-.17-.3 0-.46.13-.59.13-.13.3-.32.45-.48s.2-.27.3-.45a.53.53 0 000-.5c-.13-.13-.59-1.43-.81-1.96s-.43-.45-.59-.46-.33 0-.5 0a.96.96 0 00-.7.33 2.92 2.92 0 00-.91 2.16 5.1 5.1 0 001.09 2.53 11.84 11.84 0 004.45 4.45 5.1 5.1 0 002.53 1.09 2.92 2.92 0 002.16-.91 1 1 0 00.33-.7c0-.17 0-.33-.05-.5s-.17-.43-.46-.59z' />
  </svg>
</a>

          </div>
        </div>
      </section>

{/* FOOTER */}
<footer className='bg-[#F7A8B8] text-[#4B2E2E] px-6 py-10 mt-16'>
  <div className='max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 items-center'>
    <div className='flex items-center gap-2'>
      <img src='/images/logo.jpg' alt='logo' className='w-10 h-10 rounded-full' />
      <span className='text-lg font-bold'>
        COQUETA <span className='italic font-normal'>by Nicolle</span>
      </span>
    </div>
    <div className='text-center'>
      <p className='mb-2 font-semibold'>Navegación</p>
      <div className='flex justify-center gap-4 text-sm'>
        <a href='#catalogo' className='hover:underline'>Shop</a>
        <a href='#ofertas' className='hover:underline'>Ofertas</a>
        <a href='#contacto' className='hover:underline'>Contacto</a>
      </div>
    </div>
    <div className='text-right text-sm'>
      <p>&quot;Tu belleza, tu esencia, tu poder.&quot;</p>
      <p>&quot;Cada producto refleja quién eres.&quot;</p>
      <p className='mt-2'>&copy; 2025 Coqueta by Nicolle. Todos los derechos reservados.</p>
    </div>
  </div>
</footer>


{mostrarCarrito && (
  <div className='fixed inset-0 z-50'>
    {/* Fondo semitransparente que no bloquea visión */}
    <div
  className='absolute inset-0 bg-transparent backdrop-blur-sm'
  onClick={() => setMostrarCarrito(false)}
/>


    {/* PANEL DESLIZABLE DERECHO */}
   <div className={`absolute top-0 right-0 h-full w-full max-w-md bg-white shadow-lg p-6 overflow-y-auto transform transition-transform duration-300 ${mostrarCarrito ? 'translate-x-0' : 'translate-x-full'}`}>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-[#4B2E2E]">Carrito de compras</h2>
        <button
          onClick={() => setMostrarCarrito(false)}
          className="text-red-500 hover:text-red-700 text-lg font-bold"
        >
          ✕
        </button>
      </div>

      {carrito.length === 0 ? (
        <p className="text-sm text-gray-600">No hay productos en el carrito.</p>
      ) : (
        <>
          <div className="space-y-4">
            {carrito.map((item, index) => (
              <div key={index} className="flex justify-between items-center border-b pb-2">
               <div className="flex items-center gap-3">
  <img
    src={item.producto.imagenes?.[0] || "/images/logo.jpg"}
    alt="thumb"
    className="w-14 h-14 object-cover rounded border"
  />
  <div>
    <p className="font-semibold text-[#4B2E2E]">{item.producto.nombre}</p>
    <p className="text-sm text-gray-600">
      Cantidad: {item.cantidad} × Q{item.producto.precio} = Q{item.cantidad * item.producto.precio}
    </p>
  </div>
</div>

                <button
                  onClick={() =>
                    setCarrito(prev => prev.filter((_, i) => i !== index))
                  }
                  className="text-red-500 hover:underline text-sm"
                >
                  Eliminar
                </button>
              </div>
            ))}
          </div>

          {/* TOTAL Y ACCIÓN */}
          <div className="mt-6 border-t pt-4 text-right">
            <p className="font-semibold text-[#8C4A2F] mb-4">
              Total: Q{carrito.reduce((sum, item) => sum + item.cantidad * item.producto.precio, 0)}
            </p>

            {/* ENVIAR POR WHATSAPP */}
<a
  href={`https://wa.me/50235724563?text=${encodeURIComponent(
    `Hola 👋, quiero hacer un pedido con los siguientes productos:\n\n` +
    carrito
      .map(
        (item, index) =>
          `${index + 1}. *${item.producto.nombre}*\n` +
          `   🛒 Cantidad: ${item.cantidad}\n` +
          `   💰 Precio: Q${item.producto.precio}\n` +
          `   🔗 Link: ${process.env.NEXT_PUBLIC_BASE_URL}/productos/${item.producto.id}\n` +  // <--- ESTE ES EL LINK CORRECTO
          `   🖼️ Imagen: ${item.producto.imagenes?.[0] || 'Sin imagen'}`
      )
      .join('\n\n') +
    `\n\n🧾 Total: Q${carrito.reduce(
      (sum, item) => sum + item.cantidad * item.producto.precio,
      0
    )}\n\nQuedo atento(a) 😊`
  )}`}
  target="_blank"
  rel="noopener noreferrer"
  className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full text-sm font-medium transition-all"
>
  Enviar pedido por WhatsApp
</a>


          </div>
        </>
      )}
    </div>
  </div>
)}
    </div>
  );
}
