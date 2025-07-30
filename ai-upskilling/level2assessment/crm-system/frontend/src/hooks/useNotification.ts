import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import { RootState } from '../store';
import { 
  showSnackbar, 
  hideSnackbar,
  fetchNotifications,
  markAsRead,
  deleteNotification 
} from '../store/slices/uiSlice';
import { notificationAPI } from '../services/api';

export const useNotification = () => {
  const dispatch = useDispatch();
  const { snackbar } = useSelector((state: RootState) => state.ui);
  const { notifications, loading } = useSelector((state: RootState) => state.notifications);

  const showNotification = useCallback(
    (message: string, severity: 'success' | 'error' | 'warning' | 'info' = 'info') => {
      dispatch(showSnackbar({ message, severity }));
    },
    [dispatch]
  );

  const hideNotification = useCallback(() => {
    dispatch(hideSnackbar());
  }, [dispatch]);

  const showSuccess = useCallback(
    (message: string) => {
      showNotification(message, 'success');
    },
    [showNotification]
  );

  const showError = useCallback(
    (message: string) => {
      showNotification(message, 'error');
    },
    [showNotification]
  );

  const showWarning = useCallback(
    (message: string) => {
      showNotification(message, 'warning');
    },
    [showNotification]
  );

  const showInfo = useCallback(
    (message: string) => {
      showNotification(message, 'info');
    },
    [showNotification]
  );

  const loadNotifications = useCallback(
    async (params?: any) => {
      try {
        await dispatch(fetchNotifications(params));
      } catch (error) {
        showError('Failed to load notifications');
      }
    },
    [dispatch, showError]
  );

  const markNotificationAsRead = useCallback(
    async (notificationId: string) => {
      try {
        await dispatch(markAsRead(notificationId));
        showSuccess('Notification marked as read');
      } catch (error) {
        showError('Failed to mark notification as read');
      }
    },
    [dispatch, showSuccess, showError]
  );

  const deleteNotificationById = useCallback(
    async (notificationId: string) => {
      try {
        await dispatch(deleteNotification(notificationId));
        showSuccess('Notification deleted');
      } catch (error) {
        showError('Failed to delete notification');
      }
    },
    [dispatch, showSuccess, showError]
  );

  const getUnreadCount = useCallback(() => {
    return notifications.filter((notification: any) => !notification.read).length;
  }, [notifications]);

  return {
    snackbar,
    notifications,
    loading,
    showNotification,
    hideNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    loadNotifications,
    markNotificationAsRead,
    deleteNotificationById,
    getUnreadCount,
  };
}; 