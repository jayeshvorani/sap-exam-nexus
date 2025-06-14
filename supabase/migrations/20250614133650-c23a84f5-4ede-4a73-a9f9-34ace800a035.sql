
-- Add new columns to the exams table for better categorization and visual appeal
ALTER TABLE public.exams 
ADD COLUMN category TEXT,
ADD COLUMN difficulty TEXT DEFAULT 'intermediate',
ADD COLUMN icon_url TEXT,
ADD COLUMN image_url TEXT;

-- Add a check constraint to ensure difficulty values are valid
ALTER TABLE public.exams 
ADD CONSTRAINT exams_difficulty_check 
CHECK (difficulty IN ('beginner', 'intermediate', 'advanced'));

-- Update existing exams with some sample data to demonstrate the new fields
UPDATE public.exams 
SET 
  category = 'Fundamentals',
  difficulty = 'beginner',
  icon_url = 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b'
WHERE id IN (SELECT id FROM public.exams LIMIT 1);
