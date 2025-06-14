import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";
import ExamManagement from "./pages/ExamManagement";
import QuestionManagement from "./pages/QuestionManagement";
import Exam from "./pages/Exam";
import ExamReview from "./pages/ExamReview";
import QuestionCreate from "./pages/QuestionCreate";
import QuestionEdit from "./pages/QuestionEdit";
import ExamCreate from "./pages/ExamCreate";
import ExamEdit from "./pages/ExamEdit";

function App() {
  const queryClient = new QueryClient();

  return (
    <ThemeProvider defaultTheme="system" storageKey="prep-vault-theme">
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <div className="min-h-screen bg-background transition-colors duration-300">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/admin/exams" element={<ExamManagement />} />
              <Route path="/admin/exams/create" element={<ExamCreate />} />
              <Route path="/admin/exams/:examId/edit" element={<ExamEdit />} />
              <Route path="/admin/questions" element={<QuestionManagement />} />
              <Route path="/admin/questions/create" element={<QuestionCreate />} />
              <Route path="/admin/questions/:questionId/edit" element={<QuestionEdit />} />
              <Route path="/exam/:examId" element={<Exam />} />
              <Route path="/exam/:examId/review" element={<ExamReview />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
          <Toaster />
        </BrowserRouter>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
