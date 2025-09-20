-- Create households table
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

-- Create policies for user access
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

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_households_updated_at
BEFORE UPDATE ON public.households
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_households_house_number ON public.households(house_number);
CREATE INDEX IF NOT EXISTS idx_households_user_id ON public.households(user_id);