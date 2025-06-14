
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ExamManagementHeaderProps {
  onAddExam: () => void;
}

export const ExamManagementHeader = ({ onAddExam }: ExamManagementHeaderProps) => {
  const navigate = useNavigate();

  return (
    <>
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Button variant="ghost" onClick={() => navigate("/admin")}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Admin
              </Button>
            </div>
            <div className="flex items-center space-x-3">
              <h1 className="text-xl font-semibold text-gray-900">Exam Management</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Header */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-light text-gray-900 mb-2">Manage Exams</h2>
          <p className="text-gray-600">Create, edit, and configure exams</p>
        </div>

        {/* Add Exam Button */}
        <div className="mb-6">
          <Button onClick={onAddExam}>
            <Plus className="w-4 h-4 mr-2" />
            Add New Exam
          </Button>
        </div>
      </main>
    </>
  );
};
