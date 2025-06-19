
-- First, let's see what data exists in exam_attempts
SELECT user_id, is_practice_mode, is_completed, score, passed, start_time, end_time
FROM public.exam_attempts 
LIMIT 10;

-- Drop and recreate the view with better logic
DROP VIEW IF EXISTS public.user_exam_statistics;

-- Create a view that ensures we get rows for all users who have exam attempts
-- and handles the case where users might not have any attempts
CREATE OR REPLACE VIEW public.user_exam_statistics AS
SELECT 
  ea.user_id,
  -- Practice exam stats
  COALESCE(COUNT(*) FILTER (WHERE ea.is_practice_mode = true AND ea.is_completed = true), 0) as practice_exams_completed,
  COALESCE(AVG(ea.score) FILTER (WHERE ea.is_practice_mode = true AND ea.is_completed = true AND ea.score IS NOT NULL), 0) as practice_average_score,
  COALESCE(SUM(CASE 
    WHEN ea.is_practice_mode = true AND ea.is_completed = true AND ea.start_time IS NOT NULL AND ea.end_time IS NOT NULL 
    THEN EXTRACT(EPOCH FROM (ea.end_time - ea.start_time)) / 3600.0 
    ELSE 0 
  END), 0) as practice_study_time_hours,
  COALESCE(COUNT(*) FILTER (WHERE ea.is_practice_mode = true AND ea.is_completed = true AND ea.passed = true), 0) as practice_passed_count,
  COALESCE(COUNT(*) FILTER (WHERE ea.is_practice_mode = true AND ea.is_completed = true), 0) as practice_total_count,
  
  -- Real exam stats  
  COALESCE(COUNT(*) FILTER (WHERE ea.is_practice_mode = false AND ea.is_completed = true), 0) as real_exams_completed,
  COALESCE(AVG(ea.score) FILTER (WHERE ea.is_practice_mode = false AND ea.is_completed = true AND ea.score IS NOT NULL), 0) as real_average_score,
  COALESCE(SUM(CASE 
    WHEN ea.is_practice_mode = false AND ea.is_completed = true AND ea.start_time IS NOT NULL AND ea.end_time IS NOT NULL 
    THEN EXTRACT(EPOCH FROM (ea.end_time - ea.start_time)) / 3600.0 
    ELSE 0 
  END), 0) as real_study_time_hours,
  COALESCE(COUNT(*) FILTER (WHERE ea.is_practice_mode = false AND ea.is_completed = true AND ea.passed = true), 0) as real_passed_count,
  COALESCE(COUNT(*) FILTER (WHERE ea.is_practice_mode = false AND ea.is_completed = true), 0) as real_total_count,
  
  -- Certifications (only from real exams)
  COALESCE(COUNT(*) FILTER (WHERE ea.is_practice_mode = false AND ea.is_completed = true AND ea.passed = true), 0) as certifications_earned
FROM public.exam_attempts ea
GROUP BY ea.user_id;
