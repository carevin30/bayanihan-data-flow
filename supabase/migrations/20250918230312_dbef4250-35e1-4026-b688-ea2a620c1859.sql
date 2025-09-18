-- Create residents table
CREATE TABLE public.residents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  middle_name TEXT,
  age INTEGER NOT NULL,
  gender TEXT NOT NULL CHECK (gender IN ('Male', 'Female')),
  civil_status TEXT NOT NULL CHECK (civil_status IN ('Single', 'Married', 'Widow', 'Widower', 'Separated')),
  address TEXT NOT NULL,
  house_number TEXT,
  contact TEXT,
  occupation TEXT,
  status TEXT[] DEFAULT '{}',
  date_registered TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.residents ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view residents in their barangay" 
ON public.residents 
FOR SELECT 
USING (true); -- For now, allow all authenticated users to see residents

CREATE POLICY "Users can create residents" 
ON public.residents 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update residents they created" 
ON public.residents 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete residents they created" 
ON public.residents 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_residents_updated_at
BEFORE UPDATE ON public.residents
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for better performance
CREATE INDEX idx_residents_user_id ON public.residents(user_id);
CREATE INDEX idx_residents_name ON public.residents(last_name, first_name);
CREATE INDEX idx_residents_status ON public.residents USING GIN(status);