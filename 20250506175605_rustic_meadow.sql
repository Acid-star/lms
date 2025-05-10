/*
  # Remove security policies from profiles table

  1. Changes
    - Drop all RLS policies from the profiles table
    - Disable RLS on the profiles table
*/

-- Drop all existing policies
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;

-- Disable RLS
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;