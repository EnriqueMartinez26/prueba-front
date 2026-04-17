/**
 * ViewModel: Gestor de Estado de Transacciones (Escrow)
 * --------------------------------------------------------------------------
 * Centraliza la lógica de transacciones, balance en escrow y estado de aprobaciones.
 * 
 * Responsabilidades:
 * - Gestionar estado de transacciones pendientes
 * - Calcular balance en escrow (dinero retenido)
 * - Exponer métodos para admin aprobar/rechazar
 * - Exponer métodos para sellers ver sus transacciones
 * 
 * Patrón: ViewModel - Separación entre UI y lógica de negocio
 */

export interface Transaction {
  id: string;
  _id?: string;
  orderId: string;
  sellerId: string;
  amount: number;
  status: 'PENDING_APPROVAL' | 'FUNDS_RELEASED' | 'REJECTED' | 'CANCELLED';
  approvedBy?: string;
  approvedAt?: Date;
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
  seller?: {
    id: string;
    name: string;
    email: string;
  };
  order?: {
    id: string;
    totalPrice: number;
  };
  approvalAdmin?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface EscrowBalance {
  totalEscrow: number;
  totalReleased: number;
  pendingCount: number;
  totalBalance: number;
}

export interface FinancialStats {
  totalEscrow: number;
  pendingTransactionCount: number;
  totalApproved: number;
  approvedTransactionCount: number;
  rejectedCount: number;
}

export interface PaginatedResult<T> {
  total: number;
  page: number;
  limit?: number;
  totalPages: number;
  transactions?: T[];
}

class TransactionViewModel {
  private baseUrl: string = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  // ──────────────────────────────────────────────────────────────────────
  // ADMIN ENDPOINTS - Gestión de Aprobaciones
  // ──────────────────────────────────────────────────────────────────────

  /**
   * Obtiene todas las transacciones pendientes de aprobación.
   * Útil para dashboard admin con lista de work items.
   * 
   * @param page - Número de página (default: 1)
   * @param limit - Elementos por página (default: 10)
   * @returns Lista paginada de transacciones pendientes
   */
  async getPendingTransactions(page: number = 1, limit: number = 10): Promise<PaginatedResult<Transaction>> {
    const response = await fetch(
      `${this.baseUrl}/transactions/admin/pending?page=${page}&limit=${limit}`,
      {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      }
    );

    if (!response.ok) {
      throw new Error(`Error fetching pending transactions: ${response.statusText}`);
    }

    return await response.json();
  }

  /**
   * Admin aprueba una transacción → Libera fondos al vendedor.
   * 
   * @param transactionId - ID de la transacción a aprobar
   * @returns Transacción actualizada
   */
  async approveFundsTransfer(transactionId: string): Promise<{ success: boolean; data: Transaction }> {
    const response = await fetch(
      `${this.baseUrl}/transactions/${transactionId}/approve`,
      {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al aprobar transacción');
    }

    return await response.json();
  }

  /**
   * Admin rechaza una transacción → Devuelve fondos al cliente.
   * 
   * @param transactionId - ID de la transacción a rechazar
   * @param reason - Motivo del rechazo (requerido)
   * @returns Transacción rechazada
   */
  async rejectFundsTransfer(
    transactionId: string,
    reason: string
  ): Promise<{ success: boolean; data: Transaction }> {
    const response = await fetch(
      `${this.baseUrl}/transactions/${transactionId}/reject`,
      {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason })
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al rechazar transacción');
    }

    return await response.json();
  }

  /**
   * Obtiene estadísticas financieras globales (para dashboard admin).
   * 
   * @returns Estadísticas de transacciones y fondos
   */
  async getFinancialStats(): Promise<{ success: boolean; data: FinancialStats }> {
    const response = await fetch(
      `${this.baseUrl}/transactions/admin/stats`,
      {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      }
    );

    if (!response.ok) {
      throw new Error(`Error fetching financial stats: ${response.statusText}`);
    }

    return await response.json();
  }

  // ──────────────────────────────────────────────────────────────────────
  // SELLER ENDPOINTS - Visualización de Transacciones
  // ──────────────────────────────────────────────────────────────────────

  /**
   * Obtiene el balance en escrow del vendedor autenticado.
   * Muestra dinero retenido y liberado.
   * 
   * @returns Balance de escrow del vendedor
   */
  async getEscrowBalance(): Promise<{ success: boolean; data: EscrowBalance }> {
    const response = await fetch(
      `${this.baseUrl}/transactions/seller/escrow`,
      {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      }
    );

    if (!response.ok) {
      throw new Error(`Error fetching escrow balance: ${response.statusText}`);
    }

    return await response.json();
  }

  /**
   * Obtiene todas las transacciones del vendedor autenticado.
   * 
   * @param page - Número de página (default: 1)
   * @param limit - Elementos por página (default: 10)
   * @param status - Filtrar por estado (opcional): PENDING_APPROVAL, FUNDS_RELEASED, REJECTED
   * @returns Lista paginada de transacciones del vendedor
   */
  async getSellerTransactions(
    page: number = 1,
    limit: number = 10,
    status?: 'PENDING_APPROVAL' | 'FUNDS_RELEASED' | 'REJECTED' | 'CANCELLED'
  ): Promise<PaginatedResult<Transaction>> {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    if (status) params.append('status', status);

    const response = await fetch(
      `${this.baseUrl}/transactions/seller/list?${params.toString()}`,
      {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      }
    );

    if (!response.ok) {
      throw new Error(`Error fetching seller transactions: ${response.statusText}`);
    }

    return await response.json();
  }

  // ──────────────────────────────────────────────────────────────────────
  // PUBLIC ENDPOINTS - Detalles de Transacciones
  // ──────────────────────────────────────────────────────────────────────

  /**
   * Obtiene detalles completos de una transacción específica.
   * Acceso: Admin, Seller de la transacción, Cliente que compró
   * 
   * @param transactionId - ID de la transacción
   * @returns Detalles completos de la transacción
   */
  async getTransactionById(transactionId: string): Promise<{ success: boolean; data: Transaction }> {
    const response = await fetch(
      `${this.baseUrl}/transactions/${transactionId}`,
      {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al obtener transacción');
    }

    return await response.json();
  }

  // ──────────────────────────────────────────────────────────────────────
  // Métodos Helper
  // ──────────────────────────────────────────────────────────────────────

  /**
   * Formatea el estado de una transacción para mostrar al usuario.
   * 
   * @param status - Estado de la transacción
   * @returns Texto formateado en español
   */
  formatStatus(status: string): string {
    const statusMap: Record<string, string> = {
      PENDING_APPROVAL: '⏳ Pendiente de aprobación',
      FUNDS_RELEASED: '✅ Fondos liberados',
      REJECTED: '❌ Rechazada',
      CANCELLED: '🚫 Cancelada'
    };
    return statusMap[status] || status;
  }

  /**
   * Retorna el color para mostrar el estado en UI.
   * 
   * @param status - Estado de la transacción
   * @returns Color en formato hex o nombre
   */
  getStatusColor(status: string): string {
    const colorMap: Record<string, string> = {
      PENDING_APPROVAL: '#f59e0b', // amber
      FUNDS_RELEASED: '#10b981', // green
      REJECTED: '#ef4444', // red
      CANCELLED: '#6b7280' // gray
    };
    return colorMap[status] || '#9ca3af';
  }

  /**
   * Calcula días desde creación de la transacción.
   * 
   * @param createdAt - Fecha de creación
   * @returns Cantidad de días transcurridos
   */
  getDaysSince(createdAt: Date | string): number {
    const created = typeof createdAt === 'string' ? new Date(createdAt) : createdAt;
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - created.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  /**
   * Valida que un monto sea válido para transacción.
   * 
   * @param amount - Monto a validar
   * @returns True si es válido
   */
  isValidAmount(amount: number): boolean {
    return typeof amount === 'number' && amount > 0 && isFinite(amount);
  }
}

// Exportar instancia singleton
export default new TransactionViewModel();
