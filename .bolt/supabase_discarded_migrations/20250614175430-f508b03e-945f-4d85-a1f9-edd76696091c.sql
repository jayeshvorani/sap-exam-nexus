
-- First, drop the existing RLS policy that depends on exam_id
DROP POLICY IF EXISTS "Anyone can view questions from active exams" ON public.questions;

-- Create a junction table for the many-to-many relationship between questions and exams
CREATE TABLE public.question_exams (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  exam_id UUID NOT NULL REFERENCES public.exams(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(question_id, exam_id)
);

-- Enable Row Level Security
ALTER TABLE public.question_exams ENABLE ROW LEVEL SECURITY;

-- RLS Policies for question_exams
CREATE POLICY "Anyone can view question-exam associations for active exams" ON public.question_exams
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.exams 
      WHERE id = question_exams.exam_id AND is_active = true
    )
  );

CREATE POLICY "Admins can manage question-exam associations" ON public.question_exams
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Migrate existing data from questions table to the junction table
INSERT INTO public.question_exams (question_id, exam_id)
SELECT id, exam_id FROM public.questions WHERE exam_id IS NOT NULL;

-- Now we can safely remove the exam_id column from questions table
ALTER TABLE public.questions DROP COLUMN exam_id;

-- Create new RLS policy for questions that works with the junction table
CREATE POLICY "Anyone can view questions associated with active exams" ON public.questions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.question_exams qe
      JOIN public.exams e ON e.id = qe.exam_id
      WHERE qe.question_id = questions.id AND e.is_active = true
    )
  );
