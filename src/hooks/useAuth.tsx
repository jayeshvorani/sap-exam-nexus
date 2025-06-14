
import { useState, useEffect, createContext, useContext } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/integrations/supabase/client'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  isAdmin: boolean
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

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session:', session)
      setSession(session)
      setUser(session?.user ?? null)
      checkUserRole(session?.user)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session)
        setSession(session)
        setUser(session?.user ?? null)
        checkUserRole(session?.user)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const checkUserRole = async (user: User | null) => {
    if (!user) {
      setIsAdmin(false)
      return
    }

    try {
      console.log('Checking user role for:', user.id)
      const { data, error } = await supabase
        .from('user_profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      if (error) {
        console.error('Error checking user role:', error)
        setIsAdmin(false)
        return
      }

      console.log('User role data:', data)
      setIsAdmin(data?.role === 'admin')
    } catch (error) {
      console.error('Could not check user role:', error)
      setIsAdmin(false)
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
