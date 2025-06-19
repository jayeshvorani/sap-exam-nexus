
-- Drop the current view and recreate it with fixed logic
DROP VIEW IF EXISTS public.user_exam_statistics;

-- Create a corrected view that properly aggregates exam attempt data
CREATE OR REPLACE VIEW public.user_exam_statistics AS
SELECT 
  ea.user_id,
  -- Practice exam stats
  COUNT(*) FILTER (WHERE ea.is_practice_mode = true AND ea.is_completed = true) as practice_exams_completed,
  ROUND(COALESCE(AVG(ea.score) FILTER (WHERE ea.is_practice_mode = true AND ea.is_completed = true AND ea.score IS NOT NULL), 0)) as practice_average_score,
  ROUND(COALESCE(SUM(CASE 
    WHEN ea.is_practice_mode = true AND ea.is_completed = true AND ea.start_time IS NOT NULL AND ea.end_time IS NOT NULL 
    THEN EXTRACT(EPOCH FROM (ea.end_time - ea.start_time)) / 3600.0 
    ELSE 0 
  END), 0) * 10) / 10 as practice_study_time_hours,
  COUNT(*) FILTER (WHERE ea.is_practice_mode = true AND ea.is_completed = true AND ea.passed = true) as practice_passed_count,
  COUNT(*) FILTER (WHERE ea.is_practice_mode = true AND ea.is_completed = true) as practice_total_count,
  
  -- Real exam stats
  COUNT(*) FILTER (WHERE ea.is_practice_mode = false AND ea.is_completed = true) as real_exams_completed,
  ROUND(COALESCE(AVG(ea.score) FILTER (WHERE ea.is_practice_mode = false AND ea.is_completed = true AND ea.score IS NOT NULL), 0)) as real_average_score,
  ROUND(COALESCE(SUM(CASE 
    WHEN ea.is_practice_mode = false AND ea.is_completed = true AND ea.start_time IS NOT NULL AND ea.end_time IS NOT NULL 
    THEN EXTRACT(EPOCH FROM (ea.end_time - ea.start_time)) / 3600.0 
    ELSE 0 
  END), 0) * 10) / 10 as real_study_time_hours,
  COUNT(*) FILTER (WHERE ea.is_practice_mode = false AND ea.is_completed = true AND ea.passed = true) as real_passed_count,
  COUNT(*) FILTER (WHERE ea.is_practice_mode = false AND ea.is_completed = true) as real_total_count,
  
  -- Certifications (only from real exams)
  COUNT(*) FILTER (WHERE ea.is_practice_mode = false AND ea.is_completed = true AND ea.passed = true) as certifications_earned
FROM public.exam_attempts ea
WHERE ea.is_completed = true
GROUP BY ea.user_id;
