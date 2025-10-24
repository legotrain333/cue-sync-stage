-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('stage_manager', 'operator', 'director', 'director_plus', 'admin');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create user_roles table (separate to prevent privilege escalation)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Create shows table
CREATE TABLE public.shows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_by UUID REFERENCES public.profiles(id) NOT NULL,
  is_active BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.shows ENABLE ROW LEVEL SECURITY;

-- Create cue_sheets table
CREATE TABLE public.cue_sheets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  show_id UUID REFERENCES public.shows(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  file_url TEXT,
  is_active BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.cue_sheets ENABLE ROW LEVEL SECURITY;

-- Create cues table
CREATE TABLE public.cues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cue_sheet_id UUID REFERENCES public.cue_sheets(id) ON DELETE CASCADE NOT NULL,
  cue_number TEXT NOT NULL,
  department TEXT NOT NULL,
  sub_cue_number TEXT,
  description TEXT NOT NULL,
  notes TEXT,
  hold BOOLEAN DEFAULT false,
  color_code TEXT,
  timestamp TEXT,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.cues ENABLE ROW LEVEL SECURITY;

-- Create cue_progress table
CREATE TABLE public.cue_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  show_id UUID REFERENCES public.shows(id) ON DELETE CASCADE NOT NULL,
  current_cue_id UUID REFERENCES public.cues(id),
  status TEXT CHECK (status IN ('waiting', 'standby', 'go', 'complete')) DEFAULT 'waiting',
  updated_by UUID REFERENCES public.profiles(id) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.cue_progress ENABLE ROW LEVEL SECURITY;

-- Create operator_status table
CREATE TABLE public.operator_status (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  show_id UUID REFERENCES public.shows(id) ON DELETE CASCADE NOT NULL,
  current_cue_id UUID REFERENCES public.cues(id),
  is_ready BOOLEAN DEFAULT false,
  private_notes TEXT,
  last_ping TIMESTAMPTZ DEFAULT NOW(),
  is_online BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, show_id)
);

ALTER TABLE public.operator_status ENABLE ROW LEVEL SECURITY;

-- Create announcements table
CREATE TABLE public.announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  show_id UUID REFERENCES public.shows(id) ON DELETE CASCADE NOT NULL,
  message TEXT NOT NULL,
  sent_by UUID REFERENCES public.profiles(id) NOT NULL,
  is_emergency BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

-- Create cue_notes table
CREATE TABLE public.cue_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cue_id UUID REFERENCES public.cues(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) NOT NULL,
  note TEXT NOT NULL,
  is_private BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.cue_notes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view all profiles"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- RLS Policies for user_roles
CREATE POLICY "Users can view all roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage roles"
  ON public.user_roles FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'director_plus'));

-- RLS Policies for shows
CREATE POLICY "All authenticated users can view shows"
  ON public.shows FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Stage managers and admins can manage shows"
  ON public.shows FOR ALL
  TO authenticated
  USING (
    public.has_role(auth.uid(), 'stage_manager') OR 
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'director_plus')
  );

-- RLS Policies for cue_sheets
CREATE POLICY "All authenticated users can view cue sheets"
  ON public.cue_sheets FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Stage managers and admins can manage cue sheets"
  ON public.cue_sheets FOR ALL
  TO authenticated
  USING (
    public.has_role(auth.uid(), 'stage_manager') OR 
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'director_plus')
  );

-- RLS Policies for cues
CREATE POLICY "All authenticated users can view cues"
  ON public.cues FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Stage managers and admins can manage cues"
  ON public.cues FOR ALL
  TO authenticated
  USING (
    public.has_role(auth.uid(), 'stage_manager') OR 
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'director_plus')
  );

-- RLS Policies for cue_progress
CREATE POLICY "All authenticated users can view cue progress"
  ON public.cue_progress FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Stage managers and admins can update cue progress"
  ON public.cue_progress FOR ALL
  TO authenticated
  USING (
    public.has_role(auth.uid(), 'stage_manager') OR 
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'director_plus')
  );

-- RLS Policies for operator_status
CREATE POLICY "All authenticated users can view operator status"
  ON public.operator_status FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Operators can update own status"
  ON public.operator_status FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Stage managers and admins can manage all operator status"
  ON public.operator_status FOR ALL
  TO authenticated
  USING (
    public.has_role(auth.uid(), 'stage_manager') OR 
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'director_plus')
  );

-- RLS Policies for announcements
CREATE POLICY "All authenticated users can view announcements"
  ON public.announcements FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Stage managers, directors and admins can send announcements"
  ON public.announcements FOR INSERT
  TO authenticated
  WITH CHECK (
    public.has_role(auth.uid(), 'stage_manager') OR 
    public.has_role(auth.uid(), 'director') OR 
    public.has_role(auth.uid(), 'director_plus') OR 
    public.has_role(auth.uid(), 'admin')
  );

-- RLS Policies for cue_notes
CREATE POLICY "Users can view own notes"
  ON public.cue_notes FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Stage managers can view all notes"
  ON public.cue_notes FOR SELECT
  TO authenticated
  USING (
    public.has_role(auth.uid(), 'stage_manager') OR 
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'director_plus')
  );

CREATE POLICY "Users can manage own notes"
  ON public.cue_notes FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Create function and trigger for profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, username, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    NEW.email
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Add updated_at triggers to all tables
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_shows_updated_at BEFORE UPDATE ON public.shows
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_cue_sheets_updated_at BEFORE UPDATE ON public.cue_sheets
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_cues_updated_at BEFORE UPDATE ON public.cues
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_cue_progress_updated_at BEFORE UPDATE ON public.cue_progress
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_operator_status_updated_at BEFORE UPDATE ON public.operator_status
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_cue_notes_updated_at BEFORE UPDATE ON public.cue_notes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for key tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.cue_progress;
ALTER PUBLICATION supabase_realtime ADD TABLE public.operator_status;
ALTER PUBLICATION supabase_realtime ADD TABLE public.announcements;