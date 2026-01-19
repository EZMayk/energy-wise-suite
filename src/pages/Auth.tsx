import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useMetrics } from "@/hooks/useMetrics";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Leaf, ArrowLeft, Check, X, Eye, EyeOff } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import { useLanguage } from '@/contexts/LanguageContext';

const loginSchema = z.object({
  email: z.string().email("Email inválido").max(255),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

const passwordRulesRegex = /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}/;

const registerSchema = z.object({
  nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres").max(100),
  email: z.string().email("Email inválido").max(255),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres").refine((p) => passwordRulesRegex.test(p), {
    message: "La contraseña debe incluir mayúsculas, minúsculas, números y un carácter especial",
  }),
  confirmPassword: z.string(),
  acceptedTerms: z.literal(true, { errorMap: () => ({ message: 'Debes aceptar los términos y la política de privacidad' }) }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

const resetSchema = z.object({
  email: z.string().email("Email inválido").max(255),
});

export default function Auth() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { user, signIn, signUp, resetPassword } = useAuth();
  const { trackClick, trackMetric } = useMetrics("auth");

  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [loginErrors, setLoginErrors] = useState<Record<string, string>>({});
  const [registerData, setRegisterData] = useState({
    nombre: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptedTerms: false,
  });
  const [registerErrors, setRegisterErrors] = useState<Record<string, string>>({});
  const [passwordChecks, setPasswordChecks] = useState({
    length: false,
    lower: false,
    upper: false,
    number: false,
    special: false,
  });
  const [resetEmail, setResetEmail] = useState("");
  const [resetError, setResetError] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loginStart, setLoginStart] = useState<number | null>(null);
  const [registerStart, setRegisterStart] = useState<number | null>(null);

  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showRegisterConfirm, setShowRegisterConfirm] = useState(false);
  const [activeTab, setActiveTab] = useState<'login'|'register'>('login');
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [cardScale, setCardScale] = useState(1);

  // Ajusta el scale del card para viewport
  useEffect(() => {
    let raf = 0;
    const adjust = () => {
      const el = cardRef.current;
      if (!el) return;
      el.style.transform = 'none';
      const margin = 48;
      const available = window.innerHeight - margin;
      const rect = el.getBoundingClientRect();
      const height = rect.height;
      if (height > available) {
        const scale = Math.max(0.7, available / height);
        el.style.transformOrigin = 'top center';
        el.style.transform = `scale(${scale})`;
        setCardScale(scale);
      } else {
        el.style.transform = 'none';
        setCardScale(1);
      }
    };

    const schedule = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(adjust);
    };

    schedule();
    window.addEventListener('resize', schedule);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('resize', schedule);
    };
  }, [activeTab, registerData, showRegisterPassword, showRegisterConfirm]);

  const LOCK_THRESHOLD = 3;
  const LOCK_DURATION_MS = 5 * 60 * 1000;
  const [lockedUntil, setLockedUntil] = useState<number | null>(null);
  const [lockTick, setLockTick] = useState(0);

  useEffect(() => {
    if (!lockedUntil) return;
    const id = setInterval(() => setLockTick((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [lockedUntil]);

  useEffect(() => {
    document.body.classList.add('auth-page');
    return () => document.body.classList.remove('auth-page');
  }, []);

  if (user) {
    navigate("/dashboard");
    return null;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    trackClick("login_submit");

    const attemptKey = `login_attempts_${loginData.email.toLowerCase()}`;
    try {
      const raw = localStorage.getItem(attemptKey);
      if (raw) {
        const obj = JSON.parse(raw);
        if (obj.lockedUntil && new Date(obj.lockedUntil).getTime() > Date.now()) {
          setLockedUntil(new Date(obj.lockedUntil).getTime());
          trackMetric({ accion: 'login_locked', metadata: { email: loginData.email } });
          toast.error('Cuenta temporalmente bloqueada por múltiples intentos. Intenta más tarde.');
          return;
        }
      }
    } catch (e) { console.warn('Could not read login attempts', e); }

    const result = loginSchema.safeParse(loginData);
    if (!result.success) {
      const errs: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path && err.path[0]) errs[String(err.path[0])] = err.message;
      });
      setLoginErrors(errs);
      if (!loginStart) setLoginStart(Date.now());
      const firstKey = Object.keys(errs)[0];
      const el = document.getElementById(`login-${firstKey}`) as HTMLElement | null;
      el?.focus();
      return;
    }

    setLoginErrors({});
    setLoading(true);
    if (!loginStart) setLoginStart(Date.now());
    try {
      const { error } = await signIn(loginData.email, loginData.password);
      if (error) {
        try {
          const raw = localStorage.getItem(attemptKey);
          const now = Date.now();
          const obj = raw ? JSON.parse(raw) : { count: 0, firstAttempt: now };
          obj.count = (obj.count || 0) + 1;
          if (obj.count >= LOCK_THRESHOLD) {
            obj.lockedUntil = new Date(now + LOCK_DURATION_MS).toISOString();
            setLockedUntil(new Date(obj.lockedUntil).getTime());
            trackMetric({ accion: 'login_locked', metadata: { email: loginData.email } });
          }
          localStorage.setItem(attemptKey, JSON.stringify(obj));
        } catch (e) { console.warn('Could not persist login attempts', e); }

        trackMetric({ accion: 'login_failed', metadata: { email: loginData.email } });
        toast.error(error.message || 'Credenciales incorrectas');
        return;
      }

      try { localStorage.removeItem(attemptKey); } catch {}
      if (loginStart) {
        const seconds = Math.floor((Date.now() - loginStart) / 1000);
        trackMetric({ accion: 'login_duration', metadata: { seconds } });
      }
      trackMetric({ accion: 'login_success', metadata: { email: loginData.email, remember: !!rememberMe, timestamp: new Date().toISOString() } });
      try { localStorage.setItem("rememberMe", JSON.stringify(rememberMe)); } catch {}
      navigate("/dashboard");
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      toast.error(msg || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    trackClick("register_submit");

    const result = registerSchema.safeParse(registerData);
    if (!result.success) {
      const errs: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path && err.path[0]) errs[String(err.path[0])] = err.message;
      });
      setRegisterErrors(errs);
      const firstKey = Object.keys(errs)[0];
      const el = document.getElementById(`register-${firstKey}`) as HTMLElement | null;
      el?.focus();
      return;
    }

    const pw = registerData.password || "";
    const checks = {
      length: pw.length >= 8,
      lower: /[a-z]/.test(pw),
      upper: /[A-Z]/.test(pw),
      number: /\d/.test(pw),
      special: /[^A-Za-z0-9]/.test(pw),
    };
    const allOk = Object.values(checks).every(Boolean);
    if (!allOk) {
      setPasswordChecks(checks);
      setRegisterErrors({ password: 'La contraseña no cumple los requisitos de seguridad' });
      const el = document.getElementById('register-password') as HTMLElement | null;
      el?.focus();
      return;
    }

    setRegisterErrors({});
    setLoading(true);
    try {
      const { error } = await signUp(registerData.email, registerData.password, registerData.nombre);
      if (!error) {
        if (registerStart) {
          const seconds = Math.floor((Date.now() - registerStart) / 1000);
          trackMetric({ accion: 'register_duration', metadata: { seconds } });
        }
        trackMetric({ accion: 'register_success', metadata: { email: registerData.email, acceptedTerms: !!registerData.acceptedTerms, timestamp: new Date().toISOString() } });
        setRegisterData({ nombre: "", email: "", password: "", confirmPassword: "", acceptedTerms: false });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    trackClick("reset_submit");
    const result = resetSchema.safeParse({ email: resetEmail });
    if (!result.success) {
      setResetError(result.error.errors[0].message);
      const el = document.getElementById(`reset-email`) as HTMLElement | null;
      el?.focus();
      return;
    }
    setResetError(null);
    setLoading(true);
    try {
      await resetPassword(resetEmail);
      setResetEmail("");
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary/5 via-accent/5 to-background">
      <div className="w-full max-w-md space-y-4">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-3">
            <Button variant="ghost" size="icon" asChild aria-label="Volver" className="-ml-2">
              <Link to="/" className="flex items-center"><ArrowLeft className="h-5 w-5 text-primary-foreground" /></Link>
            </Button>
            <Link to="/" className="inline-flex items-center gap-2 font-bold text-2xl hover:opacity-80 transition-opacity">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center">
                <Leaf className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">EcoSense</span>
            </Link>
          </div>
        </div>

        {/* Card */}
        <Card ref={cardRef} className="w-full" style={{ transition: 'transform 160ms ease' }}>
          <CardHeader>
            <CardTitle>Bienvenido</CardTitle>
            <CardDescription>Inicia sesión o crea una cuenta para comenzar</CardDescription>
          </CardHeader>
          <CardContent className="p-4 overflow-auto max-h-[64vh]">
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Iniciar Sesión</TabsTrigger>
                <TabsTrigger value="register">Registrarse</TabsTrigger>
              </TabsList>

              {/* Login Form */}
              <TabsContent value="login">
                {/* ... aquí iría todo tu formulario de login corregido ... */}
              </TabsContent>

              {/* Register Form */}
              <TabsContent value="register">
                {/* ... aquí iría todo tu formulario de registro corregido ... */}
              </TabsContent>
            </Tabs>

            {/* Reset Password */}
            <div className="mt-6 pt-6 border-t">
              <details className="space-y-4">
                <summary className="text-sm text-muted-foreground cursor-pointer hover:text-primary">¿Olvidaste tu contraseña?</summary>
                <form onSubmit={handleReset} className="space-y-3 mt-3">
                  <Label htmlFor="reset-email">Email de recuperación</Label>
                  <Input id="reset-email" type="email" value={resetEmail} onChange={e => setResetEmail(e.target.value)} required aria-invalid={!!resetError} aria-describedby={resetError ? 'reset-email-error' : undefined} />
                  {resetError && <p id="reset-email-error" className="text-xs text-destructive mt-1">{resetError}</p>}
                  <Button type="submit" variant="outline" className="w-full" disabled={loading}>{loading ? "Enviando..." : "Recuperar Contraseña"}</Button>
                </form>
              </details>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
