import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { PenLine, Save, Image, List, Type, Link } from 'lucide-react';

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
    <form onSubmit={handleSubmit} className="mb-8 w-full overflow-hidden rounded-lg bg-gradient-to-br from-white to-gray-50 p-5 shadow-md transition-all hover:shadow-lg hover:shadow-indigo-100 dark:from-gray-800 dark:to-gray-900 dark:hover:shadow-indigo-900/20">
      <div className="mb-4 flex items-center">
        <PenLine className="mr-2 h-5 w-5 text-indigo-500" />
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Create a new note</h2>
      </div>
      
      <div className="mb-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Note title"
          className="w-full border-0 bg-transparent p-2 text-lg font-medium text-gray-900 placeholder-gray-400 focus:outline-none dark:text-white dark:placeholder-gray-500"
          required
        />
      </div>
      
      <div className="mb-4">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Start typing your note..."
          rows={5}
          className="w-full border-0 bg-transparent p-2 text-gray-700 placeholder-gray-400 focus:outline-none dark:text-gray-300 dark:placeholder-gray-500"
          required
        />
      </div>

      <div className="flex items-center justify-between border-t border-gray-200 pt-4 dark:border-gray-700">
        <div className="flex space-x-2">
          <button
            type="button"
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
            title="Add image"
          >
            <Image className="h-5 w-5" />
          </button>
          <button
            type="button"
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
            title="Add list"
          >
            <List className="h-5 w-5" />
          </button>
          <button
            type="button"
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
            title="Format text"
          >
            <Type className="h-5 w-5" />
          </button>
          <button
            type="button"
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
            title="Add link"
          >
            <Link className="h-5 w-5" />
          </button>
        </div>
        
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center justify-center rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 px-4 py-2 text-sm font-medium text-white transition-all hover:from-indigo-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-70 dark:focus:ring-offset-gray-900"
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
      </div>
    </form>
  );
}