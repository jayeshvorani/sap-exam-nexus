
-- First, let's drop the current view and recreate it with corrected logic
DROP VIEW IF EXISTS public.user_exam_statistics;

-- Create the view with better filtering logic
CREATE OR REPLACE VIEW public.user_exam_statistics AS
SELECT 
  user_id,
  -- Practice exam stats
  COUNT(CASE WHEN is_practice_mode = true AND is_completed = true THEN 1 END) as practice_exams_completed,
  COALESCE(AVG(CASE WHEN is_practice_mode = true AND is_completed = true AND score IS NOT NULL THEN score END), 0) as practice_average_score,
  COALESCE(SUM(CASE 
    WHEN is_practice_mode = true AND is_completed = true AND start_time IS NOT NULL AND end_time IS NOT NULL 
    THEN EXTRACT(EPOCH FROM (end_time - start_time)) / 3600.0 
    ELSE 0 
  END), 0) as practice_study_time_hours,
  COUNT(CASE WHEN is_practice_mode = true AND is_completed = true AND passed = true THEN 1 END) as practice_passed_count,
  COUNT(CASE WHEN is_practice_mode = true AND is_completed = true THEN 1 END) as practice_total_count,
  
  -- Real exam stats
  COUNT(CASE WHEN is_practice_mode = false AND is_completed = true THEN 1 END) as real_exams_completed,
  COALESCE(AVG(CASE WHEN is_practice_mode = false AND is_completed = true AND score IS NOT NULL THEN score END), 0) as real_average_score,
  COALESCE(SUM(CASE 
    WHEN is_practice_mode = false AND is_completed = true AND start_time IS NOT NULL AND end_time IS NOT NULL 
    THEN EXTRACT(EPOCH FROM (end_time - start_time)) / 3600.0 
    ELSE 0 
  END), 0) as real_study_time_hours,
  COUNT(CASE WHEN is_practice_mode = false AND is_completed = true AND passed = true THEN 1 END) as real_passed_count,
  COUNT(CASE WHEN is_practice_mode = false AND is_completed = true THEN 1 END) as real_total_count,
  
  -- Certifications (only from real exams)
  COUNT(CASE WHEN is_practice_mode = false AND is_completed = true AND passed = true THEN 1 END) as certifications_earned
FROM public.exam_attempts
GROUP BY user_id;

-- Let's also create a debug query to see what's in the exam_attempts table
-- This will help us understand what data exists
CREATE OR REPLACE FUNCTION public.debug_exam_attempts(target_user_id uuid DEFAULT NULL)
RETURNS TABLE(
  user_id uuid,
  exam_id uuid, 
  is_practice_mode boolean,
  is_completed boolean,
  score integer,
  passed boolean,
  start_time timestamptz,
  end_time timestamptz
) 
LANGUAGE sql
AS $$
  SELECT 
    ea.user_id,
    ea.exam_id,
    ea.is_practice_mode,
    ea.is_completed,
    ea.score,
    ea.passed,
    ea.start_time,
    ea.end_time
  FROM public.exam_attempts ea
  WHERE target_user_id IS NULL OR ea.user_id = target_user_id
  ORDER BY ea.created_at DESC;
$$;
