
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
  }
): ExamQuestion[] => {
  const { isPracticeMode, questionCount, randomizeQuestions, randomizeAnswers } = options;
  
  console.log('Processing questions with options:', { 
    questionCount, 
    randomizeQuestions, 
    randomizeAnswers,
    isPracticeMode,
    totalQuestions: allQuestions.length 
  });

  let questions = [...allQuestions];

  // Apply question count limit for practice mode
  if (isPracticeMode && questionCount && questionCount > 0 && questionCount < questions.length) {
    questions = questions.slice(0, questionCount);
    console.log('Limited questions to:', questionCount);
  }

  // Randomize question order if selected
  if (randomizeQuestions) {
    questions = questions.sort(() => Math.random() - 0.5);
    console.log('Randomized question order');
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
  let correctCount = 0;
  
  questions.forEach((question, index) => {
    const questionNumber = index + 1;
    const selectedAnswer = answers[questionNumber];
    
    if (selectedAnswer && question.correct_answers.includes(parseInt(selectedAnswer))) {
      correctCount++;
    }
  });

  const score = questions.length > 0 ? (correctCount / questions.length) * 100 : 0;
  const timeSpent = startTime && endTime 
    ? Math.floor((endTime.getTime() - startTime.getTime()) / 1000)
    : 0;

  return {
    score,
    correctAnswers: correctCount,
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
