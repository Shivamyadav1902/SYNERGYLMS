
import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/ui/Button';
import { Role } from '../types';
import { SynergyLogo, EyeIcon, EyeOffIcon } from '../components/icons';

interface RegisterPageProps {
  onSwitchToLogin: () => void;
}

const RegisterPage: React.FC<RegisterPageProps> = ({ onSwitchToLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<Role>(Role.STUDENT);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const success = await register(name, email, password, role);
      if (!success) {
        setError('An account with this email already exists.');
      }
      // On success, the user is logged in automatically by the auth context
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary-50 dark:bg-secondary-900 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-secondary-800 shadow-2xl rounded-2xl p-8 md:p-12">
          <div className="flex justify-center items-center mb-4">
            <SynergyLogo className="h-12 w-12 text-primary-500" />
            <h1 className="text-3xl font-bold text-primary-600 dark:text-primary-400 ml-3">
              Create Account
            </h1>
          </div>
          <p className="text-center text-secondary-500 dark:text-secondary-400 mb-8">Join Synergy LMS today!</p>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg bg-transparent focus:ring-primary-500 focus:border-primary-500"
                placeholder="Alex Johnson"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg bg-transparent focus:ring-primary-500 focus:border-primary-500"
                placeholder="alex.j@school.edu"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 pr-10 border border-secondary-300 dark:border-secondary-600 rounded-lg bg-transparent focus:ring-primary-500 focus:border-primary-500"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 px-3 flex items-center text-secondary-500 hover:text-primary-500"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                </button>
              </div>
            </div>
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                I am a...
              </label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value as Role)}
                className="w-full px-4 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg bg-transparent focus:ring-primary-500 focus:border-primary-500"
              >
                <option value={Role.STUDENT}>Student</option>
                <option value={Role.TEACHER}>Teacher</option>
              </select>
            </div>
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
              {isLoading ? 'Creating Account...' : 'Sign Up'}
            </Button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-sm text-secondary-500 dark:text-secondary-400">
              Already have an account?{' '}
              <button 
                onClick={onSwitchToLogin} 
                className="font-medium text-primary-600 hover:underline dark:text-primary-400 bg-transparent border-none cursor-pointer p-0"
               >
                Sign In
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
