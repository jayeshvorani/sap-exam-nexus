
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Eye, Trophy, Flag } from "lucide-react";

interface ExamModeSelectorProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  examTitle: string;
  onModeSelect: (mode: 'practice' | 'real') => void;
}

const ExamModeSelector = ({ isOpen, onOpenChange, examTitle, onModeSelect }: ExamModeSelectorProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Select Exam Mode</DialogTitle>
          <DialogDescription>
            Choose how you want to take the exam: {examTitle}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid md:grid-cols-2 gap-4">
          <Card className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-blue-200" 
                onClick={() => onModeSelect('practice')}>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Eye className="w-5 h-5 text-blue-600" />
                <span>Practice Mode</span>
              </CardTitle>
              <CardDescription>
                Learn and practice without time pressure
              </CardDescription>
            </CardHeader>
            <CardContent>
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
              <Button className="w-full" onClick={() => onModeSelect('practice')}>
                Start Practice
              </Button>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-green-200" 
                onClick={() => onModeSelect('real')}>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Trophy className="w-5 h-5 text-green-600" />
                <span>Real Exam</span>
              </CardTitle>
              <CardDescription>
                Take the official exam for certification
              </CardDescription>
            </CardHeader>
            <CardContent>
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
              <Button className="w-full" onClick={() => onModeSelect('real')}>
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
