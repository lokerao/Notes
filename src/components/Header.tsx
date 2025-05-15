import React from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';
import { BookText, LogOut, Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function Header() {
  const { user } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success('Signed out successfully');
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`Error signing out: ${error.message}`);
      } else {
        toast.error('An error occurred while signing out');
      }
    }
  };

  return (
    <header className="sticky top-0 z-10 border-b border-gray-200 bg-white bg-opacity-80 backdrop-blur-sm backdrop-filter dark:border-gray-700 dark:bg-gray-900 dark:bg-opacity-80">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
        <div className="flex items-center space-x-2">
          <BookText className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Journal.io</h1>
        </div>
        
        {user && (
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="rounded-full p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
              aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            <div className="hidden items-center space-x-2 sm:flex">
              <div className="h-8 w-8 rounded-full bg-indigo-100 text-center leading-8 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300">
                {user.email?.charAt(0).toUpperCase() || 'U'}
              </div>
              <span className="hidden text-sm text-gray-700 dark:text-gray-300 md:inline-block">
                {user.email}
              </span>
            </div>

            <button
              onClick={handleSignOut}
              className="flex items-center rounded-lg bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
            >
              <LogOut className="mr-1 h-4 w-4" />
              <span>Sign Out</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}