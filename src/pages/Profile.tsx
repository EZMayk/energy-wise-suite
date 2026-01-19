import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useMetrics } from "@/hooks/useMetrics";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAccessibility } from "@/contexts/AccessibilityContext";
import { 
  User, Mail, Calendar, Shield, Settings, Eye,
  Save, LogOut, Trash2, AlertTriangle
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Profile() {
  const navigate = useNavigate();
  const { user, loading, signOut, isAdmin } = useAuth();
  const { trackClick, trackMetric } = useMetrics("profile");
  const { t } = useLanguage();
  const { perfil: accessibilityProfile, setPerfil } = useAccessibility();

  const [profileData, setProfileData] = useState<any>(null);
  const [nombre, setNombre] = useState("");
  const [saving, setSaving] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
      return;
    }

    if (user) {
      cargarPerfil();
      trackMetric({ accion: "profile_view", metadata: { timestamp: new Date().toISOString(), user: user.id } });
    }
  }, [user, loading, navigate]);

  const cargarPerfil = async () => {
    try {
      setLoadingProfile(true);
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user?.id)
        .single();
      if (error && error.code !== "PGRST116") throw error;
      setProfileData(data || null);
      setNombre(data?.nombre || "");
    } catch (e) {
      console.error("Error loading profile:", e);
      toast.error(t('profile')?.messages?.error_load ?? "No se pudo cargar el perfil");
    } finally {
      setLoadingProfile(false);
    }
  };

  const saveProfile = async () => {
    trackClick("profile_save");
    if (!user) return;

    const nuevo = nombre?.trim() ?? "";
    if (!nuevo || nuevo.length < 2) {
      toast.error(t('profile')?.messages?.name_too_short ?? "El nombre debe tener al menos 2 caracteres");
      return;
    }

    if (profileData && (profileData.nombre || "") === nuevo) {
      toast.info(t('profile')?.messages?.no_changes ?? "No hay cambios que guardar");
      return;
    }

    setSaving(true);
    const start = Date.now();
    try {
      const payload = {
        id: user.id,
        email: user.email || "",
        nombre: nuevo,
        updated_at: new Date().toISOString(),
      };
      const { error } = await supabase.from("profiles").upsert(payload);
      if (error) throw error;
      const duration = Date.now() - start;
      try { await trackMetric({ accion: "profile_update", metadata: { ms: duration } }); } catch {}
      toast.success(t('profile')?.messages?.updated ?? "Perfil actualizado");
      await cargarPerfil();
    } catch (e) {
      console.error(e);
      toast.error(t('profile')?.messages?.error_update ?? "No se pudo actualizar el perfil");
    } finally {
      setSaving(false);
    }
  };

  const handleAccessibilityProfileChange = async (value: string) => {
    const typedValue = value as "visual" | "auditiva" | "motriz" | "cognitiva" | "ninguna";
    setPerfil(typedValue);
    
    if (user) {
      try {
        const { error } = await supabase
          .from("profiles")
          .update({ 
            perfil_accesibilidad: typedValue,
            updated_at: new Date().toISOString() 
          })
          .eq("id", user.id);
        if (error) throw error;
        toast.success("Perfil de accesibilidad actualizado");
        await cargarPerfil();
      } catch (e) {
        console.error(e);
        toast.error("No se pudo guardar el perfil de accesibilidad");
      }
    }
  };

  const handleSignOut = async () => {
    trackClick("logout");
    await signOut();
    navigate("/");
  };

  if (loading || !user) return null;

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Avatar className="h-20 w-20 border-4 border-primary/20">
          <AvatarFallback className="text-2xl bg-gradient-to-br from-primary to-primary-glow text-primary-foreground">
            {getInitials(nombre || user?.email || "U")}
          </AvatarFallback>
        </Avatar>
        <div className="space-y-1">
          <h1 className="text-3xl font-bold">{nombre || "Mi Perfil"}</h1>
          <div className="flex items-center gap-2">
            <Badge variant={isAdmin ? "default" : "secondary"}>
              {isAdmin ? "Administrador" : "Usuario"}
            </Badge>
            {profileData?.perfil_accesibilidad && profileData.perfil_accesibilidad !== "ninguna" && (
              <Badge variant="outline" className="capitalize">
                <Eye className="h-3 w-3 mr-1" />
                Perfil: {profileData.perfil_accesibilidad}
              </Badge>
            )}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Información Personal */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Información Personal
            </CardTitle>
            <CardDescription>
              Gestiona tu información de perfil
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nombre" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Nombre
              </Label>
              <Input
                id="nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Tu nombre completo"
                disabled={loadingProfile}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Correo electrónico
              </Label>
              <Input
                id="email"
                value={user?.email ?? ""}
                readOnly
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground">
                El correo no puede modificarse desde aquí.
              </p>
            </div>

            <Button 
              onClick={saveProfile} 
              disabled={saving || loadingProfile}
              className="w-full"
            >
              <Save className="h-4 w-4 mr-2" />
              {saving ? "Guardando..." : "Guardar cambios"}
            </Button>
          </CardContent>
        </Card>

        {/* Accesibilidad */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-primary" />
              Accesibilidad
            </CardTitle>
            <CardDescription>
              Configura tu perfil de accesibilidad
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Label htmlFor="accessibility-profile">Perfil de accesibilidad</Label>
            <Select
              value={profileData?.perfil_accesibilidad || accessibilityProfile || "ninguna"}
              onValueChange={handleAccessibilityProfileChange}
            >
              <SelectTrigger id="accessibility-profile">
                <SelectValue placeholder="Selecciona un perfil" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ninguna">Sin perfil específico</SelectItem>
                <SelectItem value="visual">Discapacidad visual</SelectItem>
                <SelectItem value="auditiva">Discapacidad auditiva</SelectItem>
                <SelectItem value="motriz">Discapacidad motriz</SelectItem>
                <SelectItem value="cognitiva">Discapacidad cognitiva</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Al seleccionar un perfil, la interfaz se adaptará a tus necesidades.
            </p>
          </CardContent>
        </Card>

        {/* Información de cuenta */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Información de Cuenta
            </CardTitle>
            <CardDescription>
              Detalles de tu cuenta
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Cuenta creada</span>
                </div>
                <span className="text-sm font-medium">
                  {profileData?.created_at ? formatDate(profileData.created_at) : "—"}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-2">
                  <Settings className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Última actualización</span>
                </div>
                <span className="text-sm font-medium">
                  {profileData?.updated_at ? formatDate(profileData.updated_at) : "—"}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Rol de usuario</span>
                </div>
                <Badge variant={isAdmin ? "default" : "outline"}>
                  {isAdmin ? "Administrador" : "Usuario"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Acciones de cuenta */}
        <Card className="border-destructive/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Zona de Peligro
            </CardTitle>
            <CardDescription>
              Acciones irreversibles de tu cuenta
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              variant="outline" 
              className="w-full"
              onClick={handleSignOut}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Cerrar sesión
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-full">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Eliminar cuenta
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta acción no se puede deshacer. Se eliminarán permanentemente 
                    tu cuenta y todos los datos asociados (dispositivos, consumos, métricas).
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction 
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    onClick={() => {
                      toast.info("Funcionalidad de eliminación pendiente de implementar");
                      trackClick("delete_account_attempt");
                    }}
                  >
                    Sí, eliminar mi cuenta
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <p className="text-xs text-muted-foreground text-center">
              La eliminación de cuenta requiere confirmación adicional.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
