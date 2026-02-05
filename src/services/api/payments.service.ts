// Service pour les paiements
import { apiClient } from './client';
import type { ApiResponse } from './types';

// Types pour les paiements
export interface PaymentRequest {
  orderId: string;
  amount: number;
  paymentMethod: 'mobile_money' | 'cash' | 'card';
  phoneNumber?: string; // Pour Mobile Money
  cardToken?: string; // Pour carte bancaire
}

export interface Transaction {
  id: string;
  orderId: string;
  amount: number;
  paymentMethod: 'mobile_money' | 'cash' | 'card';
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  reference: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentResponse {
  success: boolean;
  data?: {
    transaction: Transaction;
    redirectUrl?: string; // Pour les paiements qui nécessitent une redirection
  };
  message?: string;
}

export const paymentService = {
  /**
   * Effectuer un paiement
   */
  processPayment: async (paymentData: PaymentRequest): Promise<Transaction> => {
    const response = await apiClient.post<PaymentResponse>('/api/payments/process', paymentData);
    
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Échec du paiement');
    }
    
    return response.data.transaction;
  },

  /**
   * Récupérer l'historique des transactions
   */
  getTransactions: async (): Promise<Transaction[]> => {
    const response = await apiClient.get<ApiResponse<Transaction[]>>('/api/payments/transactions');
    
    if (!response.success || !response.data) {
      return [];
    }
    
    return response.data;
  },

  /**
   * Rembourser une transaction
   */
  refundTransaction: async (transactionId: string, reason?: string): Promise<Transaction> => {
    const response = await apiClient.post<ApiResponse<Transaction>>(
      `/api/payments/${transactionId}/refund`,
      { reason }
    );
    
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Échec du remboursement');
    }
    
    return response.data;
  },
};

export default paymentService;
