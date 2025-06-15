
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
  image_url?: string;
  exams?: { title: string }[];
  exam_ids?: string[];
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
      console.log('Fetching questions for exam:', selectedExam);
      setLoading(true);
      
      if (selectedExam === "all" || !selectedExam) {
        // Fetch all questions with their exam associations
        const { data, error } = await supabase
          .from('questions')
          .select(`
            *,
            question_exams(
              exam_id,
              exams(title)
            )
          `)
          .order('created_at', { ascending: false });

        if (error) throw error;

        const transformedQuestions = data?.map(question => ({
          ...question,
          exams: question.question_exams?.map((qe: any) => ({ title: qe.exams?.title })) || [],
          exam_ids: question.question_exams?.map((qe: any) => qe.exam_id) || []
        })) || [];
        
        setQuestions(transformedQuestions);
      } else {
        // Fetch questions for specific exam
        const { data, error } = await supabase
          .from('questions')
          .select(`
            *,
            question_exams!inner(
              exam_id,
              exams!inner(title)
            )
          `)
          .eq('question_exams.exam_id', selectedExam)
          .order('created_at', { ascending: false });

        if (error) throw error;

        const transformedQuestions = data?.map(question => ({
          ...question,
          exams: question.question_exams?.map((qe: any) => ({ title: qe.exams.title })) || [],
          exam_ids: question.question_exams?.map((qe: any) => qe.exam_id) || []
        })) || [];
        
        setQuestions(transformedQuestions);
      }
      
      console.log('Questions fetched:', questions.length);
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
      
      // First, insert questions
      const { data: insertedQuestions, error: questionError } = await supabase
        .from('questions')
        .insert(questionsToImport.map(q => ({
          question_text: q.question_text,
          question_type: q.question_type,
          options: q.options,
          correct_answers: q.correct_answers,
          difficulty: q.difficulty,
          explanation: q.explanation,
          image_url: q.image_url
        })))
        .select();

      if (questionError) {
        console.error('Error inserting questions:', questionError);
        throw questionError;
      }

      // Then, create question-exam associations
      const associations = [];
      for (let i = 0; i < insertedQuestions.length; i++) {
        const question = insertedQuestions[i];
        const originalQuestion = questionsToImport[i];
        if (originalQuestion.exam_id) {
          associations.push({
            question_id: question.id,
            exam_id: originalQuestion.exam_id
          });
        }
      }

      if (associations.length > 0) {
        const { error: associationError } = await supabase
          .from('question_exams')
          .insert(associations);

        if (associationError) {
          console.error('Error creating question-exam associations:', associationError);
          throw associationError;
        }
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

  const assignQuestionsToExam = async (questionIds: string[], examId: string) => {
    try {
      const associations = questionIds.map(questionId => ({
        question_id: questionId,
        exam_id: examId
      }));

      const { error } = await supabase
        .from('question_exams')
        .upsert(associations, { 
          onConflict: 'question_id,exam_id',
          ignoreDuplicates: true 
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: `Successfully assigned ${questionIds.length} questions to exam`,
      });
      
      return true;
    } catch (error: any) {
      console.error('Error assigning questions:', error);
      toast({
        title: "Error",
        description: `Failed to assign questions: ${error.message}`,
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
    handleBulkImport,
    assignQuestionsToExam
  };
};
