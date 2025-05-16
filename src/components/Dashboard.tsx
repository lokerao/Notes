import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { 
  Search, Grid, List as ListIcon, Plus,
  FileText, X
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

  const handleQuickAction = () => {
    setShowNoteForm(true);
    setIsQuickActionOpen(false);
  };

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

      <div className="fixed bottom-6 right-6">
        <AnimatePresence>
          {isQuickActionOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-16 right-0 overflow-hidden rounded-lg bg-white shadow-xl dark:bg-gray-800"
            >
              <button
                onClick={handleQuickAction}
                className="flex w-full items-center space-x-3 px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500 text-white">
                  <FileText className="h-4 w-4" />
                </span>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">New Note</span>
              </button>
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