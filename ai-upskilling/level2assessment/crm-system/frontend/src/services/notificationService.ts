import api from './api';

export interface Notification {
  id: number;
  title: string;
  message: string;
  type: string;
  priority: string;
  recipientId: number;
  read: boolean;
  sent: boolean;
  actionUrl?: string;
  actionText?: string;
  metadata?: string;
  createdAt: string;
  updatedAt: string;
}

class NotificationService {
  async getNotifications(params?: any): Promise<{ data: Notification[]; total: number; page: number; limit: number; totalPages: number }> {
    try {
      const response = await api.get('/notifications', { params });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch notifications');
    }
  }

  async getNotification(id: string): Promise<Notification> {
    try {
      const response = await api.get(`/notifications/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch notification');
    }
  }

  async createNotification(notification: Partial<Notification>): Promise<Notification> {
    try {
      const response = await api.post('/notifications', notification);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to create notification');
    }
  }

  async updateNotification(id: string, notification: Partial<Notification>): Promise<Notification> {
    try {
      const response = await api.put(`/notifications/${id}`, notification);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update notification');
    }
  }

  async deleteNotification(id: string): Promise<void> {
    try {
      await api.delete(`/notifications/${id}`);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to delete notification');
    }
  }

  async markAsRead(id: string): Promise<Notification> {
    try {
      const response = await api.post(`/notifications/${id}/read`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to mark notification as read');
    }
  }

  async markAllAsRead(recipientId: string): Promise<void> {
    try {
      await api.post(`/notifications/recipient/${recipientId}/read-all`);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to mark all notifications as read');
    }
  }

  async getUnreadCount(): Promise<{ count: number }> {
    try {
      const response = await api.get('/notifications/summary');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get unread count');
    }
  }

  async searchNotifications(keyword: string): Promise<Notification[]> {
    try {
      const response = await api.get(`/notifications/search?keyword=${keyword}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to search notifications');
    }
  }

  async getNotificationsByType(type: string): Promise<Notification[]> {
    try {
      const response = await api.get(`/notifications/type/${type}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch notifications by type');
    }
  }

  async getNotificationsByPriority(priority: string): Promise<Notification[]> {
    try {
      const response = await api.get(`/notifications/priority/${priority}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch notifications by priority');
    }
  }
}

export const notificationService = new NotificationService(); 