// src/types/index.ts

export interface Producto {
  id: string;
  nombre: string;
  precio: number;
  stock: number;
  categoria: string;
  subcategoria?: string;

  // Media
  imagenes: string[];
  video?: string;

  // Texto (opcionales, porque a veces no vienen)
  descripcion?: string;
  detalle?: string;      // usado en tu modal anterior
  subtitulo?: string;    // por si lo usas como texto corto

  // Denormalizados para mostrar nombres legibles
  categoriaNombre?: string;
  subcategoriaNombre?: string;
}

export interface CartItem {
  producto: Producto;
  cantidad: number;
}
