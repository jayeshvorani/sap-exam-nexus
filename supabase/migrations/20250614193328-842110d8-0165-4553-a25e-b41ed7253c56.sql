
-- Create a table to assign exams to specific users
CREATE TABLE public.user_exam_assignments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  exam_id UUID REFERENCES public.exams(id) ON DELETE CASCADE NOT NULL,
  assigned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  assigned_by UUID REFERENCES auth.users,
  is_active BOOLEAN NOT NULL DEFAULT true,
  UNIQUE(user_id, exam_id)
);

-- Enable Row Level Security
ALTER TABLE public.user_exam_assignments ENABLE ROW LEVEL SECURITY;

-- Users can only see their own assignments
CREATE POLICY "Users can view their own exam assignments" 
  ON public.user_exam_assignments 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Only admins can assign exams
CREATE POLICY "Admins can manage exam assignments" 
  ON public.user_exam_assignments 
  FOR ALL 
  USING (EXISTS (
    SELECT 1 FROM public.user_profiles 
    WHERE id = auth.uid() AND role = 'admin'
  ));

-- Update exam_attempts table to include practice mode
ALTER TABLE public.exam_attempts 
ADD COLUMN is_practice_mode BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN flagged_questions JSONB DEFAULT '[]'::jsonb;

-- Create an index for better performance
CREATE INDEX idx_user_exam_assignments_user_id ON public.user_exam_assignments(user_id);
CREATE INDEX idx_user_exam_assignments_exam_id ON public.user_exam_assignments(exam_id);
