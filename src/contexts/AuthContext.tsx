import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string, rememberMe?: boolean) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: Error | null }>;
  updatePassword: (newPassword: string) => Promise<{ error: Error | null }>;
  updateProfile: (data: { full_name?: string; phone?: string; bio?: string; location?: string;[key: string]: any }) => Promise<{ error: Error | null }>;
  resendConfirmationEmail: (email: string) => Promise<{ error: Error | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        if (event === 'SIGNED_IN') {
          toast.success('Welcome back!');
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const redirectUrl = `${window.location.origin}/`;

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: fullName,
          }
        }
      });

      if (error) throw error;

      toast.success('Account created successfully!');
      return { error: null };
    } catch (error) {
      const err = error as Error;
      toast.error(err.message);
      return { error: err };
    }
  };

  const signIn = async (email: string, password: string, rememberMe: boolean = false) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // Check if error is related to email confirmation
        const errorMessage = error.message.toLowerCase();
        if (errorMessage.includes('email') && (errorMessage.includes('confirm') || errorMessage.includes('verified') || errorMessage.includes('not confirmed'))) {
          toast.error('Please confirm your email before signing in. Check your inbox for the confirmation link.', {
            duration: 5000,
          });
          throw error;
        } else if (errorMessage.includes('invalid') && errorMessage.includes('credentials')) {
          // Check if user exists in the database
          const { data: userExists } = await supabase
            .from('profiles')
            .select('id')
            .eq('email', email)
            .maybeSingle();

          if (!userExists) {
            // User doesn't exist - create a custom error
            const noAccountError = new Error('NO_ACCOUNT_FOUND');
            toast.error('No account found with this email. Please sign up first.');
            throw noAccountError;
          } else {
            // User exists but wrong password
            const wrongPasswordError = new Error('WRONG_PASSWORD');
            toast.error('Incorrect password. Please try again or reset your password.');
            throw wrongPasswordError;
          }
        } else {
          toast.error(error.message);
          throw error;
        }
      }

      return { error: null };
    } catch (error) {
      const err = error as Error;
      return { error: err };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      toast.success('Signed out successfully');
      navigate('/');
    } catch (error) {
      const err = error as Error;
      toast.error(err.message);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const redirectUrl = `${window.location.origin}/reset-password`;

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl,
      });

      if (error) throw error;

      toast.success('Password reset instructions sent to your email');
      return { error: null };
    } catch (error) {
      const err = error as Error;
      toast.error(err.message);
      return { error: err };
    }
  };

  const updatePassword = async (newPassword: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      toast.success('Password updated successfully');
      return { error: null };
    } catch (error) {
      const err = error as Error;
      toast.error(err.message);
      return { error: err };
    }
  };

  const updateProfile = async (data: { full_name?: string; phone?: string; bio?: string; location?: string; avatar_url?: string;[key: string]: any }) => {
    try {
      // 1. Update auth.users metadata
      const { error: authError } = await supabase.auth.updateUser({
        data: data,
      });

      if (authError) throw authError;

      // 2. Update public.profiles table
      if (user) {
        const profileUpdates = {
          id: user.id,
          full_name: data.full_name,
          phone: data.phone,
          bio: data.bio,
          avatar_url: data.avatar_url,
          // Add location if it exists, mapping it to existing columns or just updating what we can
          // Note: The profiles table might not have 'location' column yet based on migrations I saw.
          // Migration 20251129042006 has full_name, email, phone, avatar_url, bio.
          // Location is in metadata but maybe not in profiles table.
          // I will assume for now we only sync what's in the table.
          updated_at: new Date().toISOString(),
        };

        const { error: profileError } = await supabase
          .from('profiles')
          .upsert(profileUpdates);

        if (profileError) {
          console.error('Error updating public profile:', profileError);
          // We don't throw here to avoid failing if just the sync fails, but good to know
        }
      }

      toast.success('Profile updated successfully');
      return { error: null };
    } catch (error) {
      const err = error as Error;
      toast.error(err.message);
      return { error: err };
    }
  };

  const resendConfirmationEmail = async (email: string) => {
    try {
      const redirectUrl = `${window.location.origin}/`;
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
        options: {
          emailRedirectTo: redirectUrl,
        },
      });

      if (error) throw error;

      toast.success('Confirmation email sent! Please check your inbox.');
      return { error: null };
    } catch (error) {
      const err = error as Error;
      toast.error(err.message || 'Failed to send confirmation email');
      return { error: err };
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signUp, signIn, signOut, resetPassword, updatePassword, updateProfile, resendConfirmationEmail }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};