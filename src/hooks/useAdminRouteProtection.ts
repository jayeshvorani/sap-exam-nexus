
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth';

export const useAdminRouteProtection = () => {
  const { user, loading, isAdmin, adminLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Only proceed with redirect logic if all loading is complete
    if (loading || adminLoading) {
      return;
    }

    // If no user after loading is complete, redirect to home
    if (!user) {
      console.log('No user found, redirecting to home');
      navigate("/", { replace: true });
      return;
    }

    // If user exists but is not admin after admin check is complete, redirect to dashboard
    if (user && !isAdmin) {
      console.log('User is not admin, redirecting to dashboard');
      navigate("/dashboard", { replace: true });
      return;
    }

    console.log('Admin access confirmed');
  }, [user, isAdmin, loading, adminLoading, navigate]);

  // Return loading state - components should show loading while auth is being determined
  return {
    isLoading: loading || adminLoading,
    isAuthorized: !loading && !adminLoading && user && isAdmin
  };
};
