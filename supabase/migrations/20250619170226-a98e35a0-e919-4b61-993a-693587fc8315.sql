
-- Drop the existing view and recreate it with proper logic
DROP VIEW IF EXISTS public.user_exam_statistics;

CREATE OR REPLACE VIEW public.user_exam_statistics AS
SELECT 
  user_id,
  -- Practice exam stats
  COUNT(*) FILTER (WHERE is_practice_mode = true AND is_completed = true) as practice_exams_completed,
  COALESCE(AVG(score) FILTER (WHERE is_practice_mode = true AND is_completed = true AND score IS NOT NULL), 0) as practice_average_score,
  COALESCE(SUM(CASE 
    WHEN is_practice_mode = true AND is_completed = true AND start_time IS NOT NULL AND end_time IS NOT NULL 
    THEN EXTRACT(EPOCH FROM (end_time - start_time)) / 3600.0 
    ELSE 0 
  END), 0) as practice_study_time_hours,
  COUNT(*) FILTER (WHERE is_practice_mode = true AND is_completed = true AND passed = true) as practice_passed_count,
  COUNT(*) FILTER (WHERE is_practice_mode = true AND is_completed = true) as practice_total_count,
  
  -- Real exam stats
  COUNT(*) FILTER (WHERE is_practice_mode = false AND is_completed = true) as real_exams_completed,
  COALESCE(AVG(score) FILTER (WHERE is_practice_mode = false AND is_completed = true AND score IS NOT NULL), 0) as real_average_score,
  COALESCE(SUM(CASE 
    WHEN is_practice_mode = false AND is_completed = true AND start_time IS NOT NULL AND end_time IS NOT NULL 
    THEN EXTRACT(EPOCH FROM (end_time - start_time)) / 3600.0 
    ELSE 0 
  END), 0) as real_study_time_hours,
  COUNT(*) FILTER (WHERE is_practice_mode = false AND is_completed = true AND passed = true) as real_passed_count,
  COUNT(*) FILTER (WHERE is_practice_mode = false AND is_completed = true) as real_total_count,
  
  -- Certifications (only from real exams)
  COUNT(*) FILTER (WHERE is_practice_mode = false AND is_completed = true AND passed = true) as certifications_earned
FROM public.exam_attempts
GROUP BY user_id;
