
-- Drop the current view and recreate it with all calculated fields
DROP VIEW IF EXISTS public.user_exam_statistics;

-- Create a comprehensive view that includes all statistics
CREATE OR REPLACE VIEW public.user_exam_statistics AS
SELECT 
  ea.user_id,
  -- Practice exam stats (completed = has end_time and score)
  COUNT(*) FILTER (WHERE ea.is_practice_mode = true AND ea.end_time IS NOT NULL AND ea.score IS NOT NULL) as practice_exams_completed,
  ROUND(COALESCE(AVG(ea.score) FILTER (WHERE ea.is_practice_mode = true AND ea.end_time IS NOT NULL AND ea.score IS NOT NULL), 0)) as practice_average_score,
  ROUND(COALESCE(SUM(CASE 
    WHEN ea.is_practice_mode = true AND ea.start_time IS NOT NULL AND ea.end_time IS NOT NULL 
    THEN EXTRACT(EPOCH FROM (ea.end_time - ea.start_time)) / 3600.0 
    ELSE 0 
  END), 0) * 10) / 10 as practice_study_time_hours,
  COUNT(*) FILTER (WHERE ea.is_practice_mode = true AND ea.end_time IS NOT NULL AND ea.score IS NOT NULL AND ea.passed = true) as practice_passed_count,
  COUNT(*) FILTER (WHERE ea.is_practice_mode = true AND ea.end_time IS NOT NULL AND ea.score IS NOT NULL) as practice_total_count,
  
  -- Real exam stats (completed = has end_time and score)
  COUNT(*) FILTER (WHERE ea.is_practice_mode = false AND ea.end_time IS NOT NULL AND ea.score IS NOT NULL) as real_exams_completed,
  ROUND(COALESCE(AVG(ea.score) FILTER (WHERE ea.is_practice_mode = false AND ea.end_time IS NOT NULL AND ea.score IS NOT NULL), 0)) as real_average_score,
  ROUND(COALESCE(SUM(CASE 
    WHEN ea.is_practice_mode = false AND ea.start_time IS NOT NULL AND ea.end_time IS NOT NULL 
    THEN EXTRACT(EPOCH FROM (ea.end_time - ea.start_time)) / 3600.0 
    ELSE 0 
  END), 0) * 10) / 10 as real_study_time_hours,
  COUNT(*) FILTER (WHERE ea.is_practice_mode = false AND ea.end_time IS NOT NULL AND ea.score IS NOT NULL AND ea.passed = true) as real_passed_count,
  COUNT(*) FILTER (WHERE ea.is_practice_mode = false AND ea.end_time IS NOT NULL AND ea.score IS NOT NULL) as real_total_count,
  
  -- Total combined stats
  COUNT(*) FILTER (WHERE ea.end_time IS NOT NULL AND ea.score IS NOT NULL) as total_exams_completed,
  ROUND(COALESCE(SUM(CASE 
    WHEN ea.start_time IS NOT NULL AND ea.end_time IS NOT NULL 
    THEN EXTRACT(EPOCH FROM (ea.end_time - ea.start_time)) / 3600.0 
    ELSE 0 
  END), 0) * 10) / 10 as total_study_time_hours,
  ROUND(COALESCE(AVG(ea.score) FILTER (WHERE ea.end_time IS NOT NULL AND ea.score IS NOT NULL), 0)) as total_average_score,
  
  -- Certifications (only from real exams that were completed and passed)
  COUNT(*) FILTER (WHERE ea.is_practice_mode = false AND ea.end_time IS NOT NULL AND ea.score IS NOT NULL AND ea.passed = true) as certifications_earned
FROM public.exam_attempts ea
WHERE ea.end_time IS NOT NULL AND ea.score IS NOT NULL
GROUP BY ea.user_id;
