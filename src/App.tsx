
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import UserProfilePage from "./pages/UserProfilePage";
import AdminDashboard from "./pages/AdminDashboard";
import ExamManagement from "./pages/ExamManagement";
import QuestionManagement from "./pages/QuestionManagement";
import ExamPage from "./pages/ExamPage";
import ExamBrowsePage from "./pages/ExamBrowsePage";
import UserManagementPage from "./pages/UserManagementPage";
import ExamAssignmentPage from "./pages/ExamAssignmentPage";

function App() {
  const queryClient = new QueryClient();

  return (
    <ThemeProvider defaultTheme="system" storageKey="prep-vault-theme">
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <div className="min-h-screen bg-background transition-colors duration-300">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<UserProfilePage />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/exams" element={<ExamManagement />} />
                <Route path="/admin/questions" element={<QuestionManagement />} />
                <Route path="/admin/users" element={<UserManagementPage />} />
                <Route path="/admin/assignments" element={<ExamAssignmentPage />} />
                <Route path="/exam/:id" element={<ExamPage />} />
                <Route path="/exams" element={<ExamBrowsePage />} />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </div>
            <Toaster />
          </BrowserRouter>
        </QueryClientProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
