import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Grid, List as ListIcon, Clock, Star, Plus,
  Image, BookOpen, FileText, ListChecks, Key, 
  PenTool, Mic, File, X
} from 'lucide-react';
import Header from './Header';
import NoteList from './NoteList';
import NoteForm from './NoteForm';

type ViewMode = 'grid' | 'list';
type SortMode = 'date' | 'type' | 'favorites';

export default function Dashboard() {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortMode, setSortMode] = useState<SortMode>('date');
  const [searchQuery, setSearchQuery] = useState('');
  const [isQuickActionOpen, setIsQuickActionOpen] = useState(false);
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleNoteAdded = () => {
    setRefreshTrigger(prev => prev + 1);
    setShowNoteForm(false);
  };

  const handleQuickAction = (type: string) => {
    switch (type) {
      case 'Note':
        setShowNoteForm(true);
        setIsQuickActionOpen(false);
        break;
      case 'Journal':
        setShowNoteForm(true);
        setIsQuickActionOpen(false);
        break;
      case 'To-do':
        setShowNoteForm(true);
        setIsQuickActionOpen(false);
        break;
      default:
        toast.info('This feature is coming soon!');
        setIsQuickActionOpen(false);
        break;
    }
  };

  const quickActions = [
    { icon: Image, label: 'Photo', color: 'bg-blue-500' },
    { icon: BookOpen, label: 'Journal', color: 'bg-purple-500' },
    { icon: FileText, label: 'Note', color: 'bg-indigo-500' },
    { icon: ListChecks, label: 'To-do', color: 'bg-green-500' },
    { icon: Key, label: 'Password', color: 'bg-yellow-500' },
    { icon: PenTool, label: 'Drawing', color: 'bg-pink-500' },
    { icon: Mic, label: 'Voice', color: 'bg-red-500' },
    { icon: File, label: 'Document', color: 'bg-orange-500' },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <div className="sticky top-16 z-10 border-b border-gray-200 bg-white/80 px-4 py-3 backdrop-blur-lg dark:border-gray-700 dark:bg-gray-800/80">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border-gray-200 pl-10 pr-4 focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700"
            />
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center rounded-lg bg-gray-100 p-1 dark:bg-gray-700">
              <button
                onClick={() => setViewMode('grid')}
                className={`rounded-md p-2 ${
                  viewMode === 'grid'
                    ? 'bg-white text-indigo-600 shadow dark:bg-gray-600 dark:text-indigo-400'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <Grid className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`rounded-md p-2 ${
                  viewMode === 'list'
                    ? 'bg-white text-indigo-600 shadow dark:bg-gray-600 dark:text-indigo-400'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <ListIcon className="h-5 w-5" />
              </button>
            </div>

            <select
              value={sortMode}
              onChange={(e) => setSortMode(e.target.value as SortMode)}
              className="rounded-lg border-gray-200 bg-gray-100 text-sm dark:border-gray-600 dark:bg-gray-700"
            >
              <option value="date">Sort by Date</option>
              <option value="type">Sort by Type</option>
              <option value="favorites">Sort by Favorites</option>
            </select>
          </div>
        </div>
      </div>

      <main className="flex-1 px-4 py-6">
        <div className="mx-auto max-w-7xl">
          {showNoteForm && <NoteForm onNoteAdded={handleNoteAdded} />}
          <NoteList refreshTrigger={refreshTrigger} viewMode={viewMode} />
        </div>
      </main>

      {/* Quick Action FAB */}
      <div className="fixed bottom-6 right-6">
        <AnimatePresence>
          {isQuickActionOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute bottom-16 right-0 grid grid-cols-2 gap-2 rounded-lg bg-white p-2 shadow-lg dark:bg-gray-800"
            >
              {quickActions.map((action) => (
                <button
                  key={action.label}
                  onClick={() => handleQuickAction(action.label)}
                  className="flex items-center space-x-2 rounded-lg p-2 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  <span className={`rounded-lg ${action.color} p-2 text-white`}>
                    <action.icon className="h-4 w-4" />
                  </span>
                  <span>{action.label}</span>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={() => setIsQuickActionOpen(!isQuickActionOpen)}
          className="rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 p-3 text-white shadow-lg transition-transform hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
        >
          {isQuickActionOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Plus className="h-6 w-6" />
          )}
        </button>
      </div>
    </div>
  );
}