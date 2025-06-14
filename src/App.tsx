
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import Index from '@/pages/Index';
import Dashboard from '@/pages/Dashboard';
import AdminDashboard from '@/pages/AdminDashboard';
import UserManagementPage from '@/pages/UserManagementPage';
import ExamManagement from '@/pages/ExamManagement';
import QuestionManagement from '@/pages/QuestionManagement';
import UserProfilePage from '@/pages/UserProfilePage';
import ExamPage from '@/pages/ExamPage';
import NotFound from '@/pages/NotFound';
import { AuthProvider } from '@/hooks/useAuth';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ExamAssignmentPage from '@/pages/ExamAssignmentPage';
import ExamBrowsePage from '@/pages/ExamBrowsePage';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <div className="min-h-screen bg-background">
            <Toaster />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<UserManagementPage />} />
              <Route path="/admin/exams" element={<ExamManagement />} />
              <Route path="/admin/exam-assignments" element={<ExamAssignmentPage />} />
              <Route path="/admin/questions" element={<QuestionManagement />} />
              <Route path="/profile" element={<UserProfilePage />} />
              <Route path="/browse-exams" element={<ExamBrowsePage />} />
              <Route path="/exam/:id" element={<ExamPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
