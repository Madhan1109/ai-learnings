import { api } from '../../api';

export interface Quiz {
  id?: number;
  courseId: number;
  title: string;
  questions?: Question[];
}

export interface Question {
  id?: number;
  quizId: number;
  text: string;
  options: string[];
  answer: string;
}

export async function getQuizzes(courseId: number) {
  return api.get(`/api/assessments/quizzes?courseId=${courseId}`);
}

export async function getQuiz(id: number) {
  return api.get(`/api/assessments/quizzes/${id}`);
}

export async function createQuiz(data: Quiz) {
  return api.post('/api/assessments/quizzes', data);
}

export async function submitQuiz(quizId: number, answers: Record<number, string>) {
  return api.post(`/api/assessments/quizzes/${quizId}/submit`, { answers });
}

// WebSocket for live quiz (to be implemented in a separate hook/component) 