-- Drop the restrictive policy
DROP POLICY IF EXISTS "Stage managers can create sessions" ON public.sessions;

-- Allow anyone authenticated to create sessions
CREATE POLICY "Anyone can create sessions" 
ON public.sessions 
FOR INSERT 
WITH CHECK (auth.uid() = created_by);