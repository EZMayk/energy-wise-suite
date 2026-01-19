import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import { toast } from "sonner";
import { useLanguage } from '@/contexts/LanguageContext';

export const useAuth = () => {
  const { t } = useLanguage();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        // Defer role check
        if (session?.user) {
          setTimeout(() => {
            checkUserRole(session.user.id);
          }, 0);
        } else {
          setIsAdmin(false);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        checkUserRole(session.user.id);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkUserRole = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .eq("role", "admin")
        .maybeSingle();

      if (error) throw error;
      setIsAdmin(!!data);
    } catch (error) {
      console.error("Error checking user role:", error);
      setIsAdmin(false);
    }
  };

  const signUp = async (email: string, password: string, nombre: string) => {
    try {
      const redirectUrl = `${window.location.origin}/`;
      const start = Date.now();
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            nombre: nombre
          }
        }
      });

      const duration = Date.now() - start;
      // record db/auth latency metric
      try {
        await supabase.from('metricas_usabilidad').insert({
          user_id: null,
          formulario: 'auth',
          accion: 'db_latency_signup',
          metadata: { ms: duration, success: !error }
        });
      } catch (e) {
        console.warn('Could not record signup latency metric', e);
      }

      if (error) throw error;

      toast.success(t('auth_register_success') ?? "Registro exitoso. Por favor, revisa tu email para confirmar tu cuenta.");
      return { error: null };
    } catch (error: any) {
      toast.error(error.message || (t('auth_register_error') ?? "Error al registrarse"));
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      // Try to fetch the profile id for this email so we can check lockout state
      let profileId: string | null = null;
      try {
        const { data: pData, error: pErr } = await supabase.from('profiles').select('id').eq('email', email).maybeSingle();
        if (!pErr && pData) profileId = (pData as any).id;
      } catch (e) {
        console.warn('Could not lookup profile for lock check', e);
      }

      // If we found a profile id, ask the DB if the user is currently locked
      if (profileId) {
        try {
          const { data: locked, error: lockedErr } = await (supabase as any).rpc('user_locked', { p_user: profileId, p_window_minutes: 15, p_max_attempts: 3 });
          if (!lockedErr) {
            // RPC may return boolean directly, or array; normalize
            const isLocked = Array.isArray(locked) ? !!locked[0] : !!locked;
            if (isLocked) {
              try {
                await supabase.from('metricas_usabilidad').insert({ user_id: profileId, formulario: 'auth', accion: 'login_locked', metadata: { reason: 'too_many_failed_attempts' } });
              } catch (e) {}
              throw new Error('Cuenta bloqueada temporalmente por múltiples intentos fallidos. Intenta de nuevo más tarde.');
            }
          }
        } catch (e) {
          console.warn('Lock check rpc failed', e);
        }
      }

      const start = Date.now();
      const { error, data } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      const duration = Date.now() - start;
      try {
        await supabase.from('metricas_usabilidad').insert({
          user_id: profileId,
          formulario: 'auth',
          accion: 'db_latency_signin',
          metadata: { ms: duration, success: !error }
        });
      } catch (e) {
        console.warn('Could not record signin latency metric', e);
      }

      if (error) {
        // Login failed: record a generic metric (we cannot reliably insert into login_attempts for unauthenticated attempts)
        try {
          await supabase.from('metricas_usabilidad').insert({ user_id: profileId, formulario: 'auth', accion: 'login_failed', metadata: { email, msg: error.message } });
        } catch (e) {}
        throw error;
      }

      // On success, record a successful login attempt in login_attempts if possible
        try {
        const sessionUserId = data?.session?.user?.id ?? profileId;
        if (sessionUserId) {
          await (supabase as any).from('login_attempts').insert({ user_id: sessionUserId, ip: null, user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : null, succeeded: true });
        }
      } catch (e) {
        // ignore; may fail if migration/policy not applied
        console.warn('Could not write login_attempts row (migration/policy may not be applied)', e);
      }

      toast.success(t('auth_welcome') ?? "¡Bienvenido a EcoSense!");
      return { error: null };
    } catch (error: any) {
      toast.error(error.message || (t('auth_signin_error') ?? "Error al iniciar sesión"));
      return { error };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast.success(t('auth_signout_success') ?? "Sesión cerrada correctamente");
      return { error: null };
    } catch (error: any) {
      toast.error(error.message || (t('auth_signout_error') ?? "Error al cerrar sesión"));
      return { error };
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const redirectUrl = `${window.location.origin}/auth?mode=reset`;
      const start = Date.now();
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl,
      });

      const duration = Date.now() - start;
      try {
        await supabase.from('metricas_usabilidad').insert({
          user_id: null,
          formulario: 'auth',
          accion: 'db_latency_reset',
          metadata: { ms: duration, success: !error }
        });
      } catch (e) {
        console.warn('Could not record reset latency metric', e);
      }

      if (error) throw error;

      toast.success(t('auth_reset_sent') ?? "Revisa tu email para restablecer tu contraseña");
      try {
        await supabase.from('metricas_usabilidad').insert({
          user_id: null,
          formulario: 'auth',
          accion: 'reset_sent',
          metadata: { email, timestamp: new Date().toISOString() }
        });
      } catch (e) {
        console.warn('Could not record reset_sent metric', e);
      }
      return { error: null };
    } catch (error: any) {
      toast.error(error.message || (t('auth_reset_error') ?? "Error al enviar email de recuperación"));
      return { error };
    }
  };

  return {
    user,
    session,
    loading,
    isAdmin,
    signUp,
    signIn,
    signOut,
    resetPassword,
  };
};
