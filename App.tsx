
import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { View, Role } from './types';

// Pages
import DashboardLayout from './components/layout/DashboardLayout';
import StudentDashboard from './pages/student/StudentDashboard';
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import CoursePage from './pages/CoursePage';
import AssignmentsPage from './pages/AssignmentsPage';
import GradebookPage from './pages/GradebookPage';
import AdminUserManagement from './pages/admin/AdminUserManagement';
import AdminCourseManagement from './pages/admin/AdminCourseManagement';
import TeacherAssignmentsPage from './pages/teacher/TeacherAssignmentsPage';
import AITutor from './pages/AITutor';
import FeesPage from './pages/FeesPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';

const AppContent: React.FC = () => {
  const { user } = useAuth();
  const [view, setView] = useState<View>({ type: 'dashboard' });
  const [isRegistering, setIsRegistering] = useState(false);

  if (!user) {
    return isRegistering ? (
      <RegisterPage onSwitchToLogin={() => setIsRegistering(false)} />
    ) : (
      <LoginPage onSwitchToRegister={() => setIsRegistering(true)} />
    );
  }

  const renderView = () => {
    switch (view.type) {
      case 'dashboard':
        if (user.role === Role.STUDENT) return <StudentDashboard setView={setView} />;
        if (user.role === Role.TEACHER) return <TeacherDashboard setView={setView} />;
        if (user.role === Role.ADMIN) return <AdminDashboard setView={setView} />;
        return null;
      case 'profile':
        return <ProfilePage setView={setView} />;
      case 'course':
        return <CoursePage courseId={view.id} setView={setView} />;
      case 'assignments':
        return <AssignmentsPage setView={setView} />;
       case 'gradebook':
        return <GradebookPage courseId={view.courseId} setView={setView} />;
      case 'user-management':
        return <AdminUserManagement setView={setView} />;
      case 'course-management':
        return <AdminCourseManagement setView={setView} />;
      case 'manage-assignments':
        return <TeacherAssignmentsPage courseId={view.courseId} setView={setView} />;
      case 'ai-tutor':
        return <AITutor setView={setView} />;
      case 'fees':
        return <FeesPage setView={setView} />;
      default:
        // Default to dashboard if view is unknown
        if (user.role === Role.STUDENT) return <StudentDashboard setView={setView} />;
        if (user.role === Role.TEACHER) return <TeacherDashboard setView={setView} />;
        if (user.role === Role.ADMIN) return <AdminDashboard setView={setView} />;
        return null;
    }
  };

  return (
      <DashboardLayout setView={setView} currentView={view}>
        {renderView()}
      </DashboardLayout>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
