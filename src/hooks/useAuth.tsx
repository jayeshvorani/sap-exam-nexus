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

  useEffect(() => {
    // Listen for auth changes first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session)
        setSession(session)
        setUser(session?.user ?? null)
        
        if (session?.user) {
          // Check user status after setting the session
          setTimeout(() => {
            checkUserStatus(session.user)
          }, 100)
        } else {
          // Reset all status when no user
          setIsAdmin(false)
          setIsApproved(false)
          setApprovalStatus(null)
          setEmailVerified(false)
        }
        setLoading(false)
      }
    )

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session:', session)
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) {
        checkUserStatus(session.user)
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const checkUserStatus = async (user: User | null) => {
    if (!user) {
      setIsAdmin(false)
      setIsApproved(false)
      setApprovalStatus(null)
      setEmailVerified(false)
      return
    }

    try {
      console.log('Checking user status for:', user.id, 'Email:', user.email)
      const { data, error } = await supabase
        .from('user_profiles')
        .select('role, admin_approved, approval_status, email_verified')
        .eq('id', user.id)
        .single()

      if (error) {
        console.error('Error checking user status:', error)
        setIsAdmin(false)
        setIsApproved(false)
        setApprovalStatus(null)
        setEmailVerified(false)
        return
      }

      console.log('User status data:', data)
      console.log('Raw database values:', {
        role: data?.role,
        admin_approved: data?.admin_approved,
        approval_status: data?.approval_status,
        email_verified: data?.email_verified,
        user_email_confirmed_at: user.email_confirmed_at
      })
      
      setIsAdmin(data?.role === 'admin')
      setIsApproved(data?.admin_approved || false)
      
      const status = data?.approval_status as 'pending' | 'approved' | 'rejected' | null
      setApprovalStatus(status || 'pending')
      
      // Use the auth user's email_confirmed_at as the source of truth for email verification
      const isEmailVerified = user.email_confirmed_at !== null
      setEmailVerified(isEmailVerified)
      
      console.log('Final auth state:', {
        isAdmin: data?.role === 'admin',
        isApproved: data?.admin_approved || false,
        approvalStatus: status || 'pending',
        emailVerified: isEmailVerified
      })
      
      // If there's a mismatch, update the database
      if (data?.email_verified !== isEmailVerified) {
        console.log('Updating email verification status in database')
        const { error: updateError } = await supabase
          .from('user_profiles')
          .update({ 
            email_verified: isEmailVerified,
            updated_at: new Date().toISOString()
          })
          .eq('id', user.id)

        if (updateError) {
          console.error('Error updating email verification status:', updateError)
        }
      }
    } catch (error) {
      console.error('Could not check user status:', error)
      setIsAdmin(false)
      setIsApproved(false)
      setApprovalStatus(null)
      setEmailVerified(false)
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
