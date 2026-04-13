/**
 * Capa de Presentación: ViewModels (Patrón MVVM)
 * --------------------------------------------------------------------------
 * Implementación formal de los 4 pilares de la Programación Orientada a Objetos:
 *
 * 1. ABSTRACCIÓN: `BaseViewModel<T>` define el contrato común (interfaz pública)
 *    sin exponer detalles de implementación a las capas superiores.
 *
 * 2. ENCAPSULAMIENTO: `_data` es privado (prefijo convencional). El acceso a
 *    la entidad subyacente se controla mediante `getRawData()` para auditorías
 *    específicas, evitando mutaciones directas desde la Vista.
 *
 * 3. HERENCIA: `ProductViewModel` y `OrderViewModel` heredan de `BaseViewModel<T>`,
 *    reutilizando `getSummaryLine()` sin reescribirlo.
 *
 * 4. POLIMORFISMO: El método `toReportRow()` se comporta de forma diferente en
 *    `ProductViewModel` (columnas de inventario) y `OrderViewModel` (columnas
 *    transaccionales), respetando el mismo contrato del padre.
 *
 * (MVC / ViewModel Layer)
 */

import type { Product, Order } from './types';

/**
 * RN - Abstracción Base: Contrato genérico para todas las entidades del sistema.
 * Las clases concretas deben implementar la transformación de datos a representación visual.
 */
export abstract class BaseViewModel<T> {
  public readonly _data: T;
  constructor(data: T) { this._data = data; }
  abstract getDisplayId(): string;
  abstract toDisplayPrice(): string;

  /** Herencia: Método compartido disponible para todas las subclases sin reimplementación. */
  getSummaryLine(): string { return `[${this.getDisplayId()}] — ${this.toDisplayPrice()}`; }

  /**
   * Encapsulamiento Controlado: Expone la entidad subyacente solo cuando
   * la capa de presentación lo requiere explícitamente (ej. auditoría de órdenes).
   */
  getRawData(): T { return this._data; }

  abstract toReportRow(): string[];
}

/**
 * RN - Activo de Catálogo (ViewModel): Transforma la entidad `Product` en
 * representaciones visuales y datos de auditoría para el panel administrativo.
 * Polimorfismo: `toReportRow()` genera columnas de inventario específicas.
 */
export class ProductViewModel extends BaseViewModel<Product> {
  constructor(product: Product) { super(product); }

  getDisplayId(): string { return this._data.id ?? 'sin-id'; }
  toDisplayPrice(): string {
    return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(this._data.finalPrice ?? this._data.price);
  }

  isOnSale(): boolean { return (this._data.discountPercentage ?? 0) > 0; }
  getDiscountBadge(): string { return `-${this._data.discountPercentage}%`; }
  getOriginalPrice(): string {
    return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(this._data.price);
  }
  hasStock(): boolean { return (this._data.stock ?? 0) > 0; }
  getStockBadge(): 'available' | 'low' | 'out' {
    const stock = this._data.stock ?? 0;
    if (stock === 0) return 'out';
    if (stock <= 5) return 'low';
    return 'available';
  }

  getPlatformName(): string { 
    return typeof this._data.platform === 'object' ? this._data.platform.name : (this._data.platform || 'General'); 
  }
  getGenreName(): string { 
    return typeof this._data.genre === 'object' ? this._data.genre.name : (this._data.genre || 'Varios'); 
  }

  getImageUrl(): string {
    const url = this._data.imageId;
    return (url && (url.startsWith('http') || url.startsWith('/'))) ? url : 'https://placehold.co/600x400?text=No+Image';
  }

  /** Polimorfismo: Genera columnas de inventario para reportes de stock. */
  toReportRow(): string[] {
    return [
      this._data.id,
      this._data.name,
      this.getPlatformName(),
      this.toDisplayPrice(),
      String(this._data.stock ?? 0),
      this._data.type
    ];
  }
}

/**
 * RN - Registro Transaccional (ViewModel): Transforma la entidad `Order` en
 * representaciones visuales para el panel de auditoría de órdenes.
 * Polimorfismo: `toReportRow()` genera columnas transaccionales específicas.
 */
export class OrderViewModel extends BaseViewModel<Order> {
  constructor(order: Order) { super(order); }

  getDisplayId(): string { return (this._data.id ?? '').slice(-8).toUpperCase(); }
  toDisplayPrice(): string {
    const total = Number(this._data.totalPrice ?? this._data.total ?? 0);
    return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(total);
  }

  getCustomerName(): string { return this._data.user?.name || 'Invitado'; }
  getCustomerEmail(): string { return this._data.user?.email || 'N/A'; }
  isPaid(): boolean { return !!this._data.isPaid; }
  
  getStatusLabel(): string {
    const labels: Record<string, string> = { 
      pending: 'Pendiente', 
      processing: 'Procesando', 
      shipped: 'Enviado', 
      delivered: 'Entregado', 
      cancelled: 'Cancelado' 
    };
    return labels[this._data.orderStatus ?? 'pending'] || 'Pendiente';
  }

  getStatusBadgeVariant(): "default" | "secondary" | "destructive" | "outline" {
    const variants: Record<string, any> = {
      pending: "secondary",
      processing: "default",
      shipped: "default",
      delivered: "outline",
      cancelled: "destructive"
    };
    return variants[this._data.orderStatus ?? 'pending'] || "default";
  }

  getStatusBadgeColor(): string {
    const colors: Record<string, string> = {
      pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
      processing: "bg-blue-500/10 text-blue-500 border-blue-500/20",
      shipped: "bg-purple-500/10 text-purple-500 border-purple-500/20",
      delivered: "bg-green-500/10 text-green-500 border-green-500/20",
      cancelled: "bg-red-500/10 text-red-500 border-red-500/20"
    };
    return colors[this._data.orderStatus ?? 'pending'] || "";
  }

  getPaymentStatus() {
    return this.isPaid() 
      ? { label: 'Pagado', color: 'text-green-500' } 
      : { label: 'Pendiente', color: 'text-yellow-500' };
  }

  /** RN - Auditoría de Fecha: Formato legible de la fecha de creación del registro. */
  getFormattedDate(): string {
    return new Date(this._data.createdAt).toLocaleDateString('es-AR');
  }

  /** Alias técnico de getFormattedDate() para compatibilidad con la capa de vista. */
  getOrderDate(): string {
    return this.getFormattedDate();
  }

  /** Polimorfismo: Genera columnas transaccionales para reportes de órdenes. */
  toReportRow(): string[] {
    return [
      this.getDisplayId(),
      this.getCustomerName(),
      this.toDisplayPrice(),
      this.getStatusLabel(),
      this.isPaid() ? 'PAGADO' : 'PENDIENTE',
      this.getFormattedDate()
    ];
  }
}

