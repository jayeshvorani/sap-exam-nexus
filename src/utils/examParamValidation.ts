
import { supabase } from "@/integrations/supabase/client";

export interface ValidatedExamParams {
  mode: 'practice' | 'real';
  questionCount: number;
  randomizeQuestions: boolean;
  randomizeAnswers: boolean;
}

export interface ExamValidationResult {
  isValid: boolean;
  validatedParams: ValidatedExamParams;
  errors: string[];
  shouldRedirect?: boolean;
  cleanUrl?: string;
}

export const validateExamParams = async (
  examId: string,
  userId: string,
  searchParams: URLSearchParams,
  currentPath: string
): Promise<ExamValidationResult> => {
  const errors: string[] = [];
  
  try {
    // Fetch exam data to get constraints
    const { data: examData, error: examError } = await supabase
      .from('exams')
      .select('total_questions, is_active')
      .eq('id', examId)
      .single();

    if (examError || !examData) {
      return {
        isValid: false,
        validatedParams: getDefaultParams(),
        errors: ['Exam not found or inactive']
      };
    }

    if (!examData.is_active) {
      return {
        isValid: false,
        validatedParams: getDefaultParams(),
        errors: ['Exam is not active']
      };
    }

    // Check if user has access to this exam
    const { data: assignmentData, error: assignmentError } = await supabase
      .from('user_exam_assignments')
      .select('id')
      .eq('user_id', userId)
      .eq('exam_id', examId)
      .eq('is_active', true)
      .single();

    if (assignmentError || !assignmentData) {
      return {
        isValid: false,
        validatedParams: getDefaultParams(),
        errors: ['User does not have access to this exam']
      };
    }

    // Validate and sanitize parameters
    const mode = validateMode(searchParams.get('mode'));
    const questionCount = validateQuestionCount(
      searchParams.get('questionCount'), 
      examData.total_questions,
      mode
    );
    const randomizeQuestions = validateBoolean(searchParams.get('randomizeQuestions'));
    const randomizeAnswers = validateBoolean(searchParams.get('randomizeAnswers'));

    // Additional validation: Real exams should use all questions
    let finalQuestionCount = questionCount;
    if (mode === 'real' && questionCount !== examData.total_questions) {
      finalQuestionCount = examData.total_questions;
      errors.push(`Real exams must include all ${examData.total_questions} questions`);
    }

    // Check if URL has query parameters that should be cleaned
    const hasQueryParams = searchParams.toString().length > 0;
    const cleanUrl = hasQueryParams ? currentPath : undefined;

    return {
      isValid: errors.length === 0,
      validatedParams: {
        mode,
        questionCount: finalQuestionCount,
        randomizeQuestions,
        randomizeAnswers
      },
      errors,
      shouldRedirect: hasQueryParams,
      cleanUrl
    };

  } catch (error) {
    console.error('Error validating exam parameters:', error);
    return {
      isValid: false,
      validatedParams: getDefaultParams(),
      errors: ['Failed to validate exam parameters']
    };
  }
};

const validateMode = (mode: string | null): 'practice' | 'real' => {
  if (mode === 'real' || mode === 'practice') {
    return mode;
  }
  return 'practice'; // Default to practice mode for security
};

const validateQuestionCount = (
  count: string | null, 
  maxQuestions: number, 
  mode: 'practice' | 'real'
): number => {
  if (mode === 'real') {
    return maxQuestions; // Real exams must use all questions
  }
  
  const parsed = parseInt(count || '0');
  if (isNaN(parsed) || parsed <= 0) {
    return Math.min(10, maxQuestions); // Default to 10 questions or max available
  }
  
  return Math.min(parsed, maxQuestions); // Cap at maximum available questions
};

const validateBoolean = (value: string | null): boolean => {
  return value === 'true';
};

const getDefaultParams = (): ValidatedExamParams => ({
  mode: 'practice',
  questionCount: 10,
  randomizeQuestions: false,
  randomizeAnswers: false
});
