
import { useAdminRouteProtection } from "@/hooks/useAdminRouteProtection";
import { useAdminStats } from "@/hooks/useAdminStats";
import AdminDashboardHeader from "@/components/admin/AdminDashboardHeader";
import AdminStatsOverview from "@/components/admin/AdminStatsOverview";
import AdminManagementTools from "@/components/admin/AdminManagementTools";

const AdminDashboard = () => {
  const { stats, loading } = useAdminStats();
  const { isLoading, isAuthorized } = useAdminRouteProtection();

  // Show loading while determining authorization
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-primary flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 gradient-bg rounded-lg flex items-center justify-center mx-auto mb-4 shadow-md">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="text-body text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Only render if authorized (the hook handles redirects)
  if (!isAuthorized) {
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
