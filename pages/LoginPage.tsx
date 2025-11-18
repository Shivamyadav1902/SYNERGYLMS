
import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/ui/Button';
import { SynergyLogo, EyeIcon, EyeOffIcon, InfoIcon } from '../components/icons';

interface LoginPageProps {
  onSwitchToRegister: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onSwitchToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const success = await login(email, password);
      if (!success) {
        setError('Invalid email or password. Please check your credentials and try again.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary-50 dark:bg-secondary-950 p-4 transition-colors duration-300">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-secondary-900 shadow-2xl rounded-2xl p-8 md:p-12 border border-secondary-200 dark:border-secondary-800">
          <div className="flex justify-center items-center mb-4">
            <SynergyLogo className="h-12 w-12 text-primary-500" />
            <h1 className="text-3xl font-bold text-primary-600 dark:text-primary-400 ml-3">
              Synergy LMS
            </h1>
          </div>
          <p className="text-center text-secondary-500 dark:text-secondary-400 mb-8">Welcome back! Students, teachers, and admins can sign in here.</p>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="login-email" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="login-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-secondary-300 dark:border-secondary-700 rounded-lg bg-secondary-50 dark:bg-secondary-800 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-shadow duration-200"
                placeholder="e.g., alex.j@school.edu"
                required
                aria-invalid={!!error}
                aria-describedby="error-message"
              />
            </div>
            
            <div>
              <label htmlFor="login-password" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="login-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 pr-10 border border-secondary-300 dark:border-secondary-700 rounded-lg bg-secondary-50 dark:bg-secondary-800 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-shadow duration-200"
                  placeholder="Enter your password"
                  required
                  aria-invalid={!!error}
                  aria-describedby="error-message"
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
            
            {error && (
              <p id="error-message" className="text-red-500 text-sm text-center" aria-live="polite">
                {error}
              </p>
            )}

            <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-secondary-500 dark:text-secondary-400">
              Don't have an account?{' '}
              <button
                onClick={onSwitchToRegister}
                className="font-medium text-primary-600 hover:underline dark:text-primary-400 bg-transparent border-none cursor-pointer p-0"
              >
                Sign up
              </button>
            </p>
          </div>
        </div>

        <div className="mt-6 text-sm text-secondary-500 dark:text-secondary-400 bg-primary-50 dark:bg-secondary-800/50 p-4 rounded-lg border border-primary-100 dark:border-secondary-700">
          <div className="flex items-center justify-center mb-3">
            <InfoIcon className="h-5 w-5 text-primary-500 mr-2"/>
            <p className="font-semibold text-primary-700 dark:text-primary-300">Demo Accounts &amp; Email Formats</p>
          </div>
          <div className="text-xs space-y-2 text-left">
            <div className="grid grid-cols-3 gap-1 items-start">
                <strong className="col-span-1 pt-0.5">Student:</strong>
                <div className="col-span-2 space-y-1">
                    <p>Format: <span className="font-mono bg-secondary-200 dark:bg-secondary-700 px-1 py-0.5 rounded">firstname.initial@school.edu</span></p>
                    <p>Example: <span className="font-mono bg-secondary-200 dark:bg-secondary-700 px-1 py-0.5 rounded">alex.j@school.edu</span></p>
                </div>
            </div>
            <div className="grid grid-cols-3 gap-1 items-start">
                <strong className="col-span-1 pt-0.5">Teacher:</strong>
                <div className="col-span-2 space-y-1">
                    <p>Format: <span className="font-mono bg-secondary-200 dark:bg-secondary-700 px-1 py-0.5 rounded">initial.lastname@school.edu</span></p>
                    <p>Example: <span className="font-mono bg-secondary-200 dark:bg-secondary-700 px-1 py-0.5 rounded">e.reed@school.edu</span></p>
                </div>
            </div>
            <div className="grid grid-cols-3 gap-1 items-start">
                <strong className="col-span-1 pt-0.5">Admin:</strong>
                <div className="col-span-2 space-y-1">
                    <p>Example: <span className="font-mono bg-secondary-200 dark:bg-secondary-700 px-1 py-0.5 rounded">admin@school.edu</span></p>
                </div>
            </div>
            <div className="pt-2 mt-2 border-t border-primary-100 dark:border-secondary-700 grid grid-cols-3 gap-1 items-start">
                <strong className="col-span-1 pt-0.5">Password:</strong>
                <div className="col-span-2 space-y-1">
                    <p>For all accounts: <span className="font-mono bg-secondary-200 dark:bg-secondary-700 px-1 py-0.5 rounded">password123</span></p>
                </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;
