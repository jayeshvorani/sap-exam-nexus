
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Question {
  id: string;
  question_text: string;
  question_type: string;
  options: any;
  correct_answers: any;
  difficulty: string;
  explanation?: string;
  exam_id: string;
  image_url?: string;
}

interface Exam {
  id: string;
  title: string;
}

export const useQuestionData = () => {
  const { toast } = useToast();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchExams = async () => {
    try {
      console.log('Fetching exams...');
      const { data, error } = await supabase
        .from('exams')
        .select('id, title')
        .eq('is_active', true)
        .order('title');

      if (error) {
        console.error('Error fetching exams:', error);
        throw error;
      }
      
      console.log('Exams fetched successfully:', data);
      console.log('Number of exams:', data?.length || 0);
      setExams(data || []);
    } catch (error: any) {
      console.error('Error fetching exams:', error);
      toast({
        title: "Error",
        description: "Failed to load exams",
        variant: "destructive",
      });
    }
  };

  const fetchQuestions = async (selectedExam?: string) => {
    try {
      console.log('Fetching questions...');
      setLoading(true);
      let query = supabase
        .from('questions')
        .select(`
          *,
          exams!inner(title)
        `)
        .order('created_at', { ascending: false });

      if (selectedExam && selectedExam !== "all") {
        query = query.eq('exam_id', selectedExam);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching questions:', error);
        throw error;
      }
      
      console.log('Questions fetched:', data?.length || 0);
      setQuestions(data || []);
    } catch (error: any) {
      console.error('Error fetching questions:', error);
      toast({
        title: "Error",
        description: "Failed to load questions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBulkImport = async (questionsToImport: any[]) => {
    try {
      console.log('Importing questions:', questionsToImport);
      const { error } = await supabase
        .from('questions')
        .insert(questionsToImport);

      if (error) {
        console.error('Error importing questions:', error);
        throw error;
      }

      toast({
        title: "Success",
        description: `Successfully imported ${questionsToImport.length} questions`,
      });
      
      return true;
    } catch (error: any) {
      console.error('Error importing questions:', error);
      toast({
        title: "Error",
        description: `Failed to import questions: ${error.message}`,
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    questions,
    exams,
    loading,
    fetchExams,
    fetchQuestions,
    handleBulkImport
  };
};
