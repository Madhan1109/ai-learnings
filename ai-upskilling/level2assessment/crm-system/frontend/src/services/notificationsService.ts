import api from './api';

export interface Notification {
  id: number;
  title: string;
  message: string;
  type: 'success' | 'warning' | 'error' | 'info';
  read: boolean;
  createdAt: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  actionUrl?: string;
}

class NotificationsService {
  async getNotifications(): Promise<Notification[]> {
    try {
      // For now, return mock data
      return [
        {
          id: 1,
          title: 'New Customer Added',
          message: 'Madhan M S from TechCorp has been added to your customer list.',
          type: 'success',
          read: false,
          createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
          category: 'customers',
          priority: 'medium'
        },
        {
          id: 2,
          title: 'Opportunity Updated',
          message: 'The "Enterprise Software Deal" opportunity has been moved to the negotiation stage.',
          type: 'info',
          read: false,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
          category: 'sales',
          priority: 'high'
        },
        {
          id: 3,
          title: 'Task Due Soon',
          message: 'Follow up with ABC Company is due in 2 hours.',
          type: 'warning',
          read: true,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
          category: 'tasks',
          priority: 'high'
        },
        {
          id: 4,
          title: 'System Maintenance',
          message: 'Scheduled maintenance will occur tonight at 2 AM EST.',
          type: 'info',
          read: true,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
          category: 'system',
          priority: 'low'
        },
        {
          id: 5,
          title: 'Revenue Target Achieved',
          message: 'Congratulations! Your team has achieved 110% of this month\'s revenue target.',
          type: 'success',
          read: false,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
          category: 'sales',
          priority: 'medium'
        },
        {
          id: 6,
          title: 'Lead Conversion',
          message: 'A high-value lead from LinkedIn has been converted to a customer.',
          type: 'success',
          read: true,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
          category: 'leads',
          priority: 'medium'
        },
        {
          id: 7,
          title: 'Performance Alert',
          message: 'Your conversion rate has dropped by 5% this week. Consider reviewing your sales process.',
          type: 'warning',
          read: false,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
          category: 'analytics',
          priority: 'high'
        },
        {
          id: 8,
          title: 'New Feature Available',
          message: 'AI-powered lead scoring is now available. Try it out with your existing leads.',
          type: 'info',
          read: true,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
          category: 'system',
          priority: 'medium'
        }
      ];
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch notifications');
    }
  }

  async markAsRead(notificationId: number): Promise<Notification> {
    try {
      // Mock implementation
      const notification = {
        id: notificationId,
        title: 'Test',
        message: 'Test',
        type: 'info' as const,
        read: true,
        createdAt: new Date().toISOString(),
        category: 'test',
        priority: 'medium' as const
      };
      return notification;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to mark notification as read');
    }
  }

  async markAllAsRead(): Promise<void> {
    try {
      // Mock implementation
      return;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to mark all notifications as read');
    }
  }

  async deleteNotification(notificationId: number): Promise<number> {
    try {
      // Mock implementation
      return notificationId;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to delete notification');
    }
  }
}

export default new NotificationsService();
