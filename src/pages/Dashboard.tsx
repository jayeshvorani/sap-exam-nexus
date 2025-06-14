
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useUserStats } from "@/hooks/useUserStats";
import AccessDeniedView from "@/components/auth/AccessDeniedView";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import WelcomeSection from "@/components/dashboard/WelcomeSection";
import StatsCards from "@/components/dashboard/StatsCards";
import QuickActions from "@/components/dashboard/QuickActions";
import RecentActivity from "@/components/dashboard/RecentActivity";
import DashboardLoading from "@/components/dashboard/DashboardLoading";

const Dashboard = () => {
  const { user, loading, isAdmin, isApproved, emailVerified, signOut } = useAuth();
  const navigate = useNavigate();
  const { stats, loading: statsLoading } = useUserStats();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/");
    }
  }, [user, loading, navigate]);

  const handleBrowseExams = () => {
    alert("Exam browsing feature is coming soon! Please check back later.");
  };

  const handleStartPractice = () => {
    alert("Practice mode is coming soon! Please check back later.");
  };

  if (loading) {
    return <DashboardLoading />;
  }

  if (!user) {
    return null;
  }

  if (!emailVerified || !isApproved) {
    return <AccessDeniedView />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <DashboardHeader
        onNavigateToProfile={() => navigate("/profile")}
        onNavigateToAdmin={() => navigate("/admin")}
        onSignOut={signOut}
        isAdmin={isAdmin}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <WelcomeSection user={user} />
        
        <StatsCards stats={stats} statsLoading={statsLoading} />
        
        <QuickActions 
          onBrowseExams={handleBrowseExams}
          onStartPractice={handleStartPractice}
        />
        
        <RecentActivity recentAttempts={stats.recentAttempts} />
      </main>
    </div>
  );
};

export default Dashboard;
