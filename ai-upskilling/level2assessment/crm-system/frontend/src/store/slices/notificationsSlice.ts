import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import notificationsService from '../../services/notificationsService';

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

export interface NotificationsState {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
}

const initialState: NotificationsState = {
  notifications: [
    {
      id: 1,
      title: 'New Customer Added',
      message: 'Madhan M S from TechCorp has been added to your customer list.',
      type: 'success',
      read: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
      category: 'customers',
      priority: 'medium'
    },
    {
      id: 2,
      title: 'Opportunity Updated',
      message: 'The "Enterprise Software Deal" opportunity has been moved to the negotiation stage.',
      type: 'info',
      read: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
      category: 'sales',
      priority: 'high'
    },
    {
      id: 3,
      title: 'Task Due Soon',
      message: 'Follow up with ABC Company is due in 2 hours.',
      type: 'warning',
      read: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), // 4 hours ago
      category: 'tasks',
      priority: 'high'
    },
    {
      id: 4,
      title: 'System Maintenance',
      message: 'Scheduled maintenance will occur tonight at 2 AM EST.',
      type: 'info',
      read: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(), // 6 hours ago
      category: 'system',
      priority: 'low'
    },
    {
      id: 5,
      title: 'Revenue Target Achieved',
      message: 'Congratulations! Your team has achieved 110% of this month\'s revenue target.',
      type: 'success',
      read: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(), // 8 hours ago
      category: 'sales',
      priority: 'medium'
    },
    {
      id: 6,
      title: 'Lead Conversion',
      message: 'A high-value lead from LinkedIn has been converted to a customer.',
      type: 'success',
      read: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(), // 12 hours ago
      category: 'leads',
      priority: 'medium'
    },
    {
      id: 7,
      title: 'Performance Alert',
      message: 'Your conversion rate has dropped by 5% this week. Consider reviewing your sales process.',
      type: 'warning',
      read: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
      category: 'analytics',
      priority: 'high'
    },
    {
      id: 8,
      title: 'New Feature Available',
      message: 'AI-powered lead scoring is now available. Try it out with your existing leads.',
      type: 'info',
      read: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
      category: 'system',
      priority: 'medium'
    }
  ],
  unreadCount: 4,
  loading: false,
  error: null,
};

export const fetchNotifications = createAsyncThunk(
  'notifications/fetchNotifications',
  async (_, { rejectWithValue }) => {
    try {
      const response = await notificationsService.getNotifications();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch notifications');
    }
  }
);

export const markAsRead = createAsyncThunk(
  'notifications/markAsRead',
  async (notificationId: number, { rejectWithValue }) => {
    try {
      const response = await notificationsService.markAsRead(notificationId);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to mark notification as read');
    }
  }
);

export const markAllAsRead = createAsyncThunk(
  'notifications/markAllAsRead',
  async (_, { rejectWithValue }) => {
    try {
      const response = await notificationsService.markAllAsRead();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to mark all notifications as read');
    }
  }
);

export const deleteNotification = createAsyncThunk(
  'notifications/deleteNotification',
  async (notificationId: number, { rejectWithValue }) => {
    try {
      const response = await notificationsService.deleteNotification(notificationId);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete notification');
    }
  }
);

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    addNotification: (state, action: PayloadAction<Notification>) => {
      state.notifications.unshift(action.payload);
      if (!action.payload.read) {
        state.unreadCount += 1;
      }
    },
    updateUnreadCount: (state) => {
      state.unreadCount = state.notifications.filter(n => !n.read).length;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload;
        state.unreadCount = action.payload.filter((n: Notification) => !n.read).length;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(markAsRead.fulfilled, (state, action) => {
        const notification = state.notifications.find(n => n.id === action.payload.id);
        if (notification) {
          notification.read = true;
          state.unreadCount = state.notifications.filter(n => !n.read).length;
        }
      })
      .addCase(markAllAsRead.fulfilled, (state) => {
        state.notifications.forEach(n => n.read = true);
        state.unreadCount = 0;
      })
      .addCase(deleteNotification.fulfilled, (state, action) => {
        const deletedNotification = state.notifications.find(n => n.id === action.payload);
        if (deletedNotification && !deletedNotification.read) {
          state.unreadCount -= 1;
        }
        state.notifications = state.notifications.filter(n => n.id !== action.payload);
      });
  },
});

export const { clearError, addNotification, updateUnreadCount } = notificationsSlice.actions;
export default notificationsSlice.reducer;
