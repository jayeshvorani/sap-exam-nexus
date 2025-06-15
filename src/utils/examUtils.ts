export interface ExamQuestion {
  id: string;
  question_text: string;
  question_type: string;
  options: string[];
  correct_answers: number[];
  difficulty: string;
  explanation?: string;
  image_url?: string;
}

export interface ExamResults {
  score: number;
  correctAnswers: number;
  timeSpent: number;
  flaggedCount: number;
}

export const processQuestions = (
  allQuestions: ExamQuestion[],
  options: {
    isPracticeMode: boolean;
    questionCount?: number;
    randomizeQuestions: boolean;
    randomizeAnswers: boolean;
    examTotalQuestions?: number;
  }
): ExamQuestion[] => {
  const { isPracticeMode, questionCount, randomizeQuestions, randomizeAnswers, examTotalQuestions } = options;
  
  console.log('Processing questions with options:', { 
    questionCount, 
    randomizeQuestions, 
    randomizeAnswers,
    isPracticeMode,
    examTotalQuestions,
    totalQuestions: allQuestions.length 
  });

  let questions = [...allQuestions];

  // For real exams, use the exam's configured total_questions
  // For practice mode, use user's selection or exam's total_questions
  let targetQuestionCount = examTotalQuestions;
  
  if (isPracticeMode && questionCount && questionCount > 0) {
    targetQuestionCount = questionCount;
  }

  // If we have more questions than needed, randomly select the required number
  if (targetQuestionCount && targetQuestionCount < questions.length) {
    if (randomizeQuestions || !isPracticeMode) {
      // Shuffle all questions first
      questions = questions.sort(() => Math.random() - 0.5);
    }
    // Take only the required number of questions
    questions = questions.slice(0, targetQuestionCount);
    console.log(`Selected ${targetQuestionCount} questions from ${allQuestions.length} available questions`);
  }

  // Additional randomization if requested (for practice mode)
  if (isPracticeMode && randomizeQuestions && questions.length <= (targetQuestionCount || questions.length)) {
    questions = questions.sort(() => Math.random() - 0.5);
    console.log('Additional randomization applied for practice mode');
  }

  // Randomize answer options if selected
  if (randomizeAnswers) {
    questions = questions.map(question => {
      const originalOptions = [...question.options];
      const originalCorrectAnswers = [...question.correct_answers];
      
      // Create array of indices and shuffle them
      const indices = Array.from({ length: originalOptions.length }, (_, i) => i);
      const shuffledIndices = indices.sort(() => Math.random() - 0.5);
      
      // Reorder options based on shuffled indices
      const shuffledOptions = shuffledIndices.map(oldIndex => originalOptions[oldIndex]);
      
      // Update correct answers to match new positions
      const shuffledCorrectAnswers = originalCorrectAnswers.map(oldCorrectIndex => 
        shuffledIndices.indexOf(oldCorrectIndex)
      );

      return {
        ...question,
        options: shuffledOptions,
        correct_answers: shuffledCorrectAnswers
      };
    });
    console.log('Randomized answer options');
  }

  console.log('Final processed questions count:', questions.length);
  return questions;
};

export const calculateExamResults = (
  questions: ExamQuestion[],
  answers: Record<number, string>,
  flaggedQuestions: Set<number>,
  startTime: Date | null,
  endTime: Date | null
): ExamResults => {
  let totalScore = 0;
  let fullCorrectCount = 0; // Count of questions with 100% correct answers
  
  questions.forEach((question, index) => {
    const questionNumber = index + 1;
    const selectedAnswer = answers[questionNumber];
    
    if (!selectedAnswer) return;
    
    // Handle multi-answer questions with partial scoring
    if (question.correct_answers.length > 1) {
      const selectedAnswers = selectedAnswer.split(',').map(a => parseInt(a.trim())).filter(a => !isNaN(a));
      const correctAnswers = question.correct_answers;
      
      // Count how many selected answers are correct
      const correctSelections = selectedAnswers.filter(answer => correctAnswers.includes(answer));
      
      // Calculate partial score: (correct selections / total correct answers)
      const questionScore = correctSelections.length / correctAnswers.length;
      totalScore += questionScore;
      
      // Count as fully correct only if all correct answers are selected and no wrong answers
      if (correctSelections.length === correctAnswers.length && 
          selectedAnswers.length === correctAnswers.length) {
        fullCorrectCount++;
      }
    } else {
      // Handle single-answer questions (existing logic)
      if (question.correct_answers.includes(parseInt(selectedAnswer))) {
        totalScore += 1;
        fullCorrectCount++;
      }
    }
  });

  const score = questions.length > 0 ? (totalScore / questions.length) * 100 : 0;
  const timeSpent = startTime && endTime 
    ? Math.floor((endTime.getTime() - startTime.getTime()) / 1000)
    : 0;

  return {
    score,
    correctAnswers: fullCorrectCount, // This represents fully correct questions
    timeSpent,
    flaggedCount: flaggedQuestions.size
  };
};

export const getNavigationQuestions = (
  totalQuestions: number,
  showOnlyFlagged: boolean,
  filteredQuestions: number[]
): number[] => {
  return showOnlyFlagged 
    ? filteredQuestions 
    : Array.from({ length: totalQuestions }, (_, i) => i + 1);
};
