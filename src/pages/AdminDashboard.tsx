
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useAdminStats } from "@/hooks/useAdminStats";
import AdminDashboardHeader from "@/components/admin/AdminDashboardHeader";
import AdminStatsOverview from "@/components/admin/AdminStatsOverview";
import AdminManagementTools from "@/components/admin/AdminManagementTools";

const AdminDashboard = () => {
  const { user, isAdmin } = useAuth();
  const { stats, loading } = useAdminStats();
  const navigate = useNavigate();

  if (!user || !isAdmin) {
    navigate("/dashboard");
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-primary">
      <AdminDashboardHeader />

      <main className="max-w-7xl mx-auto section-padding">
        <div className="content-spacing">
          <h2 className="text-headline gradient-text mb-2">Administration</h2>
          <p className="text-body text-muted-foreground">Manage exams, questions, and candidates</p>
        </div>

        <AdminStatsOverview stats={stats} loading={loading} />
        
        <AdminManagementTools />
      </main>
    </div>
  );
};

export default AdminDashboard;
