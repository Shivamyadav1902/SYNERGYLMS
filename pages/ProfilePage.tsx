import React, { useRef, ChangeEvent } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import { SetView, Role } from '../types';
import Card from '../components/ui/Card';
import Avatar from '../components/ui/Avatar';
import Button from '../components/ui/Button';
import { ChevronLeftIcon, MailIcon, ShieldIcon, HashIcon, SunIcon, MoonIcon, PencilIcon, GraduationCapIcon } from '../components/icons';

interface ProfilePageProps {
  setView: SetView;
}

const ProfileInfoRow: React.FC<{ icon: React.ReactNode; label: string; value: string }> = ({ icon, label, value }) => (
    <div className="flex items-center py-3">
        <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center text-primary-500">{icon}</div>
        <div className="ml-4">
            <p className="text-sm font-medium text-secondary-500">{label}</p>
            <p className="text-md font-semibold text-secondary-800 dark:text-secondary-200">{value}</p>
        </div>
    </div>
);


const ProfilePage: React.FC<ProfilePageProps> = ({ setView }) => {
  const { user, updateAvatar } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!user) {
    // Should not happen if this page is rendered, but good for type safety
    return null;
  }
  
  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result;
        if (typeof result === 'string') {
          updateAvatar(result);
        }
      };
      reader.readAsDataURL(file);
    }
  };


  return (
    <div className="space-y-6">
      <button onClick={() => setView({ type: 'dashboard' })} className="flex items-center text-sm font-medium text-primary-600 dark:text-primary-400 hover:underline">
        <ChevronLeftIcon className="h-4 w-4 mr-1"/>
        Back to Dashboard
      </button>

      <h1 className="text-3xl font-bold">My Profile</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Details Card */}
        <div className="lg:col-span-1">
             <Card className="p-6 text-center">
                <div className="relative w-24 h-24 mx-auto">
                    <Avatar src={user.avatar} alt={user.name} size="lg" />
                    <button onClick={handleAvatarClick} className="absolute bottom-0 right-0 bg-primary-500 text-white rounded-full p-2 hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500" aria-label="Change profile picture">
                        <PencilIcon className="h-4 w-4" />
                    </button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      className="hidden"
                      accept="image/png, image/jpeg, image/gif"
                    />
                </div>
                <h2 className="mt-4 text-2xl font-bold">{user.name}</h2>
                <p className="text-secondary-500">{user.email}</p>
            </Card>
        </div>

        {/* Info & Settings Card */}
        <div className="lg:col-span-2">
            <Card>
                <div className="p-6">
                    <h3 className="text-xl font-bold mb-4">Account Information</h3>
                     <div className="divide-y divide-secondary-200 dark:divide-secondary-700">
                        <ProfileInfoRow icon={<MailIcon />} label="Email Address" value={user.email} />
                        <ProfileInfoRow icon={<ShieldIcon />} label="Role" value={user.role} />
                        <ProfileInfoRow icon={<HashIcon />} label="School ID" value={user.schoolId} />
                        {user.role === Role.STUDENT && user.gradeLevel && (
                          <ProfileInfoRow icon={<GraduationCapIcon />} label="Grade Level" value={user.gradeLevel.toString()} />
                        )}
                     </div>
                </div>
                 <div className="p-6 border-t border-secondary-200 dark:border-secondary-700">
                    <h3 className="text-xl font-bold mb-4">Settings</h3>
                    <div className="space-y-4">
                         <div className="flex items-center justify-between">
                            <div>
                                <p className="font-semibold">Change Password</p>
                                <p className="text-sm text-secondary-500">It's a good idea to use a strong password that you're not using elsewhere.</p>
                            </div>
                            <Button variant="secondary">Change</Button>
                        </div>
                         <div className="flex items-center justify-between">
                             <div>
                                <p className="font-semibold">Theme</p>
                                <p className="text-sm text-secondary-500">Current theme: {theme === 'light' ? 'Light' : 'Dark'}</p>
                            </div>
                            <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-secondary-100 dark:hover:bg-secondary-700 transition-colors flex items-center gap-2" aria-label={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} theme`}>
                                {theme === 'light' ? <MoonIcon className="h-6 w-6" /> : <SunIcon className="h-6 w-6" />}
                                <span className="font-semibold">Switch to {theme === 'light' ? 'Dark' : 'Light'}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;