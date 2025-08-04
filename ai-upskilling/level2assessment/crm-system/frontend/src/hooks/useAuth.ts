import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../store';
import { login, logout, register, getCurrentUser } from '../store/slices/authSlice';
import { authAPI } from '../services/api';
import { storage } from '../utils';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, loading, error } = useSelector((state: RootState) => state.auth);

  const loginUser = useCallback(
    async (credentials: { username: string; password: string }) => {
      try {
        const response = await authAPI.login(credentials);
        const { token, user } = response.data;

        // Store token in localStorage
        storage.set('token', token);
        storage.set('user', user);

        // Update Redux state
        dispatch(login(credentials));

        return { success: true };
      } catch (error: any) {
        return { success: false, error: error.message };
      }
    },
    [dispatch]
  );

  const registerUser = useCallback(
    async (userData: {
      firstName: string;
      lastName: string;
      username: string;
      email: string;
      password: string;
      company: string;
      phone?: string;
    }) => {
      try {
        const response = await authAPI.register(userData);
        return { success: true, data: response.data };
      } catch (error: any) {
        return { success: false, error: error.message };
      }
    },
    []
  );

  const logoutUser = useCallback(() => {
    // Clear localStorage
    storage.remove('token');
    storage.remove('user');

    // Update Redux state
    dispatch(logout());
  }, [dispatch]);

  const checkAuth = useCallback(async () => {
    const token = storage.get('token');
    if (token && !isAuthenticated) {
      try {
        // Verify token with backend
        const response = await authAPI.getCurrentUser();
        // Don't dispatch login here, just update the user state
        dispatch(getCurrentUser());
      } catch (error) {
        // Token is invalid, clear everything
        storage.remove('token');
        storage.remove('user');
        dispatch(logout());
      }
    }
  }, [dispatch, isAuthenticated]);

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