import React from 'react';
import { format } from 'date-fns';
import { Note } from '../types/database.types';
import { Calendar, Trash2 } from 'lucide-react';

interface NoteCardProps {
  note: Note;
  onDelete: (id: string) => void;
}

export default function NoteCard({ note, onDelete }: NoteCardProps) {
  const formattedDate = format(new Date(note.created_at), 'PPP');
  
  return (
    <div className="group mb-4 overflow-hidden rounded-lg bg-white shadow-md transition-all hover:shadow-lg dark:bg-gray-800">
      <div className="border-b border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/50">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{note.title}</h3>
          <button
            onClick={() => onDelete(note.id)}
            className="rounded-full p-1 text-gray-400 opacity-0 transition-opacity hover:bg-red-100 hover:text-red-500 group-hover:opacity-100 dark:hover:bg-red-900/30"
            aria-label="Delete note"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
        <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
          <Calendar className="mr-1 h-4 w-4" />
          <span>{formattedDate}</span>
        </div>
      </div>
      <div className="p-4">
        <p className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">{note.content}</p>
      </div>
    </div>
  );
}