
-- Add passing_percentage column to exams table
ALTER TABLE public.exams ADD COLUMN passing_percentage INTEGER NOT NULL DEFAULT 70;

-- Update the existing passing_score column comment for clarity
COMMENT ON COLUMN public.exams.passing_score IS 'Minimum score required to pass (deprecated, use passing_percentage)';
COMMENT ON COLUMN public.exams.passing_percentage IS 'Minimum percentage required to pass the exam';
