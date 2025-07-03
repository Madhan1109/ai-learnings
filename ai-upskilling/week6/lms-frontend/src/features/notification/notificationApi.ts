import { api } from '../../api';

export interface Notification {
  id?: number;
  userId: number;
  message: string;
  read?: boolean;
  createdAt?: string;
}

export async function getNotifications(userId: number) {
  return api.get(`/api/notifications/user/${userId}`);
}

export async function markNotificationRead(id: number) {
  return api.patch(`/api/notifications/${id}/read`);
}

// WebSocket for chat/announcements to be implemented in a separate hook/component 