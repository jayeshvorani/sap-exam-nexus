
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
    <div className="sap-page-container">
      <AdminDashboardHeader />

      <main className="sap-page-content">
        <div className="mb-8">
          <h2 className="sap-page-title">Administration Dashboard</h2>
          <p className="sap-page-subtitle">Manage exams, questions, users and monitor system performance</p>
        </div>

        <AdminStatsOverview stats={stats} loading={loading} />
        
        <AdminManagementTools />
        
        <AdminRecentActivity recentActivity={stats.recentActivity} />
      </main>
    </div>
  );
};

export default AdminDashboard;
