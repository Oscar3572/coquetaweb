'use client';
import { useState } from 'react';
import type { Producto, CartItem } from '@/types';

export function useCart() {
  const [carrito, setCarrito] = useState<CartItem[]>([]);
  const total = carrito.reduce((t, it) => t + it.producto.precio * it.cantidad, 0);
  const count = carrito.reduce((t, it) => t + it.cantidad, 0);

  const add = (producto: Producto, cantidad: number) => {
    setCarrito(prev => {
      const i = prev.findIndex(it => it.producto.id === producto.id);
      if (i >= 0) {
        const copy = [...prev];
        copy[i] = { ...copy[i], cantidad: copy[i].cantidad + cantidad };
        return copy;
      }
      return [...prev, { producto, cantidad }];
    });
  };

  return { carrito, setCarrito, add, total, count };
}
