
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Clock, Eye, Trophy, Flag, Shuffle, ListOrdered } from "lucide-react";
import { useState } from "react";

interface ExamModeSelectorProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  examTitle: string;
  totalQuestions: number;
  onModeSelect: (mode: 'practice' | 'real', options: {
    questionCount?: number;
    randomizeQuestions: boolean;
    randomizeAnswers: boolean;
  }) => void;
}

const ExamModeSelector = ({ isOpen, onOpenChange, examTitle, totalQuestions, onModeSelect }: ExamModeSelectorProps) => {
  const [practiceQuestionCount, setPracticeQuestionCount] = useState(totalQuestions);
  const [practiceRandomizeQuestions, setPracticeRandomizeQuestions] = useState(false);
  const [practiceRandomizeAnswers, setPracticeRandomizeAnswers] = useState(false);
  const [realRandomizeQuestions, setRealRandomizeQuestions] = useState(false);
  const [realRandomizeAnswers, setRealRandomizeAnswers] = useState(false);

  const handlePracticeStart = () => {
    onModeSelect('practice', {
      questionCount: practiceQuestionCount,
      randomizeQuestions: practiceRandomizeQuestions,
      randomizeAnswers: practiceRandomizeAnswers
    });
  };

  const handleRealExamStart = () => {
    onModeSelect('real', {
      randomizeQuestions: realRandomizeQuestions,
      randomizeAnswers: realRandomizeAnswers
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Select Exam Mode</DialogTitle>
          <DialogDescription>
            Choose how you want to take the exam: {examTitle}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-2 hover:border-blue-200 flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Eye className="w-5 h-5 text-blue-600" />
                <span>Practice Mode</span>
              </CardTitle>
              <CardDescription>
                Learn and practice without time pressure
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <ul className="space-y-2 text-sm text-gray-600 mb-4">
                <li className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>No time limit</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Eye className="w-4 h-4" />
                  <span>Show answer button available</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Flag className="w-4 h-4" />
                  <span>Flag questions for review</span>
                </li>
                <li className="text-orange-600">• Results not recorded</li>
              </ul>

              <div className="space-y-4 border-t pt-4 mb-4">
                <div className="space-y-2">
                  <Label htmlFor="practice-question-count">Number of Questions</Label>
                  <Input
                    id="practice-question-count"
                    type="number"
                    min="1"
                    max={totalQuestions}
                    value={practiceQuestionCount}
                    onChange={(e) => setPracticeQuestionCount(Math.min(parseInt(e.target.value) || 1, totalQuestions))}
                    className="w-full"
                  />
                  <p className="text-xs text-gray-500">Maximum: {totalQuestions} questions</p>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="practice-randomize-questions"
                    checked={practiceRandomizeQuestions}
                    onCheckedChange={(checked) => setPracticeRandomizeQuestions(checked === true)}
                  />
                  <Label htmlFor="practice-randomize-questions" className="flex items-center space-x-2 text-sm cursor-pointer">
                    <Shuffle className="w-4 h-4" />
                    <span>Randomize question order</span>
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="practice-randomize-answers"
                    checked={practiceRandomizeAnswers}
                    onCheckedChange={(checked) => setPracticeRandomizeAnswers(checked === true)}
                  />
                  <Label htmlFor="practice-randomize-answers" className="flex items-center space-x-2 text-sm cursor-pointer">
                    <ListOrdered className="w-4 h-4" />
                    <span>Randomize answer options</span>
                  </Label>
                </div>
              </div>

              <Button className="w-full mt-auto" onClick={handlePracticeStart}>
                Start Practice
              </Button>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-green-200 flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Trophy className="w-5 h-5 text-green-600" />
                <span>Real Exam</span>
              </CardTitle>
              <CardDescription>
                Take the official exam for certification
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <ul className="space-y-2 text-sm text-gray-600 mb-4">
                <li className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>Timed exam</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Trophy className="w-4 h-4" />
                  <span>Official certification attempt</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Flag className="w-4 h-4" />
                  <span>Flag questions for review</span>
                </li>
                <li className="text-green-600">• Results recorded permanently</li>
              </ul>

              <div className="space-y-4 border-t pt-4 mb-4">
                <div className="text-sm text-gray-600">
                  <strong>Questions:</strong> All {totalQuestions} questions
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="real-randomize-questions"
                    checked={realRandomizeQuestions}
                    onCheckedChange={(checked) => setRealRandomizeQuestions(checked === true)}
                  />
                  <Label htmlFor="real-randomize-questions" className="flex items-center space-x-2 text-sm cursor-pointer">
                    <Shuffle className="w-4 h-4" />
                    <span>Randomize question order</span>
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="real-randomize-answers"
                    checked={realRandomizeAnswers}
                    onCheckedChange={(checked) => setRealRandomizeAnswers(checked === true)}
                  />
                  <Label htmlFor="real-randomize-answers" className="flex items-center space-x-2 text-sm cursor-pointer">
                    <ListOrdered className="w-4 h-4" />
                    <span>Randomize answer options</span>
                  </Label>
                </div>

                {/* Add empty space to match practice mode height */}
                <div className="h-[72px]"></div>
              </div>

              <Button className="w-full mt-auto" onClick={handleRealExamStart}>
                Start Real Exam
              </Button>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExamModeSelector;
