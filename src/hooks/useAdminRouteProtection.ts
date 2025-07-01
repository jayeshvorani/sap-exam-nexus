
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth';

export const useAdminRouteProtection = () => {
  const { user, loading, isAdmin, adminLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Don't redirect while still loading
    if (loading || adminLoading) {
      return;
    }

    // If no user after loading is complete, redirect to home
    if (!user) {
      navigate("/", { replace: true });
      return;
    }

    // If user exists but is not admin after admin check is complete, redirect to dashboard
    if (!isAdmin) {
      navigate("/dashboard", { replace: true });
      return;
    }
  }, [user, isAdmin, loading, adminLoading, navigate]);

  // Return loading state - components should show loading while auth is being determined
  return {
    isLoading: loading || adminLoading,
    isAuthorized: user && isAdmin && !loading && !adminLoading
  };
};
