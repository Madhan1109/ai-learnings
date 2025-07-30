import { useSelector, useDispatch } from 'react-redux';
import { useCallback } from 'react';
import { RootState } from '../store';
import { login, logout, register, getCurrentUser } from '../store/slices/authSlice';
import { authAPI } from '../services/api';
import { storage } from '../utils';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, loading, error } = useSelector(
    (state: RootState) => state.auth
  );

  const loginUser = useCallback(
    async (credentials: { email: string; password: string }) => {
      try {
        const response = await authAPI.login(credentials);
        const { token, user } = response.data;
        
        // Store token in localStorage
        storage.set('token', token);
        storage.set('user', user);
        
        // Update Redux state
        dispatch(login({ user, token }));
        
        return { success: true };
      } catch (error: any) {
        return { 
          success: false, 
          error: error.response?.data?.message || 'Login failed' 
        };
      }
    },
    [dispatch]
  );

  const registerUser = useCallback(
    async (userData: any) => {
      try {
        const response = await authAPI.register(userData);
        const { token, user } = response.data;
        
        // Store token in localStorage
        storage.set('token', token);
        storage.set('user', user);
        
        // Update Redux state
        dispatch(register({ user, token }));
        
        return { success: true };
      } catch (error: any) {
        return { 
          success: false, 
          error: error.response?.data?.message || 'Registration failed' 
        };
      }
    },
    [dispatch]
  );

  const logoutUser = useCallback(async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear localStorage
      storage.remove('token');
      storage.remove('user');
      
      // Update Redux state
      dispatch(logout());
    }
  }, [dispatch]);

  const checkAuth = useCallback(async () => {
    const token = storage.get('token');
    const storedUser = storage.get('user');
    
    if (token && storedUser) {
      try {
        // Verify token with backend
        const response = await authAPI.getCurrentUser();
        dispatch(login({ user: response.data, token }));
      } catch (error) {
        // Token is invalid, clear everything
        storage.remove('token');
        storage.remove('user');
        dispatch(logout());
      }
    }
  }, [dispatch]);

  const refreshUser = useCallback(async () => {
    if (isAuthenticated) {
      dispatch(getCurrentUser());
    }
  }, [dispatch, isAuthenticated]);

  return {
    user,
    isAuthenticated,
    loading,
    error,
    loginUser,
    registerUser,
    logoutUser,
    checkAuth,
    refreshUser,
  };
}; 