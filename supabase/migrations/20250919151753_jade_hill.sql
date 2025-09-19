/*
  # Create households table

  1. New Tables
    - `households`
      - `id` (uuid, primary key)
      - `house_number` (text, unique identifier for the house)
      - `address` (text, house address)
      - `user_id` (uuid, references the user who created/manages this record)
      - `utilities` (jsonb, stores electricity, water, internet status)
      - `monthly_income` (numeric, household monthly income)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `households` table
    - Add policies for authenticated users to manage household data

  3. Indexes
    - Index on house_number for fast lookups
    - Index on user_id for user-specific queries
*/

-- Create the households table
CREATE TABLE IF NOT EXISTS public.households (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  house_number TEXT NOT NULL,
  address TEXT,
  user_id UUID NOT NULL,
  utilities JSONB DEFAULT '{"electricity": false, "water": false, "internet": false}'::jsonb,
  monthly_income NUMERIC(10,2),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(house_number, user_id)
);

-- Enable Row Level Security
ALTER TABLE public.households ENABLE ROW LEVEL SECURITY;

-- Create function for updating timestamps if it doesn't exist
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create policies for user access
DO $$ 
BEGIN
  -- Drop existing policies if they exist
  DROP POLICY IF EXISTS "Users can view households in their barangay" ON public.households;
  DROP POLICY IF EXISTS "Users can create households" ON public.households;
  DROP POLICY IF EXISTS "Users can update households they created" ON public.households;
  DROP POLICY IF EXISTS "Users can delete households they created" ON public.households;
  
  -- Create new policies
  CREATE POLICY "Users can view households in their barangay" 
  ON public.households 
  FOR SELECT 
  USING (true);

  CREATE POLICY "Users can create households" 
  ON public.households 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

  CREATE POLICY "Users can update households they created" 
  ON public.households 
  FOR UPDATE 
  USING (auth.uid() = user_id);

  CREATE POLICY "Users can delete households they created" 
  ON public.households 
  FOR DELETE 
  USING (auth.uid() = user_id);
END $$;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS update_households_updated_at ON public.households;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_households_updated_at
BEFORE UPDATE ON public.households
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_households_house_number ON public.households(house_number);
CREATE INDEX IF NOT EXISTS idx_households_user_id ON public.households(user_id);