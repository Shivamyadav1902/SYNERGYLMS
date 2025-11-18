import React, { useState, ReactNode } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { SetView, Role, View, User } from '../../types';
import { SynergyLogo, BookOpenIcon, MenuIcon, XIcon, SunIcon, MoonIcon, LogOutIcon, BotIcon, DollarSignIcon, PencilIcon, UserIcon } from '../icons';
import Avatar from '../ui/Avatar';

interface DashboardLayoutProps {
  children: ReactNode;
  setView: SetView;
  currentView: View;
}

const NavLink: React.FC<{
  setView: SetView;
  view: View;
  currentView: View;
  icon: ReactNode;
  text: string;
  onClick?: () => void;
}> = ({ setView, view, currentView, icon, text, onClick }) => {
  // Simple comparison for now. A more robust solution would handle view parameters.
  const isActive = currentView.type === view.type;
  
  const handleClick = () => {
    setView(view);
    if (onClick) onClick();
  }

  return (
    <button
      onClick={handleClick}
      className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
        isActive
          ? 'bg-primary-500 text-white'
          : 'text-secondary-600 dark:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-700'
      }`}
    >
      <span className="mr-3">{icon}</span>
      {text}
    </button>
  );
};

const Sidebar: React.FC<{ setView: SetView; currentView: View, onLinkClick: () => void, user: User }> = ({ setView, currentView, onLinkClick, user }) => {
  
  const commonLinks = [
    <NavLink key="dash" setView={setView} view={{ type: 'dashboard' }} currentView={currentView} icon={<BookOpenIcon className="h-5 w-5" />} text="Dashboard" onClick={onLinkClick} />,
    <NavLink key="profile" setView={setView} view={{ type: 'profile' }} currentView={currentView} icon={<UserIcon className="h-5 w-5" />} text="Profile" onClick={onLinkClick} />,
  ];

  const studentLinks = [
    <NavLink key="assignments" setView={setView} view={{ type: 'assignments' }} currentView={currentView} icon={<PencilIcon className="h-5 w-5" />} text="Assignments" onClick={onLinkClick} />,
    <NavLink key="grades" setView={setView} view={{ type: 'gradebook' }} currentView={currentView} icon={<BookOpenIcon className="h-5 w-5" />} text="Gradebook" onClick={onLinkClick} />,
    <NavLink key="fees" setView={setView} view={{ type: 'fees' }} currentView={currentView} icon={<DollarSignIcon className="h-5 w-5" />} text="Fees" onClick={onLinkClick} />,
    <NavLink key="tutor" setView={setView} view={{ type: 'ai-tutor' }} currentView={currentView} icon={<BotIcon className="h-5 w-5" />} text="AI Tutor" onClick={onLinkClick} />,
  ];

  const teacherLinks = [
      <NavLink key="grades" setView={setView} view={{ type: 'gradebook' }} currentView={currentView} icon={<BookOpenIcon className="h-5 w-5" />} text="Gradebook" onClick={onLinkClick} />,
  ];

  const adminLinks = [
    <NavLink key="users" setView={setView} view={{ type: 'user-management' }} currentView={currentView} icon={<BookOpenIcon className="h-5 w-5" />} text="Users" onClick={onLinkClick} />,
    <NavLink key="courses" setView={setView} view={{ type: 'course-management' }} currentView={currentView} icon={<BookOpenIcon className="h-5 w-5" />} text="Classes" onClick={onLinkClick} />,
  ];

  let links = commonLinks;
  if (user?.role === Role.STUDENT) links = [...commonLinks, ...studentLinks];
  if (user?.role === Role.TEACHER) links = [...commonLinks, ...teacherLinks];
  if (user?.role === Role.ADMIN) links = [...commonLinks, ...adminLinks];

  return (
    <nav className="flex flex-col p-4 space-y-2">
        {links}
    </nav>
  );
};


const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, setView, currentView }) => {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    if (!user) return null;

    return (
        <div className="flex h-screen bg-secondary-100 dark:bg-secondary-900 text-secondary-900 dark:text-secondary-100">
            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-30 w-64 bg-white dark:bg-secondary-800 shadow-lg transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 lg:shadow-none`}>
                <div className="flex items-center justify-between p-4 border-b border-secondary-200 dark:border-secondary-700">
                    <div className="flex items-center">
                        <SynergyLogo className="h-8 w-8 text-primary-500" />
                        <span className="ml-3 text-xl font-bold text-primary-600 dark:text-primary-400">Synergy LMS</span>
                    </div>
                     <button className="lg:hidden" onClick={() => setSidebarOpen(false)}>
                        <XIcon className="h-6 w-6" />
                    </button>
                </div>
                <Sidebar setView={setView} currentView={currentView} onLinkClick={() => setSidebarOpen(false)} user={user} />
            </aside>

             {isSidebarOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden" onClick={() => setSidebarOpen(false)}></div>}

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="flex-shrink-0 bg-white dark:bg-secondary-800 shadow-sm">
                    <div className="flex items-center justify-between p-4">
                        <button className="lg:hidden" onClick={() => setSidebarOpen(true)}>
                            <MenuIcon className="h-6 w-6" />
                        </button>
                        <div className="flex-1"></div> {/* Spacer */}
                        <div className="flex items-center space-x-4">
                            <button onClick={toggleTheme}>
                                {theme === 'light' ? <MoonIcon className="h-6 w-6" /> : <SunIcon className="h-6 w-6" />}
                            </button>
                            <button onClick={logout} className="flex items-center text-sm font-medium">
                                <LogOutIcon className="h-5 w-5 mr-1" />
                                Logout
                            </button>
                             <button onClick={() => setView({type: 'profile'})} className="flex items-center p-1 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-700 transition-colors">
                                <Avatar src={user.avatar} alt={user.name} size="sm" />
                                <div className="ml-3 text-left hidden md:block">
                                    <p className="font-semibold text-sm">{user.name}</p>
                                    <p className="text-xs text-secondary-500">{user.role}</p>
                                </div>
                             </button>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-6 md:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;