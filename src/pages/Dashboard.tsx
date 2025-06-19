
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useUserStats } from "@/hooks/useUserStats";
import AccessDeniedView from "@/components/auth/AccessDeniedView";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import WelcomeSection from "@/components/dashboard/WelcomeSection";
import StatsCards from "@/components/dashboard/StatsCards";
import AssignedExams from "@/components/dashboard/AssignedExams";
import RecentActivity from "@/components/dashboard/RecentActivity";
import DashboardLoading from "@/components/dashboard/DashboardLoading";

const Dashboard = () => {
  const { user, loading, isAdmin, isApproved, emailVerified, signOut } = useAuth();
  const navigate = useNavigate();
  const { stats, loading: statsLoading } = useUserStats();

  console.log('Dashboard - Auth state:', { 
    loading, 
    hasUser: !!user, 
    userEmail: user?.email,
    isAdmin, 
    isApproved, 
    emailVerified 
  });

  useEffect(() => {
    if (!loading && !user) {
      console.log('No user found, redirecting to home');
      navigate("/");
    }
  }, [user, loading, navigate]);

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
    <div className="min-h-screen bg-gradient-primary">
      <DashboardHeader
        onNavigateToProfile={() => navigate("/profile")}
        onNavigateToAdmin={() => navigate("/admin")}
        onSignOut={signOut}
        isAdmin={isAdmin}
      />

      <main className="max-w-7xl mx-auto section-padding">
        <WelcomeSection user={user} />
        
        <StatsCards stats={stats} statsLoading={statsLoading} />
        
        <AssignedExams />
        
        <RecentActivity recentAttempts={stats.recentAttempts} />
      </main>
    </div>
  );
};

export default Dashboard;
