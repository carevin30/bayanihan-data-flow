-- Create officials table
CREATE TABLE public.officials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  position TEXT NOT NULL,
  term TEXT NOT NULL,
  contact TEXT,
  email TEXT,
  status TEXT DEFAULT 'off_duty' CHECK (status IN ('on_duty', 'off_duty', 'active', 'inactive')),
  time_in TIMESTAMPTZ,
  time_out TIMESTAMPTZ,
  photo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.officials ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view officials in their barangay" 
ON public.officials 
FOR SELECT 
USING (true);

CREATE POLICY "Users can create officials" 
ON public.officials 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update officials they created" 
ON public.officials 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete officials they created" 
ON public.officials 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_officials_updated_at
BEFORE UPDATE ON public.officials
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_officials_user_id ON public.officials(user_id);
CREATE INDEX idx_officials_status ON public.officials(status);
CREATE INDEX idx_officials_position ON public.officials(position);