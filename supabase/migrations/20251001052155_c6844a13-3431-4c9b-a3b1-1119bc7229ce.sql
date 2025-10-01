-- Create ordinances table
CREATE TABLE public.ordinances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  number TEXT NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  date_enacted TIMESTAMPTZ NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'amended', 'repealed')),
  pdf_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create reports table
CREATE TABLE public.reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  ticket_number TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in-progress', 'resolved', 'rejected')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  category TEXT NOT NULL,
  reporter_name TEXT NOT NULL,
  reporter_contact TEXT,
  description TEXT NOT NULL,
  location TEXT,
  date_reported TIMESTAMPTZ DEFAULT now(),
  date_resolved TIMESTAMPTZ,
  assigned_to TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create activities table
CREATE TABLE public.activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  type TEXT NOT NULL,
  date TIMESTAMPTZ NOT NULL,
  status TEXT DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'ongoing', 'completed', 'cancelled')),
  location TEXT NOT NULL,
  description TEXT,
  organizer TEXT NOT NULL,
  contact TEXT,
  attendees INTEGER DEFAULT 0,
  max_attendees INTEGER,
  budget NUMERIC,
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.ordinances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;

-- RLS Policies for ordinances
CREATE POLICY "Users can view all ordinances" 
ON public.ordinances FOR SELECT USING (true);

CREATE POLICY "Users can create ordinances" 
ON public.ordinances FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their ordinances" 
ON public.ordinances FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their ordinances" 
ON public.ordinances FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for reports
CREATE POLICY "Users can view all reports" 
ON public.reports FOR SELECT USING (true);

CREATE POLICY "Users can create reports" 
ON public.reports FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their reports" 
ON public.reports FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their reports" 
ON public.reports FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for activities
CREATE POLICY "Users can view all activities" 
ON public.activities FOR SELECT USING (true);

CREATE POLICY "Users can create activities" 
ON public.activities FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their activities" 
ON public.activities FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their activities" 
ON public.activities FOR DELETE USING (auth.uid() = user_id);

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_ordinances_updated_at
BEFORE UPDATE ON public.ordinances
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_reports_updated_at
BEFORE UPDATE ON public.reports
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_activities_updated_at
BEFORE UPDATE ON public.activities
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_ordinances_user_id ON public.ordinances(user_id);
CREATE INDEX idx_ordinances_category ON public.ordinances(category);
CREATE INDEX idx_ordinances_status ON public.ordinances(status);

CREATE INDEX idx_reports_user_id ON public.reports(user_id);
CREATE INDEX idx_reports_status ON public.reports(status);
CREATE INDEX idx_reports_priority ON public.reports(priority);
CREATE INDEX idx_reports_ticket_number ON public.reports(ticket_number);

CREATE INDEX idx_activities_user_id ON public.activities(user_id);
CREATE INDEX idx_activities_status ON public.activities(status);
CREATE INDEX idx_activities_date ON public.activities(date);