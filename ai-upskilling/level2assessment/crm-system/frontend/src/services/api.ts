import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { ApiResponse, PaginatedResponse } from '../types';

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8080/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Generic API methods
export const apiService = {
  // GET request
  get: async <T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
    const response = await api.get(url, config);
    return response.data;
  },

  // POST request
  post: async <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
    const response = await api.post(url, data, config);
    return response.data;
  },

  // PUT request
  put: async <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
    const response = await api.put(url, data, config);
    return response.data;
  },

  // DELETE request
  delete: async <T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
    const response = await api.delete(url, config);
    return response.data;
  },

  // PATCH request
  patch: async <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
    const response = await api.patch(url, data, config);
    return response.data;
  },
};

// Auth API
export const authAPI = {
  login: (credentials: { username: string; password: string }) =>
    apiService.post<{ token: string; user: any }>('/auth/login', credentials),

  register: (userData: any) =>
    apiService.post<{ token: string; user: any }>('/auth/users', userData),

  logout: () => apiService.post('/auth/logout'),

  getCurrentUser: () => apiService.get<any>('/auth/profile/1'),

  refreshToken: () => apiService.post<{ token: string }>('/auth/refresh'),
};

// Customer API
export const customerAPI = {
  getCustomers: (params?: any) =>
    apiService.get<PaginatedResponse<any>>('/customers', { params }),

  getCustomer: (id: string) => apiService.get<any>(`/customers/${id}`),

  createCustomer: (customer: any) => apiService.post<any>('/customers', customer),

  updateCustomer: (id: string, customer: any) =>
    apiService.put<any>(`/customers/${id}`, customer),

  deleteCustomer: (id: string) => apiService.delete(`/customers/${id}`),

  searchCustomers: (query: string) =>
    apiService.get<any[]>(`/customers/search?q=${query}`),
};

// Sales API
export const salesAPI = {
  getOpportunities: (params?: any) =>
    apiService.get<PaginatedResponse<any>>('/sales/opportunities', { params }),

  getOpportunity: (id: string) => apiService.get<any>(`/sales/opportunities/${id}`),

  createOpportunity: (opportunity: any) =>
    apiService.post<any>('/sales/opportunities', opportunity),

  updateOpportunity: (id: string, opportunity: any) =>
    apiService.put<any>(`/sales/opportunities/${id}`, opportunity),

  deleteOpportunity: (id: string) =>
    apiService.delete(`/sales/opportunities/${id}`),

  getSalesMetrics: () => apiService.get<any>('/sales/analytics/pipeline'),

  getPipeline: () => apiService.get<any>('/sales/analytics/pipeline-summary'),

  // AI-powered features
  getHighValueOpportunities: (minScore?: number) =>
    apiService.get<any>(`/sales/opportunities/ai/high-value?minScore=${minScore || 70}`),

  getHighWinProbabilityOpportunities: (minProbability?: number) =>
    apiService.get<any>(`/sales/opportunities/ai/high-win-probability?minProbability=${minProbability || 0.6}`),

  getNextBestAction: (opportunityId: string) =>
    apiService.get<any>(`/sales/opportunities/ai/next-best-action/${opportunityId}`),

  // Tasks
  getTasks: () => apiService.get<any>('/sales/tasks'),

  createTask: (task: any) => apiService.post<any>('/sales/tasks', task),

  updateTask: (id: string, task: any) => apiService.put<any>(`/sales/tasks/${id}`, task),

  deleteTask: (id: string) => apiService.delete(`/sales/tasks/${id}`),

  getOverdueTasks: () => apiService.get<any>('/sales/tasks/overdue'),

  getTasksDueToday: () => apiService.get<any>('/sales/tasks/due-today'),
};

// Analytics API
export const analyticsAPI = {
  getAnalytics: (timeRange: string) =>
    apiService.get<any>(`/analytics?timeRange=${timeRange}`),

  getPredictions: () => apiService.get<any>('/analytics/ai/summary'),

  getRevenueChart: (params?: any) =>
    apiService.get<any>('/analytics/ai/revenue-forecast', { params }),

  getCustomerChart: (params?: any) =>
    apiService.get<any>('/analytics/ai/customer-segmentation', { params }),

  getSalesChart: (params?: any) =>
    apiService.get<any>('/analytics/ai/sales-trends', { params }),

  getAIInsights: () => apiService.get<any>('/analytics/ai/insights/sales'),

  // Dashboard endpoints
  getDashboardOverview: () => apiService.get<any>('/analytics/dashboard/overview'),

  getDashboardTrends: () => apiService.get<any>('/analytics/dashboard/trends'),

  // AI Insights
  getSalesInsights: () => apiService.get<any>('/analytics/ai/insights/sales'),

  getCustomerInsights: () => apiService.get<any>('/analytics/ai/insights/customers'),

  getMarketInsights: () => apiService.get<any>('/analytics/ai/insights/market'),

  // Reports
  getReports: () => apiService.get<any>('/analytics/reports'),

  createReport: (report: any) => apiService.post<any>('/analytics/reports', report),

  updateReport: (id: string, report: any) => apiService.put<any>(`/analytics/reports/${id}`, report),

  deleteReport: (id: string) => apiService.delete(`/analytics/reports/${id}`),
};

// Notifications API
export const notificationAPI = {
  getNotifications: (params?: any) =>
    apiService.get<PaginatedResponse<any>>('/notifications', { params }),

  getNotification: (id: string) => apiService.get<any>(`/notifications/${id}`),

  createNotification: (notification: any) => apiService.post<any>('/notifications', notification),

  updateNotification: (id: string, notification: any) =>
    apiService.put<any>(`/notifications/${id}`, notification),

  deleteNotification: (id: string) => apiService.delete(`/notifications/${id}`),

  markAsRead: (id: string) =>
    apiService.post<any>(`/notifications/${id}/read`),

  markAllAsRead: (recipientId: string) => 
    apiService.post<any>(`/notifications/recipient/${recipientId}/read-all`),

  getUnreadCount: () => apiService.get<{ count: number }>('/notifications/summary'),

  // Notification types
  createSystemNotification: (data: any) => apiService.post<any>('/notifications/system', data),

  createAlertNotification: (data: any) => apiService.post<any>('/notifications/alert', data),

  createUrgentNotification: (data: any) => apiService.post<any>('/notifications/urgent', data),

  createTaskNotification: (data: any) => apiService.post<any>('/notifications/task', data),

  createSalesNotification: (data: any) => apiService.post<any>('/notifications/sales', data),

  // Bulk operations
  sendBulkNotification: (data: any) => apiService.post<any>('/notifications/bulk', data),

  broadcastNotification: (notification: any) => apiService.post<any>('/notifications/broadcast', notification),

  // Search and filter
  searchNotifications: (keyword: string) => apiService.get<any>(`/notifications/search?keyword=${keyword}`),

  getNotificationsByType: (type: string) => apiService.get<any>(`/notifications/type/${type}`),

  getNotificationsByPriority: (priority: string) => apiService.get<any>(`/notifications/priority/${priority}`),
};

// Settings API
export const settingsAPI = {
  getUserSettings: () => apiService.get<any>('/auth/profile/1'),

  updateUserSettings: (settings: any) =>
    apiService.put<any>('/auth/profile/1', settings),

  updateProfile: (profile: any) =>
    apiService.put<any>('/auth/profile/1', profile),

  changePassword: (passwordData: any) =>
    apiService.post<any>('/auth/users/1/change-password', passwordData),

  exportData: () => apiService.get<any>('/analytics/reports/export/1'),

  importData: (data: any) => apiService.post<any>('/analytics/reports/bulk', data),
};

// File Upload API
export const uploadAPI = {
  uploadFile: (file: File, type: string) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    return api.post<any>('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  deleteFile: (fileId: string) => apiService.delete(`/upload/${fileId}`),
};

// WebSocket API
export const socketAPI = {
  connect: (token: string) => {
    // WebSocket connection logic
    const ws = new WebSocket(`ws://localhost:8080/ws?token=${token}`);
    return ws;
  },
};

export default api; 