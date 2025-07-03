import { api } from '../../api';

export interface Course {
  id?: number;
  title: string;
  description: string;
  contentUrl?: string;
  version?: number;
  tags?: string;
}

export async function getCourses() {
  return api.get('/api/courses');
}

export async function getCourse(id: number) {
  return api.get(`/api/courses/${id}`);
}

export async function createCourse(data: Course) {
  return api.post('/api/courses', data);
}

export async function updateCourse(id: number, data: Course) {
  return api.put(`/api/courses/${id}`, data);
}

export async function deleteCourse(id: number) {
  return api.delete(`/api/courses/${id}`);
}

export async function searchCourses(params: { title?: string; tag?: string }) {
  return api.get('/api/courses/search', { params });
}

export async function uploadCourseContent(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  return api.post('/api/courses/content/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
} 