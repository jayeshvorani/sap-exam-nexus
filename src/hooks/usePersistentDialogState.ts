import { useState, useEffect, useRef, useCallback } from 'react';

interface PersistentDialogState {
  isOpen: boolean;
  formData: any;
  editingQuestion: any;
}

const DIALOG_STATE_KEY = 'questionDialogState';

export const usePersistentDialogState = () => {
  const [dialogState, setDialogState] = useState<PersistentDialogState>({
    isOpen: false,
    formData: null,
    editingQuestion: null
  });
  
  const mounted = useRef(true);
  const lastSavedState = useRef<PersistentDialogState | null>(null);

  // Load state from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(DIALOG_STATE_KEY);
      if (saved) {
        const parsedState = JSON.parse(saved);
        console.log('Loading persisted dialog state:', parsedState);
        setDialogState(parsedState);
        lastSavedState.current = parsedState;
      }
    } catch (error) {
      console.error('Failed to load dialog state:', error);
    }
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    if (mounted.current) {
      try {
        localStorage.setItem(DIALOG_STATE_KEY, JSON.stringify(dialogState));
        lastSavedState.current = dialogState;
        console.log('Saving dialog state:', dialogState);
      } catch (error) {
        console.error('Failed to save dialog state:', error);
      }
    }
  }, [dialogState]);

  // Clean up on unmount
  useEffect(() => {
    const handleBeforeUnload = () => {
      mounted.current = false;
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  const openDialog = useCallback((editingQuestion: any = null) => {
    console.log('Opening dialog with editing question:', editingQuestion);
    setDialogState(prev => ({
      ...prev,
      isOpen: true,
      editingQuestion
    }));
  }, []);

  const closeDialog = useCallback(() => {
    console.log('Closing dialog');
    setDialogState(prev => ({
      ...prev,
      isOpen: false,
      editingQuestion: null,
      formData: null
    }));
    // Clear localStorage when explicitly closing
    try {
      localStorage.removeItem(DIALOG_STATE_KEY);
    } catch (error) {
      console.error('Failed to clear dialog state:', error);
    }
  }, []);

  const updateFormData = useCallback((formData: any) => {
    setDialogState(prev => ({
      ...prev,
      formData
    }));
  }, []);

  const forceClose = useCallback(() => {
    console.log('Force closing dialog');
    setDialogState({
      isOpen: false,
      formData: null,
      editingQuestion: null
    });
    try {
      localStorage.removeItem(DIALOG_STATE_KEY);
    } catch (error) {
      console.error('Failed to clear dialog state:', error);
    }
  }, []);

  return {
    isOpen: dialogState.isOpen,
    formData: dialogState.formData,
    editingQuestion: dialogState.editingQuestion,
    openDialog,
    closeDialog,
    updateFormData,
    forceClose
  };
};