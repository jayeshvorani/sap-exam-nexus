
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

  console.log('AuthProvider State:', { 
    loading, 
    hasUser: !!user, 
    isAdmin, 
    isApproved,
    userEmail: user?.email 
  });

  useEffect(() => {
    let mounted = true;
    
    console.log('Setting up auth listeners');
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth event:', event, 'has session:', !!session);
        
        if (!mounted) return;
        
        setSession(session)
        setUser(session?.user ?? null)
        
        if (session?.user) {
          // Check user status without blocking
          checkUserStatus(session.user);
        } else {
          // Reset all auth-related state
          setIsAdmin(false);
          setIsApproved(false);
          setApprovalStatus(null);
          setEmailVerified(false);
        }
        
        setLoading(false)
      }
    )

    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!mounted) return;
        
        setSession(session)
        setUser(session?.user ?? null)
        
        if (session?.user) {
          checkUserStatus(session.user);
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
    }
  }, [])

  const checkUserStatus = async (user: User) => {
    try {
      console.log('Checking user status for:', user.id);
      
      const { data, error } = await supabase
        .from('user_profiles')
        .select('role, admin_approved, approval_status, email_verified')
        .eq('id', user.id)
        .single()

      if (error) {
        console.error('Error checking user status:', error)
        return
      }

      console.log('User status data:', data)
      
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
    } catch (error) {
      console.error('Could not check user status:', error)
    }
  }

  const signIn = async (email: string, password: string) => {
    console.log('Signing in with email:', email)
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) {
      console.error('Sign in error:', error)
      throw error
    }
  }

  const signUp = async (email: string, password: string, username: string, fullName: string) => {
    console.log('Signing up with email:', email)
    
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
