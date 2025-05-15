/*
  # Create notes table and setup security

  1. New Tables
    - `notes`
      - `id` (uuid, primary key)
      - `created_at` (timestamp)
      - `content` (text)
      - `user_id` (uuid, foreign key to auth.users)
      - `title` (text)
  2. Security
    - Enable RLS on `notes` table
    - Add policies for authenticated users to:
      - Select their own notes
      - Insert their own notes
      - Update their own notes
      - Delete their own notes
*/

CREATE TABLE IF NOT EXISTS notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  content text NOT NULL,
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  title text NOT NULL
);

ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- Policies to ensure users can only access their own notes
CREATE POLICY "Users can view their own notes"
  ON notes
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own notes"
  ON notes
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own notes"
  ON notes
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notes"
  ON notes
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create index for performance
CREATE INDEX IF NOT EXISTS notes_user_id_idx ON notes (user_id);
CREATE INDEX IF NOT EXISTS notes_created_at_idx ON notes (created_at DESC);