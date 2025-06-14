
import { useState, useEffect, createContext, useContext } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/integrations/supabase/client'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  isAdmin: boolean
  isApproved: boolean
  approvalStatus: 'pending' | 'approved' | 'rejected' | null
  emailVerified: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, username: string, fullName: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isApproved, setIsApproved] = useState(false)
  const [approvalStatus, setApprovalStatus] = useState<'pending' | 'approved' | 'rejected' | null>(null)
  const [emailVerified, setEmailVerified] = useState(false)
  const [isCheckingStatus, setIsCheckingStatus] = useState(false)

  console.log('=== AuthProvider State ===');
  console.log('Loading:', loading);
  console.log('User:', user?.id);
  console.log('Session exists:', !!session);
  console.log('IsAdmin:', isAdmin);
  console.log('IsApproved:', isApproved);
  console.log('IsCheckingStatus:', isCheckingStatus);
  console.log('==========================');

  useEffect(() => {
    let mounted = true;
    
    console.log('=== Setting up auth listeners ===');
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change event:', event, 'Session exists:', !!session);
        
        if (!mounted) {
          console.log('Component unmounted, ignoring auth change');
          return;
        }
        
        setSession(session)
        setUser(session?.user ?? null)
        
        if (session?.user && !isCheckingStatus) {
          console.log('User found, scheduling status check...');
          // Use setTimeout to avoid blocking the auth state change
          setTimeout(() => {
            if (mounted) {
              checkUserStatus(session.user);
            }
          }, 100);
        } else if (!session?.user) {
          console.log('No user, resetting auth state');
          resetAuthState();
        }
        
        setLoading(false)
      }
    )

    // Get initial session
    const getInitialSession = async () => {
      try {
        console.log('Getting initial session...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting initial session:', error);
          setLoading(false);
          return;
        }
        
        console.log('Initial session:', !!session);
        
        if (!mounted) return;
        
        setSession(session)
        setUser(session?.user ?? null)
        
        if (session?.user) {
          setTimeout(() => {
            if (mounted) {
              checkUserStatus(session.user);
            }
          }, 100);
        } else {
          resetAuthState();
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error in getInitialSession:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    getInitialSession();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    }
  }, [])

  const resetAuthState = () => {
    console.log('Resetting auth state');
    setIsAdmin(false);
    setIsApproved(false);
    setApprovalStatus(null);
    setEmailVerified(false);
    setIsCheckingStatus(false);
  };

  const checkUserStatus = async (user: User) => {
    if (!user || isCheckingStatus) {
      console.log('Skipping user status check - no user or already checking');
      return;
    }

    try {
      console.log('Checking user status for:', user.id);
      setIsCheckingStatus(true);
      
      const { data, error } = await supabase
        .from('user_profiles')
        .select('role, admin_approved, approval_status, email_verified')
        .eq('id', user.id)
        .single()

      if (error) {
        console.error('Error checking user status:', error)
        resetAuthState();
        return
      }

      console.log('User status data received:', data)
      
      const userIsAdmin = data?.role === 'admin';
      const userIsApproved = data?.admin_approved || false;
      const userStatus = data?.approval_status as 'pending' | 'approved' | 'rejected' | null;
      const userEmailVerified = user.email_confirmed_at !== null;
      
      setIsAdmin(userIsAdmin);
      setIsApproved(userIsApproved);
      setApprovalStatus(userStatus || 'pending');
      setEmailVerified(userEmailVerified);
      
      console.log('Updated auth state:', {
        isAdmin: userIsAdmin,
        isApproved: userIsApproved,
        approvalStatus: userStatus || 'pending',
        emailVerified: userEmailVerified
      });
      
      // Update email verification in database if needed
      if (data?.email_verified !== userEmailVerified) {
        console.log('Updating email verification status in database');
        const { error: updateError } = await supabase
          .from('user_profiles')
          .update({ 
            email_verified: userEmailVerified,
            updated_at: new Date().toISOString()
          })
          .eq('id', user.id)

        if (updateError) {
          console.error('Error updating email verification status:', updateError)
        }
      }
    } catch (error) {
      console.error('Could not check user status:', error)
      resetAuthState();
    } finally {
      setIsCheckingStatus(false);
    }
  }

  const signIn = async (email: string, password: string) => {
    console.log('Attempting to sign in with email:', email)
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) {
      console.error('Sign in error:', error)
      throw error
    }
    console.log('Sign in successful')
  }

  const signUp = async (email: string, password: string, username: string, fullName: string) => {
    console.log('Attempting to sign up with email:', email, 'username:', username)
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: {
          username,
          full_name: fullName,
        }
      }
    })
    
    if (error) {
      console.error('Sign up error:', error)
      throw error
    }
    
    console.log('Sign up successful:', data)
  }

  const signOut = async () => {
    console.log('Signing out...')
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('Sign out error:', error)
      throw error
    }
    console.log('Sign out successful')
  }

  const value = {
    user,
    session,
    loading,
    isAdmin,
    isApproved,
    approvalStatus,
    emailVerified,
    signIn,
    signUp,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
