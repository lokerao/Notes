import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';
import { Book, Lock, Mail } from 'lucide-react';

type AuthMode = 'signin' | 'signup';

const PASSWORD_MIN_LENGTH = 6;

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<AuthMode>('signin');
  const [loading, setLoading] = useState(false);

  const validatePassword = (password: string): boolean => {
    return password.length >= PASSWORD_MIN_LENGTH;
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === 'signup') {
        if (!validatePassword(password)) {
          throw new Error(`Password must be at least ${PASSWORD_MIN_LENGTH} characters long`);
        }

        const { error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) throw error;
        toast.success('Account created! You can now sign in.');
        setMode('signin');
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          if (error.message === 'Invalid login credentials') {
            throw new Error('Invalid email or password. Please try again.');
          }
          throw error;
        }
        toast.success('Signed in successfully!');
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 dark:bg-gray-900">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg transition-all dark:bg-gray-800">
        <div className="mb-6 flex flex-col items-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900">
            <Book className="h-6 w-6 text-indigo-600 dark:text-indigo-300" />
          </div>
          <h2 className="mt-4 text-center text-3xl font-bold text-gray-900 dark:text-white">
            {mode === 'signin' ? 'Welcome back' : 'Create an account'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            {mode === 'signin'
              ? 'Sign in to access your journal'
              : 'Sign up to start your journal journey'}
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email
            </label>
            <div className="relative mt-1">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full rounded-lg border-gray-300 pl-10 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Password
            </label>
            <div className="relative mt-1">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full rounded-lg border-gray-300 pl-10 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                placeholder="••••••••"
                minLength={PASSWORD_MIN_LENGTH}
              />
            </div>
            {mode === 'signup' && (
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Password must be at least {PASSWORD_MIN_LENGTH} characters long
              </p>
            )}
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative flex w-full justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-70 dark:bg-indigo-500 dark:hover:bg-indigo-600"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="mr-2 h-4 w-4 animate-spin text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </span>
              ) : mode === 'signin' ? (
                'Sign in'
              ) : (
                'Sign up'
              )}
            </button>
          </div>
        </form>

        <div className="mt-6">
          <button
            onClick={() => {
              setMode(mode === 'signin' ? 'signup' : 'signin');
              setPassword('');
            }}
            className="w-full text-center text-sm text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
          >
            {mode === 'signin' ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
          </button>
        </div>
      </div>
    </div>
  );
}