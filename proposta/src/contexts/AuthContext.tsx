
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User as SupabaseUser } from '@supabase/supabase-js';
import { useToast } from '@/components/ui/use-toast';

// Estendendo o tipo User para incluir os campos personalizados
export interface User extends SupabaseUser {
  name?: string;
  companyLogo?: string;
  companyName?: string;
  location?: string;
}

interface Profile {
  id: string;
  name?: string;
  companyLogo?: string;
  companyName?: string;
  location?: string;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (data: Partial<Profile>) => Promise<void>;
  session: Session | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        
        // Adiciona os dados do perfil ao objeto de usuário
        if (session?.user) {
          const enhancedUser = {
            ...session.user,
          } as User;
          setUser(enhancedUser);
          
          // Usar setTimeout para evitar problemas com o listener de autenticação
          setTimeout(() => {
            fetchProfile(session.user.id);
          }, 0);
        } else {
          setUser(null);
          setProfile(null);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      
      if (session?.user) {
        const enhancedUser = {
          ...session.user,
        } as User;
        setUser(enhancedUser);
        fetchProfile(session.user.id);
      } else {
        setUser(null);
        setProfile(null);
      }
      
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        
        // Se não encontrar um perfil, tenta criá-lo
        if (error.code === 'PGRST116') {
          await createInitialProfile(userId);
          return;
        }
        return;
      }

      if (data) {
        const profileData = {
          id: data.id,
          name: data.name,
          companyName: data.company_name,
          companyLogo: data.company_logo,
          location: data.location,
        };
        
        setProfile(profileData);
        
        // Atualizando o objeto user com os dados do perfil
        setUser(prev => {
          if (!prev) return null;
          return {
            ...prev,
            name: data.name,
            companyName: data.company_name,
            companyLogo: data.company_logo,
            location: data.location
          } as User;
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  // Fixed and improved RPC call handling
  const createInitialProfile = async (userId: string) => {
    try {
      // Obter os metadados do usuário
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not found');
      }
      
      const name = user.user_metadata?.name || user.email?.split('@')[0] || 'Usuário';
      
      // Criar o perfil com permissões de autenticação
      const { error } = await supabase.auth.updateUser({
        data: { name }
      });
      
      if (error) throw error;
      
      // Instead of using RPC, create profile directly
      try {
        // Try to insert directly into profiles table
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: userId,
            name: name
          });
          
        if (insertError) {
          console.error('Failed to create profile directly:', insertError);
        }
      } catch (directError) {
        console.error('Failed to create profile:', directError);
      }
      
      // Tentar novamente buscar o perfil
      setTimeout(() => {
        fetchProfile(userId);
      }, 1000);
      
    } catch (error) {
      console.error('Error creating initial profile:', error);
      // Em caso de erro, permitir que o usuário continue mesmo sem perfil
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      // Auth state listener will handle setting user and profile
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        title: "Erro no login",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Fixed and improved register function
  const register = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      });
      
      if (error) throw error;
      
      // Create profile directly instead of using RPC
      if (data.user) {
        try {
          // Insert directly into profiles table
          const { error: insertError } = await supabase
            .from('profiles')
            .insert({
              id: data.user.id,
              name: name
            });
            
          if (insertError) {
            console.error('Failed to create profile directly:', insertError);
          }
        } catch (directError) {
          console.error('Failed to create profile:', directError);
        }
      }
      
      toast({
        title: "Cadastro realizado!",
        description: "Seja bem-vindo ao PropostaPro!",
      });
      
      // Auth state listener will handle setting user and profile
    } catch (error: any) {
      console.error('Registration error:', error);
      toast({
        title: "Erro no cadastro",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      // Auth state listener will handle clearing user and profile
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const updateUserProfile = async (data: Partial<Profile>) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name: data.name,
          company_name: data.companyName,
          company_logo: data.companyLogo,
          location: data.location,
        })
        .eq('id', user.id);
        
      if (error) throw error;
      
      // Update local profile state
      setProfile(prev => prev ? { ...prev, ...data } : null);
      
      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram atualizadas com sucesso!",
      });
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        title: "Erro ao atualizar perfil",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      isAuthenticated: !!user,
      isLoading,
      login,
      register,
      logout,
      updateUserProfile,
      session
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
