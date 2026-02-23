import { apiClient } from './client';
import type { ApiResponse } from './types';

export interface NotificationDTO {
  id?: string;
  _id?: string;
  userId?: string;
  type?: string;
  title?: string;
  message?: string;
  read?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
  updatedAt?: Date;
}

const mapNotificationFromApi = (dto: NotificationDTO): Notification => ({
  id: dto.id || dto._id || '',
  userId: dto.userId || '',
  type: dto.type || 'general',
  title: dto.title || 'Notification',
  message: dto.message || '',
  read: Boolean(dto.read),
  createdAt: dto.createdAt ? new Date(dto.createdAt) : new Date(),
  updatedAt: dto.updatedAt ? new Date(dto.updatedAt) : undefined,
});

const extractNotifications = (response: any): NotificationDTO[] => {
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.data?.notifications)) return response.data.notifications;
  if (Array.isArray(response?.notifications)) return response.notifications;
  if (Array.isArray(response)) return response;
  return [];
};

export const notificationService = {
  getNotifications: async (userId: string): Promise<Notification[]> => {
    const response = await apiClient.get<ApiResponse<NotificationDTO[]> | any>(
      `/api/notifications?userId=${encodeURIComponent(userId)}`
    );
    return extractNotifications(response).map(mapNotificationFromApi);
  },

  markAsRead: async (notificationId: string): Promise<Notification> => {
    const response = await apiClient.patch<ApiResponse<NotificationDTO> | any>(
      `/api/notifications/${notificationId}/read`
    );
    const dto = response?.data ?? response;
    return mapNotificationFromApi(dto);
  },

  markAllAsRead: async (userId: string): Promise<void> => {
    const response = await apiClient.post<ApiResponse<null>>('/api/notifications/read-all', { userId });
    if (response && response.success === false) {
      throw new Error(response.message || 'Echec de la mise a jour des notifications');
    }
  },

  deleteNotification: async (notificationId: string): Promise<void> => {
    const response = await apiClient.delete<ApiResponse<null>>(`/api/notifications/${notificationId}`);
    if (response && response.success === false) {
      throw new Error(response.message || 'Echec de la suppression de la notification');
    }
  },
};

export default notificationService;
