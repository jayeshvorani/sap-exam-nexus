
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAdminStats } from "@/hooks/useAdminStats";
import AccessDeniedView from "@/components/auth/AccessDeniedView";
import AdminDashboardHeader from "@/components/admin/AdminDashboardHeader";
import AdminStatsOverview from "@/components/admin/AdminStatsOverview";
import AdminRecentActivity from "@/components/admin/AdminRecentActivity";
import AdminManagementTools from "@/components/admin/AdminManagementTools";
import DashboardLoading from "@/components/dashboard/DashboardLoading";

const AdminDashboard = () => {
  const { user, loading, isAdmin, emailVerified } = useAuth();
  const navigate = useNavigate();
  const { stats, loading: statsLoading } = useAdminStats();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return <DashboardLoading />;
  }

  if (!user) {
    return null;
  }

  if (!emailVerified || !isAdmin) {
    return <AccessDeniedView />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      <AdminDashboardHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-light text-foreground mb-2">
            Admin Dashboard
          </h2>
          <p className="text-muted-foreground">Manage your certification platform</p>
        </div>

        <AdminStatsOverview stats={stats} loading={statsLoading} />
        
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <AdminManagementTools />
          <AdminRecentActivity recentActivity={stats.recentActivity} />
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
