// Service pour les uploads de fichiers
import { apiClient, tokenManager } from './client';
import { config } from '../../config';
import type { ApiResponse } from './types';

// Types pour les uploads
export interface UploadedFile {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  createdAt: string;
}

export const uploadService = {
  /**
   * Upload d'un fichier unique
   */
  uploadSingle: async (file: File): Promise<UploadedFile> => {
    const formData = new FormData();
    formData.append('file', file);

    const token = tokenManager.getToken();
    
    const response = await fetch(`${config.apiUrl}/api/uploads/single`, {
      method: 'POST',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: "Échec de l'upload" }));
      throw new Error(error.message || "Échec de l'upload");
    }

    const result: ApiResponse<UploadedFile> = await response.json();
    
    if (!result.success || !result.data) {
      throw new Error(result.message || "Échec de l'upload");
    }

    return result.data;
  },

  /**
   * Upload de plusieurs fichiers
   */
  uploadMultiple: async (files: File[]): Promise<UploadedFile[]> => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });

    const token = tokenManager.getToken();
    
    const response = await fetch(`${config.apiUrl}/api/uploads/multiple`, {
      method: 'POST',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: "Échec de l'upload" }));
      throw new Error(error.message || "Échec de l'upload");
    }

    const result: ApiResponse<UploadedFile[]> = await response.json();
    
    if (!result.success || !result.data) {
      throw new Error(result.message || "Échec de l'upload");
    }

    return result.data;
  },

  /**
   * Récupérer les informations d'un fichier
   */
  getFileInfo: async (fileId: string): Promise<UploadedFile> => {
    const response = await apiClient.get<ApiResponse<UploadedFile>>(`/api/uploads/${fileId}`);
    
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Fichier non trouvé');
    }
    
    return response.data;
  },

  /**
   * Supprimer un fichier
   */
  deleteFile: async (fileId: string): Promise<void> => {
    const response = await apiClient.delete<ApiResponse<null>>(`/api/uploads/${fileId}`);
    
    if (!response.success) {
      throw new Error(response.message || 'Échec de la suppression du fichier');
    }
  },
};

export default uploadService;
