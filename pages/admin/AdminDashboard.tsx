import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { SetView, Role } from '../../types';
import { MOCK_USERS } from '../../data/users';
import { MOCK_COURSES } from '../../data/courses';
import Card from '../../components/ui/Card';

interface AdminDashboardProps {
  setView: SetView;
}

const StatCard: React.FC<{ title: string; value: number | string; icon: string }> = ({ title, value, icon }) => (
    <Card className="p-6 flex items-center">
        <div className="p-3 rounded-full bg-primary-100 dark:bg-primary-900 text-primary-500 mr-4">
            <span className="text-2xl">{icon}</span>
        </div>
        <div>
            <p className="text-sm text-secondary-500 font-medium">{title}</p>
            <p className="text-3xl font-bold">{value}</p>
        </div>
    </Card>
);

const AdminDashboard: React.FC<AdminDashboardProps> = ({ setView }) => {
  const { user } = useAuth();
  
  const totalStudents = MOCK_USERS.filter(u => u.role === Role.STUDENT).length;
  const totalTeachers = MOCK_USERS.filter(u => u.role === Role.TEACHER).length;
  const totalCourses = MOCK_COURSES.length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Administrator Dashboard</h1>
        <p className="text-secondary-500 mt-1">Oversee platform activity and manage users.</p>
      </div>
      
      {/* Stats */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Students" value={totalStudents} icon="👩‍🎓" />
        <StatCard title="Total Teachers" value={totalTeachers} icon="👨‍🏫" />
        <StatCard title="Total Courses" value={totalCourses} icon="📚" />
        <StatCard title="Platform Health" value="Healthy" icon="✅" />
      </section>

      {/* Quick Actions */}
      <section>
          <h2 className="text-2xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card onClick={() => setView({type: 'user-management'})} className="p-6 text-center">
                <p className="text-5xl mb-2">👥</p>
                <h3 className="text-lg font-bold">Manage Users</h3>
            </Card>
            <Card onClick={() => setView({type: 'course-management'})} className="p-6 text-center">
                <p className="text-5xl mb-2">📖</p>
                <h3 className="text-lg font-bold">Manage Classes</h3>
            </Card>
             <Card className="p-6 text-center cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all">
                <p className="text-5xl mb-2">📢</p>
                <h3 className="text-lg font-bold">Send Announcement</h3>
            </Card>
          </div>
      </section>
    </div>
  );
};

export default AdminDashboard;