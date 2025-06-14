
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Flag, CheckCircle } from "lucide-react";

interface Answer {
  id: string;
  text: string;
  isCorrect?: boolean; // Only shown in demo mode
}

interface Question {
  id: string;
  text: string;
  answers: Answer[];
  explanation?: string;
  category: string;
}

interface ExamQuestionProps {
  question: Question;
  selectedAnswer: string | null;
  onAnswerSelect: (answerId: string) => void;
  isFlagged: boolean;
  onToggleFlag: () => void;
  isDemo: boolean;
  showAnswer?: boolean;
  questionNumber: number;
  totalQuestions: number;
}

const ExamQuestion = ({
  question,
  selectedAnswer,
  onAnswerSelect,
  isFlagged,
  onToggleFlag,
  isDemo,
  showAnswer = false,
  questionNumber,
  totalQuestions,
}: ExamQuestionProps) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-medium">
            Question {questionNumber} of {totalQuestions}
            <span className="text-sm text-gray-500 ml-2">({question.category})</span>
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleFlag}
            className={isFlagged ? "text-orange-600" : "text-gray-400"}
          >
            <Flag className={`w-4 h-4 ${isFlagged ? "fill-current" : ""}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-gray-900 leading-relaxed">
          {question.text}
        </div>

        <RadioGroup
          value={selectedAnswer || ""}
          onValueChange={onAnswerSelect}
          className="space-y-3"
        >
          {question.answers.map((answer) => (
            <div
              key={answer.id}
              className={`flex items-start space-x-3 p-3 rounded-lg border transition-colors ${
                selectedAnswer === answer.id
                  ? "border-blue-200 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              } ${
                showAnswer && answer.isCorrect
                  ? "border-green-200 bg-green-50"
                  : ""
              } ${
                showAnswer && selectedAnswer === answer.id && !answer.isCorrect
                  ? "border-red-200 bg-red-50"
                  : ""
              }`}
            >
              <RadioGroupItem value={answer.id} id={answer.id} className="mt-1" />
              <Label htmlFor={answer.id} className="flex-1 cursor-pointer">
                <div className="flex items-start justify-between">
                  <span>{answer.text}</span>
                  {showAnswer && answer.isCorrect && (
                    <CheckCircle className="w-4 h-4 text-green-600 ml-2 flex-shrink-0" />
                  )}
                </div>
              </Label>
            </div>
          ))}
        </RadioGroup>

        {showAnswer && question.explanation && (
          <div className="border-t pt-4">
            <h4 className="font-medium text-gray-900 mb-2">Explanation:</h4>
            <p className="text-gray-700 text-sm leading-relaxed">
              {question.explanation}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ExamQuestion;
