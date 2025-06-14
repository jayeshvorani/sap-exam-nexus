
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

  const handleAnswerSelect = useCallback((questionNumber: number, answerId: string) => {
    console.log('Answer selected:', { questionNumber, answerId });
    setState(prev => ({
      ...prev,
      answers: {
        ...prev.answers,
        [questionNumber]: answerId
      }
    }));
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
