import api from './api';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  company: string;
  phone?: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: number;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    isActive: boolean;
  };
}

export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isActive: boolean;
}

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await api.post('/auth/login', credentials);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  }

  async register(userData: RegisterData): Promise<{ message: string }> {
    try {
      const response = await api.post('/auth/users', userData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  }

  async logout(): Promise<void> {
    try {
      // Get username from localStorage or use a default
      const user = localStorage.getItem('user');
      const username = user ? JSON.parse(user).username : 'default';
      
      await api.post('/auth/logout', { username });
    } catch (error: any) {
      // Even if logout fails on server, we should clear local storage
      console.warn('Logout failed on server:', error);
    } finally {
      // Always clear local storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }

  async getCurrentUser(): Promise<User> {
    try {
      const response = await api.get('/auth/profile/1'); // Using profile endpoint
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get user');
    }
  }

  async refreshToken(): Promise<{ token: string }> {
    try {
      const response = await api.post('/auth/refresh');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Token refresh failed');
    }
  }

  async forgotPassword(email: string): Promise<{ message: string }> {
    try {
      const response = await api.post('/auth/reset-password', { email });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Password reset failed');
    }
  }

  async resetPassword(token: string, password: string): Promise<{ message: string }> {
    try {
      const response = await api.post('/auth/reset-password', { token, password });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Password reset failed');
    }
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<{ message: string }> {
    try {
      const response = await api.post('/auth/users/1/change-password', {
        oldPassword: currentPassword,
        newPassword: newPassword
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Password change failed');
    }
  }

  async updateProfile(profileData: Partial<User>): Promise<User> {
    try {
      const response = await api.put('/auth/profile/1', profileData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Profile update failed');
    }
  }

  // Helper method to check if user is authenticated
  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return !!token;
  }

  // Helper method to get token
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Helper method to set token
  setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  // Helper method to clear token
  clearToken(): void {
    localStorage.removeItem('token');
  }
}

export const authService = new AuthService(); 