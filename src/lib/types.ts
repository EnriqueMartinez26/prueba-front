/**
 * Capa de Dominio: Contratos de Datos (Types & Interfaces)
 * --------------------------------------------------------------------------
 * Define la estructura de los objetos del sistema. Garantiza el tipado 
 * estático y actúa como especificación técnica de las entidades de negocio.
 */

// ─── ENTIDADES DE REFERENCIA ───

/**
 * RN - Categorización: Interfaz base para entidades maestras (Plataformas, Géneros).
 */
export interface ReferenceEntity {
  id: string;
  name: string;
  imageId: string;
  active?: boolean;
}

export type Platform = ReferenceEntity;
export type Genre = ReferenceEntity;

// ─── ENTIDAD PRODUCTO (GAMES) ───

import type { Product } from './schemas';
/**
 * RN - Unificación: Alias de compatibilidad para el dominio de Juegos.
 */
export type Game = Product;
export type { Product } from './schemas';

export interface ProductInput {
  name: string;
  description: string;
  price: number | string;
  platformId: string;
  genreId: string;
  type: string;
  developer: string;
  imageUrl?: string;
  trailerUrl?: string;
  stock: number | string;
  specPreset?: string;
  discountPercentage?: number | string;
  discountEndDate?: string | null;
}

// ─── ENTIDAD USUARIO & SESIÓN (Delegado a Dominio) ───

export type { User, UserRole, SellerProfile } from '@/domain/entities/UserEntity';

// ─── DOMINIO TRANSACCIONAL (Delegado a Dominio) ───

export type { Order, OrderStatus, CartItem } from '@/domain/entities/OrderEntity';

// ─── RESPUESTAS DE API ───

export type Meta = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type PaginatedResponse<T> = {
  products: T[];
  meta: Meta;
};

export type ApiResponse<T> = {
  success: boolean;
  message?: string;
  data?: T;
  pagination?: Meta;
};