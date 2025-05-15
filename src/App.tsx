import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Toaster } from 'react-hot-toast';
import Auth from './components/Auth';
import Header from './components/Header';
import NoteForm from './components/NoteForm';
import NoteList from './components/NoteList';

function Dashboard() {
  const { user, loading } = useAuth();
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleNoteAdded = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center">
          <svg className="h-12 w-12 animate-spin text-indigo-600" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Auth />;
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="flex-1 py-6">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <NoteForm onNoteAdded={handleNoteAdded} />
          <NoteList refreshTrigger={refreshTrigger} />
        </div>
      </main>
      <footer className="border-t border-gray-200 py-4 text-center text-sm text-gray-500 dark:border-gray-800 dark:text-gray-400">
        © {new Date().getFullYear()} Journal.io — Your digital journal companion
      </footer>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Dashboard />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              iconTheme: {
                primary: '#10B981',
                secondary: 'white',
              },
            },
            error: {
              iconTheme: {
                primary: '#EF4444',
                secondary: 'white',
              },
            },
          }}
        />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;