
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useAdminStats } from "@/hooks/useAdminStats";
import AdminDashboardHeader from "@/components/admin/AdminDashboardHeader";
import AdminStatsOverview from "@/components/admin/AdminStatsOverview";
import AdminManagementTools from "@/components/admin/AdminManagementTools";
import AdminRecentActivity from "@/components/admin/AdminRecentActivity";

const AdminDashboard = () => {
  const { user, isAdmin } = useAuth();
  const { stats, loading } = useAdminStats();
  const navigate = useNavigate();

  if (!user || !isAdmin) {
    navigate("/dashboard");
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      <AdminDashboardHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-light text-foreground mb-2">Administration</h2>
          <p className="text-muted-foreground">Manage exams, questions, and candidates</p>
        </div>

        <AdminStatsOverview stats={stats} loading={loading} />
        
        <AdminManagementTools />
        
        <AdminRecentActivity recentActivity={stats.recentActivity} />
      </main>
    </div>
  );
};

export default AdminDashboard;
