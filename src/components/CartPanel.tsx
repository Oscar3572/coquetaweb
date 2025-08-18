import type { CartItem } from '@/types';

export default function CartPanel({
  items, total, onClose
}: { items: CartItem[]; total: number; onClose: ()=>void; }) {
  return (
    <div className="fixed top-0 right-0 w-full sm:w-[400px] h-full bg-white shadow-lg z-[100] p-6 overflow-y-auto">
      <h3 className="text-xl font-bold text-[#4B2E2E] mb-4">Tu carrito</h3>
      {items.length === 0 ? (
        <p className="text-[#6B4E4E]">El carrito está vacío.</p>
      ) : (
        <>
          <ul className="mb-4">
            {items.map((it, i) => (
              <li key={i} className="border-b py-2 flex justify-between items-center">
                <div>
                  <p className="font-medium text-[#4B2E2E]">{it.producto.nombre}</p>
                  <p className="text-sm text-[#8C4A2F]">x {it.cantidad}</p>
                </div>
                <p className="font-semibold text-[#4B2E2E]">
                  Q{(it.producto.precio * it.cantidad).toFixed(2)}
                </p>
              </li>
            ))}
          </ul>
          <p className="text-[#4B2E2E] font-bold mb-4">Total: Q{total.toFixed(2)}</p>
          <a
            target="_blank"
            href={`https://wa.me/50234850804?text=${encodeURIComponent(
              'Hola, quiero ordenar:\n' +
              items.map(it => `${it.cantidad}x ${it.producto.nombre} - Q${it.producto.precio * it.cantidad}`).join('\n') +
              `\n\nTotal: Q${total.toFixed(2)}`
            )}`}
            className="block w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-full text-center font-medium transition">
            Finalizar por WhatsApp
          </a>
        </>
      )}
      <button onClick={onClose} className="mt-4 text-pink-600 underline text-sm">Cerrar carrito</button>
    </div>
  );
}
