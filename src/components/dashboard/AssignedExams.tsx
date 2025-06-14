
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, BookOpen, Award, Calendar } from "lucide-react";
import { useUserExams } from "@/hooks/useUserExams";
import { useState } from "react";
import ExamModeSelector from "@/components/exam/ExamModeSelector";
import { useNavigate } from "react-router-dom";

const AssignedExams = () => {
  const { exams, loading, error } = useUserExams();
  const [selectedExam, setSelectedExam] = useState<any>(null);
  const [showModeSelector, setShowModeSelector] = useState(false);
  const navigate = useNavigate();

  const handleStartExam = (exam: any) => {
    console.log('handleStartExam called with exam:', exam);
    setSelectedExam(exam);
    setShowModeSelector(true);
  };

  const handleModeSelect = (mode: 'practice' | 'real', options: {
    questionCount?: number;
    randomizeQuestions: boolean;
    randomizeAnswers: boolean;
  }) => {
    console.log('handleModeSelect called with:', { mode, options, selectedExam });
    setShowModeSelector(false);
    if (selectedExam) {
      const params = new URLSearchParams({ mode });
      if (options.questionCount) {
        params.append('questionCount', options.questionCount.toString());
      }
      if (options.randomizeQuestions) {
        params.append('randomizeQuestions', 'true');
      }
      if (options.randomizeAnswers) {
        params.append('randomizeAnswers', 'true');
      }
      const navigationUrl = `/exam/${selectedExam.id}?${params.toString()}`;
      console.log('Navigating to:', navigationUrl);
      navigate(navigationUrl);
    } else {
      console.error('No selected exam when trying to navigate');
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Assigned Exams</CardTitle>
          <CardDescription>Loading your exam assignments...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-muted rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Assigned Exams</CardTitle>
          <CardDescription>Error loading exam assignments</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-red-600 dark:text-red-400">Failed to load your assigned exams. Please try again later.</p>
        </CardContent>
      </Card>
    );
  }

  if (exams.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Assigned Exams</CardTitle>
          <CardDescription>No exams have been assigned to you yet</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Contact your administrator to get exam assignments.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Your Assigned Exams</CardTitle>
          <CardDescription>
            Exams that have been assigned to you for certification
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {exams.map((exam) => (
              <div key={exam.id} className="border border-border rounded-lg p-4 hover:shadow-sm transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-lg text-foreground">{exam.title}</h3>
                    {exam.description && (
                      <p className="text-muted-foreground text-sm mt-1">{exam.description}</p>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    {exam.category && (
                      <Badge variant="secondary">{exam.category}</Badge>
                    )}
                    {exam.difficulty && (
                      <Badge variant="outline">{exam.difficulty}</Badge>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center space-x-1">
                    <BookOpen className="w-4 h-4" />
                    <span>{exam.total_questions} questions</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{exam.duration_minutes} minutes</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Award className="w-4 h-4" />
                    <span>{exam.passing_percentage}% to pass</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>Assigned {new Date(exam.assigned_at).toLocaleDateString()}</span>
                  </div>
                </div>
                
                <Button onClick={() => handleStartExam(exam)} className="w-full">
                  Start Exam
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {selectedExam && (
        <ExamModeSelector
          isOpen={showModeSelector}
          onOpenChange={setShowModeSelector}
          examTitle={selectedExam.title}
          totalQuestions={selectedExam.total_questions}
          onModeSelect={handleModeSelect}
        />
      )}
    </>
  );
};

export default AssignedExams;
