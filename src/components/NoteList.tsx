import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { Note } from '../types/database.types';
import NoteCard from './NoteCard';
import { toast } from 'react-hot-toast';
import { Book } from 'lucide-react';

interface NoteListProps {
  refreshTrigger: number;
  viewMode: 'grid' | 'list';
}

export default function NoteList({ refreshTrigger, viewMode }: NoteListProps) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const fetchNotes = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('notes')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setNotes(data || []);
      } catch (error) {
        if (error instanceof Error) {
          toast.error(`Error fetching notes: ${error.message}`);
        } else {
          toast.error('Failed to fetch notes');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();

    const subscription = supabase
      .channel('notes_channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notes',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          fetchNotes();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [user, refreshTrigger]);

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from('notes').delete().eq('id', id);
      if (error) throw error;
      toast.success('Note deleted successfully');
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Failed to delete note');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <div className="flex flex-col items-center">
          <svg className="h-8 w-8 animate-spin text-indigo-500" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Loading your notes...</p>
        </div>
      </div>
    );
  }

  if (notes.length === 0) {
    return (
      <div className="flex h-40 flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-8 text-center dark:border-gray-700 dark:bg-gray-800/50">
        <Book className="mb-2 h-10 w-10 text-gray-400" />
        <h3 className="mb-1 text-lg font-medium text-gray-900 dark:text-white">No notes yet</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">Start creating your first note!</p>
      </div>
    );
  }

  return (
    <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
      {notes.map((note) => (
        <NoteCard key={note.id} note={note} onDelete={handleDelete} />
      ))}
    </div>
  );
}