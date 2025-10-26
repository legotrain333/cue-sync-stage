-- Create sessions table
CREATE TABLE public.sessions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_code text NOT NULL UNIQUE,
  password text,
  created_by uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  show_id uuid REFERENCES public.shows(id) ON DELETE CASCADE,
  created_at timestamp with time zone DEFAULT now(),
  is_active boolean DEFAULT true,
  name text NOT NULL
);

-- Create session participants table
CREATE TABLE public.session_participants (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id uuid NOT NULL REFERENCES public.sessions(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  joined_at timestamp with time zone DEFAULT now(),
  UNIQUE(session_id, user_id)
);

-- Enable RLS
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_participants ENABLE ROW LEVEL SECURITY;

-- Sessions policies
CREATE POLICY "Anyone can view active sessions" 
ON public.sessions 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Stage managers can create sessions" 
ON public.sessions 
FOR INSERT 
WITH CHECK (
  has_role(auth.uid(), 'stage_manager'::app_role) OR 
  has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Session creators can update their sessions" 
ON public.sessions 
FOR UPDATE 
USING (auth.uid() = created_by);

-- Session participants policies
CREATE POLICY "Users can view session participants" 
ON public.session_participants 
FOR SELECT 
USING (true);

CREATE POLICY "Users can join sessions" 
ON public.session_participants 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can leave sessions" 
ON public.session_participants 
FOR DELETE 
USING (auth.uid() = user_id);

-- Function to generate session code
CREATE OR REPLACE FUNCTION generate_session_code()
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
  code text;
  exists boolean;
BEGIN
  LOOP
    code := UPPER(substring(md5(random()::text) from 1 for 6));
    SELECT EXISTS(SELECT 1 FROM public.sessions WHERE session_code = code) INTO exists;
    EXIT WHEN NOT exists;
  END LOOP;
  RETURN code;
END;
$$;