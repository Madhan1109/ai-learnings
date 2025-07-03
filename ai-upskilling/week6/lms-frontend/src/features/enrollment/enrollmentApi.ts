import { api } from '../../api';

export interface Enrollment {
  id?: number;
  userId: number;
  courseId: number;
  progress?: number;
  certificateUrl?: string;
}

export async function enrollInCourse(userId: number, courseId: number) {
  return api.post('/api/enrollments', { userId, courseId });
}

export async function getEnrollments(userId: number) {
  return api.get(`/api/enrollments/user/${userId}`);
}

export async function updateProgress(enrollmentId: number, progress: number) {
  return api.patch(`/api/enrollments/${enrollmentId}/progress`, { progress });
}

export async function getEnrollmentAnalytics(courseId: number) {
  return api.get(`/api/enrollments/analytics/${courseId}`);
}

export async function getCertificateUrl(enrollmentId: number) {
  return api.get(`/api/enrollments/${enrollmentId}/certificate`);
} 