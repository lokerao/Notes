import React from 'react';
import { format } from 'date-fns';
import { Note } from '../types/database.types';
import { Calendar, Clock, Trash2, Edit2 } from 'lucide-react';

interface NoteCardProps {
  note: Note;
  onDelete: (id: string) => void;
}

export default function NoteCard({ note, onDelete }: NoteCardProps) {
  const formattedDate = format(new Date(note.created_at), 'PPP');
  const formattedTime = format(new Date(note.created_at), 'p');
  
  return (
    <div className="group mb-4 overflow-hidden rounded-lg bg-gradient-to-br from-white to-gray-50 shadow-md transition-all hover:shadow-lg hover:shadow-indigo-100 dark:from-gray-800 dark:to-gray-900 dark:hover:shadow-indigo-900/20">
      <div className="border-b border-gray-200 bg-gradient-to-r from-indigo-50/50 to-purple-50/50 p-4 dark:border-gray-700 dark:from-indigo-900/20 dark:to-purple-900/20">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{note.title}</h3>
          <div className="flex items-center space-x-2 opacity-0 transition-opacity group-hover:opacity-100">
            <button
              className="rounded-full p-1.5 text-gray-400 transition-colors hover:bg-indigo-100 hover:text-indigo-600 dark:hover:bg-indigo-900/30 dark:hover:text-indigo-400"
              aria-label="Edit note"
            >
              <Edit2 className="h-4 w-4" />
            </button>
            <button
              onClick={() => onDelete(note.id)}
              className="rounded-full p-1.5 text-gray-400 transition-colors hover:bg-red-100 hover:text-red-500 dark:hover:bg-red-900/30"
              aria-label="Delete note"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center">
            <Calendar className="mr-1 h-4 w-4" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center">
            <Clock className="mr-1 h-4 w-4" />
            <span>{formattedTime}</span>
          </div>
        </div>
      </div>
      <div className="p-4">
        <p className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">{note.content}</p>
      </div>
    </div>
  );
}