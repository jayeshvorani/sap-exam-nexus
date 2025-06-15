
import { useState, useCallback } from 'react';

export interface ExamState {
  currentQuestion: number;
  answers: Record<number, string>;
  flaggedQuestions: Set<number>;
  examStarted: boolean;
  examFinished: boolean;
  startTime: Date | null;
  endTime: Date | null;
  showAnswers: boolean;
  showOnlyFlagged: boolean;
  isReviewMode: boolean;
}

const initialState: ExamState = {
  currentQuestion: 1,
  answers: {},
  flaggedQuestions: new Set(),
  examStarted: false,
  examFinished: false,
  startTime: null,
  endTime: null,
  showAnswers: false,
  showOnlyFlagged: false,
  isReviewMode: false,
};

export const useExamState = () => {
  const [state, setState] = useState<ExamState>(initialState);

  const updateState = useCallback((updates: Partial<ExamState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const handleAnswerSelect = useCallback((questionNumber: number, answerId: string, isMultipleChoice: boolean = false) => {
    console.log('Answer selected:', { questionNumber, answerId, isMultipleChoice });
    setState(prev => {
      if (isMultipleChoice) {
        // Handle multiple choice questions
        const currentAnswers = prev.answers[questionNumber] ? prev.answers[questionNumber].split(',').map(a => a.trim()) : [];
        const answerIndex = parseInt(answerId);
        
        let newAnswers;
        if (currentAnswers.includes(answerId)) {
          // Remove the answer if it's already selected
          newAnswers = currentAnswers.filter(a => a !== answerId);
        } else {
          // Add the answer
          newAnswers = [...currentAnswers, answerId];
        }
        
        return {
          ...prev,
          answers: {
            ...prev.answers,
            [questionNumber]: newAnswers.join(',')
          }
        };
      } else {
        // Handle single choice questions
        return {
          ...prev,
          answers: {
            ...prev.answers,
            [questionNumber]: answerId
          }
        };
      }
    });
  }, []);

  const handleToggleFlag = useCallback((questionNumber: number) => {
    console.log('Toggle flag clicked for question:', questionNumber);
    setState(prev => {
      const newSet = new Set(prev.flaggedQuestions);
      if (newSet.has(questionNumber)) {
        newSet.delete(questionNumber);
        console.log('Unflagged question:', questionNumber);
      } else {
        newSet.add(questionNumber);
        console.log('Flagged question:', questionNumber);
      }
      return {
        ...prev,
        flaggedQuestions: newSet
      };
    });
  }, []);

  const resetExam = useCallback(() => {
    setState(initialState);
  }, []);

  const startExam = useCallback(() => {
    setState(prev => ({
      ...prev,
      examStarted: true,
      startTime: new Date()
    }));
  }, []);

  const finishExam = useCallback(() => {
    setState(prev => ({
      ...prev,
      examFinished: true,
      endTime: new Date()
    }));
  }, []);

  const startReview = useCallback(() => {
    setState(prev => ({
      ...prev,
      showAnswers: true,
      currentQuestion: 1,
      showOnlyFlagged: false,
      isReviewMode: true
    }));
  }, []);

  const exitReview = useCallback(() => {
    setState(prev => ({
      ...prev,
      isReviewMode: false,
      showAnswers: false
    }));
  }, []);

  return {
    state,
    updateState,
    handleAnswerSelect,
    handleToggleFlag,
    resetExam,
    startExam,
    finishExam,
    startReview,
    exitReview,
  };
};
