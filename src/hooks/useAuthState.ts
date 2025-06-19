
import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface UserStatus {
  isAdmin: boolean;
  isApproved: boolean;
  approvalStatus: 'pending' | 'approved' | 'rejected' | null;
  emailVerified: boolean;
}

export const useAuthState = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [userStatus, setUserStatus] = useState<UserStatus>({
    isAdmin: false,
    isApproved: false,
    approvalStatus: null,
    emailVerified: false
  });

  const checkUserStatus = async (user: User) => {
    try {
      console.log('Checking user status for:', user.id);
      
      const userEmailVerified = user.email_confirmed_at !== null;
      console.log('Supabase email verified:', userEmailVerified);
      
      const { data, error } = await supabase
        .from('user_profiles')
        .select('role, admin_approved, approval_status, email_verified')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error checking user status:', error);
        return;
      }

      console.log('User status data:', data);
      
      // Update email_verified status in the database if it doesn't match Supabase auth
      if (userEmailVerified && !data?.email_verified) {
        console.log('Updating email_verified status in database');
        const { error: updateError } = await supabase
          .from('user_profiles')
          .update({ 
            email_verified: true,
            updated_at: new Date().toISOString()
          })
          .eq('id', user.id);
          
        if (updateError) {
          console.error('Error updating email verification status:', updateError);
        }
      }
      
      const userIsAdmin = data?.role === 'admin';
      const userIsApproved = data?.admin_approved || false;
      const userApprovalStatus = data?.approval_status as 'pending' | 'approved' | 'rejected' | null;
      
      setUserStatus({
        isAdmin: userIsAdmin,
        isApproved: userIsApproved,
        approvalStatus: userApprovalStatus || 'pending',
        emailVerified: userEmailVerified
      });
      
      console.log('Updated auth state:', {
        isAdmin: userIsAdmin,
        isApproved: userIsApproved,
        approvalStatus: userApprovalStatus || 'pending',
        emailVerified: userEmailVerified
      });
    } catch (error) {
      console.error('Could not check user status:', error);
    }
  };

  useEffect(() => {
    let mounted = true;
    
    console.log('Setting up auth listeners');
    
    // Clear any stale auth data from localStorage on mount
    const clearStaleAuth = () => {
      try {
        const authKey = `sb-mqycxtydeqhwvdsjuuwo-auth-token`;
        const storedAuth = localStorage.getItem(authKey);
        if (storedAuth) {
          const parsed = JSON.parse(storedAuth);
          if (parsed.expires_at && new Date(parsed.expires_at * 1000) < new Date()) {
            localStorage.removeItem(authKey);
            console.log('Cleared expired auth token');
          }
        }
      } catch (error) {
        console.error('Error checking auth token:', error);
      }
    };

    clearStaleAuth();
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth event:', event, 'has session:', !!session);
        
        if (!mounted) return;
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          setTimeout(() => {
            if (mounted) {
              checkUserStatus(session.user);
            }
          }, 0);
        } else {
          setUserStatus({
            isAdmin: false,
            isApproved: false,
            approvalStatus: null,
            emailVerified: false
          });
        }
        
        setLoading(false);
      }
    );

    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!mounted) return;
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          setTimeout(() => {
            if (mounted) {
              checkUserStatus(session.user);
            }
          }, 0);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error getting initial session:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    getInitialSession();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return {
    user,
    session,
    loading,
    ...userStatus,
    checkUserStatus
  };
};
