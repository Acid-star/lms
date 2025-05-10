/*
  # Add name and course columns to profiles table

  1. Changes
    - Add name column with default empty string
    - Add course column with default empty string
    - Make both columns required after setting defaults

  2. Security
    - No changes to RLS policies needed
*/

-- First add columns with defaults
ALTER TABLE profiles 
ADD COLUMN name text DEFAULT '',
ADD COLUMN course text DEFAULT '';

-- Then make them required
ALTER TABLE profiles 
ALTER COLUMN name SET NOT NULL,
ALTER COLUMN course SET NOT NULL;