import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { PenLine, Save } from 'lucide-react';

interface NoteFormProps {
  onNoteAdded: () => void;
}

export default function NoteForm({ onNoteAdded }: NoteFormProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('You must be logged in to create a note');
      return;
    }

    if (!title.trim() || !content.trim()) {
      toast.error('Please provide both a title and content for your note');
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from('notes').insert([
        {
          title,
          content,
          user_id: user.id,
        },
      ]);

      if (error) throw error;

      toast.success('Note added successfully!');
      setTitle('');
      setContent('');
      onNoteAdded();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Failed to add note');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8 w-full rounded-lg bg-white p-5 shadow-md transition-all dark:bg-gray-800">
      <div className="mb-4 flex items-center">
        <PenLine className="mr-2 h-5 w-5 text-indigo-500" />
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Create a new note</h2>
      </div>
      
      <div className="mb-4">
        <label htmlFor="title" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Title
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter note title"
          className="w-full rounded-lg border border-gray-300 p-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          required
        />
      </div>
      
      <div className="mb-4">
        <label htmlFor="content" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Content
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind?"
          rows={5}
          className="w-full rounded-lg border border-gray-300 p-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          required
        />
      </div>
      
      <button
        type="submit"
        disabled={isSubmitting}
        className="flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-70 dark:bg-indigo-500 dark:hover:bg-indigo-600"
      >
        {isSubmitting ? (
          <>
            <svg className="mr-2 h-4 w-4 animate-spin text-white" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Saving...
          </>
        ) : (
          <>
            <Save className="mr-2 h-4 w-4" /> Save Note
          </>
        )}
      </button>
    </form>
  );
}