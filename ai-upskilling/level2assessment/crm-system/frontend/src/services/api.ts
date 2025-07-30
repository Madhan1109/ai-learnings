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
  login: (credentials: { email: string; password: string }) =>
    apiService.post<{ token: string; user: any }>('/auth/login', credentials),

  register: (userData: any) =>
    apiService.post<{ token: string; user: any }>('/auth/register', userData),

  logout: () => apiService.post('/auth/logout'),

  getCurrentUser: () => apiService.get<any>('/auth/me'),

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

  getSalesMetrics: () => apiService.get<any>('/sales/metrics'),

  getPipeline: () => apiService.get<any>('/sales/pipeline'),
};

// Analytics API
export const analyticsAPI = {
  getAnalytics: (timeRange: string) =>
    apiService.get<any>(`/analytics?timeRange=${timeRange}`),

  getPredictions: () => apiService.get<any>('/analytics/predictions'),

  getRevenueChart: (params?: any) =>
    apiService.get<any>('/analytics/revenue-chart', { params }),

  getCustomerChart: (params?: any) =>
    apiService.get<any>('/analytics/customer-chart', { params }),

  getSalesChart: (params?: any) =>
    apiService.get<any>('/analytics/sales-chart', { params }),

  getAIInsights: () => apiService.get<any>('/analytics/insights'),
};

// Notifications API
export const notificationAPI = {
  getNotifications: (params?: any) =>
    apiService.get<PaginatedResponse<any>>('/notifications', { params }),

  markAsRead: (id: string) =>
    apiService.patch<any>(`/notifications/${id}/read`),

  markAllAsRead: () => apiService.patch<any>('/notifications/read-all'),

  deleteNotification: (id: string) =>
    apiService.delete(`/notifications/${id}`),

  getUnreadCount: () => apiService.get<{ count: number }>('/notifications/unread-count'),
};

// Settings API
export const settingsAPI = {
  getUserSettings: () => apiService.get<any>('/settings'),

  updateUserSettings: (settings: any) =>
    apiService.put<any>('/settings', settings),

  updateProfile: (profile: any) =>
    apiService.put<any>('/settings/profile', profile),

  changePassword: (passwordData: any) =>
    apiService.put<any>('/settings/password', passwordData),

  exportData: () => apiService.get<any>('/settings/export'),

  importData: (data: any) => apiService.post<any>('/settings/import', data),
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