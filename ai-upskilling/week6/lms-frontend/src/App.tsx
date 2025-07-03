import React, { ReactNode } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from 'react-router-dom';
import { AuthProvider, useAuth } from './features/auth/AuthContext';
import LoginPage from './features/auth/LoginPage';
import RegisterPage from './features/auth/RegisterPage';
import { CssBaseline } from '@mui/material';
import CourseListPage from './features/courses/CourseListPage';
import CourseDetailPage from './features/courses/CourseDetailPage';
import CourseCreatePage from './features/courses/CourseCreatePage';
import EnrollmentListPage from './features/enrollment/EnrollmentListPage';
import AssessmentListPage from './features/assessment/AssessmentListPage';
import AssessmentDetailPage from './features/assessment/AssessmentDetailPage';
import NotificationListPage from './features/notification/NotificationListPage';
import ChatPage from './features/notification/ChatPage';
import UserProfilePage from './features/auth/UserProfilePage';
import Navigation from './components/Navigation';
import DashboardPage from './DashboardPage';
import AssessmentCreatePage from './features/assessment/AssessmentCreatePage';
import LiveQuizPage from './features/assessment/LiveQuizPage';

function RequireAuth({ children }: { children: ReactNode }) {
  const { token } = useAuth();
  return token ? <>{children}</> : <Navigate to="/login" />;
}

function CourseAssessmentsRoute() {
  const { id } = useParams<{ id: string }>();
  return <AssessmentListPage courseId={id ? Number(id) : undefined} />;
}

function App() {
  return (
    <AuthProvider>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/" element={<RequireAuth><Navigation /><DashboardPage /></RequireAuth>} />
          <Route path="/courses" element={<RequireAuth><Navigation /><CourseListPage /></RequireAuth>} />
          <Route path="/courses/create" element={<RequireAuth><Navigation /><CourseCreatePage /></RequireAuth>} />
          <Route path="/courses/:id" element={<RequireAuth><Navigation /><CourseDetailPage /></RequireAuth>} />
          <Route path="/enrollments" element={<RequireAuth><Navigation /><EnrollmentListPage /></RequireAuth>} />
          <Route path="/assessments" element={<RequireAuth><Navigation /><AssessmentListPage /></RequireAuth>} />
          <Route path="/assessments/:id" element={<RequireAuth><Navigation /><AssessmentDetailPage /></RequireAuth>} />
          <Route path="/notifications" element={<RequireAuth><Navigation /><NotificationListPage /></RequireAuth>} />
          <Route path="/chat" element={<RequireAuth><Navigation /><ChatPage /></RequireAuth>} />
          <Route path="/profile" element={<RequireAuth><Navigation /><UserProfilePage /></RequireAuth>} />
          <Route path="/courses/:id/assessments" element={<RequireAuth><Navigation /><CourseAssessmentsRoute /></RequireAuth>} />
          <Route path="/assessments/create" element={<RequireAuth><Navigation /><AssessmentCreatePage /></RequireAuth>} />
          <Route path="/live-quiz/:id" element={<RequireAuth><Navigation /><LiveQuizPage /></RequireAuth>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
