import { api } from '../../api';

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export async function registerUser(data: RegisterRequest) {
  return api.post('/api/users/register', data);
}

export async function loginUser(data: LoginRequest) {
  return api.post('/api/auth/login', data);
}

export async function getUserByUsername(username: string) {
  return api.get(`/api/users/by-username/${username}`);
}

export async function getCurrentUser() {
  return api.get('/api/users/me');
}

export async function updateCurrentUser(data: any) {
  return api.patch('/api/users/me', data);
} 