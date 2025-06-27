
-- Add foreign key constraints with CASCADE options to maintain referential integrity

-- 1. Add foreign key for exam_attempts.exam_id -> exams.id
ALTER TABLE public.exam_attempts 
ADD CONSTRAINT fk_exam_attempts_exam_id 
FOREIGN KEY (exam_id) REFERENCES public.exams(id) ON DELETE CASCADE;

-- 2. Add foreign key for exam_attempts.user_id -> auth.users.id (already exists, but ensuring CASCADE)
-- Note: This should already exist from the migration, but let's ensure it has CASCADE
ALTER TABLE public.exam_attempts 
DROP CONSTRAINT IF EXISTS exam_attempts_user_id_fkey;

ALTER TABLE public.exam_attempts 
ADD CONSTRAINT exam_attempts_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- 3. Add foreign key for user_answers.attempt_id -> exam_attempts.id (should already have CASCADE)
-- This should already be correct from existing migration

-- 4. Add foreign key for user_answers.question_id -> questions.id (should already have CASCADE)
-- This should already be correct from existing migration

-- 5. Add foreign key for user_exam_assignments.exam_id -> exams.id
ALTER TABLE public.user_exam_assignments 
DROP CONSTRAINT IF EXISTS user_exam_assignments_exam_id_fkey;

ALTER TABLE public.user_exam_assignments 
ADD CONSTRAINT user_exam_assignments_exam_id_fkey 
FOREIGN KEY (exam_id) REFERENCES public.exams(id) ON DELETE CASCADE;

-- 6. Add foreign key for user_exam_assignments.user_id -> auth.users.id
ALTER TABLE public.user_exam_assignments 
ADD CONSTRAINT fk_user_exam_assignments_user_id 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- 7. Add foreign key for user_exam_assignments.assigned_by -> auth.users.id
ALTER TABLE public.user_exam_assignments 
ADD CONSTRAINT fk_user_exam_assignments_assigned_by 
FOREIGN KEY (assigned_by) REFERENCES auth.users(id) ON DELETE SET NULL;

-- 8. Ensure exams.created_by has proper foreign key
ALTER TABLE public.exams 
ADD CONSTRAINT fk_exams_created_by 
FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE SET NULL;

-- 9. question_exams and questions already have proper CASCADE constraints from existing migrations
-- These should be working correctly already

-- Create indexes for better performance on foreign key columns
CREATE INDEX IF NOT EXISTS idx_exam_attempts_exam_id ON public.exam_attempts(exam_id);
CREATE INDEX IF NOT EXISTS idx_exam_attempts_user_id ON public.exam_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_user_exam_assignments_exam_id ON public.user_exam_assignments(exam_id);
CREATE INDEX IF NOT EXISTS idx_user_exam_assignments_user_id ON public.user_exam_assignments(user_id);
CREATE INDEX IF NOT EXISTS idx_exams_created_by ON public.exams(created_by);
