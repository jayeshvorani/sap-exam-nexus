
import { createContext, useContext } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { useAuthState } from './useAuthState';
import { useAuthActions } from './useAuthActions';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAdmin: boolean;
  isApproved: boolean;
  approvalStatus: 'pending' | 'approved' | 'rejected' | null;
  emailVerified: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, username: string, fullName: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const authState = useAuthState();
  const authActions = useAuthActions();

  console.log('AuthProvider State:', { 
    loading: authState.loading, 
    hasUser: !!authState.user, 
    isAdmin: authState.isAdmin, 
    isApproved: authState.isApproved,
    emailVerified: authState.emailVerified,
    userEmail: authState.user?.email 
  });

  const signOut = async () => {
    // Clear local state first by resetting auth state
    await authActions.signOut();
  };

  const value = {
    ...authState,
    ...authActions,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
