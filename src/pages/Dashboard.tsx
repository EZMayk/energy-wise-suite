import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useMetrics } from "@/hooks/useMetrics";
import { useLanguage } from "@/contexts/LanguageContext";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { 
  Plus, Zap, TrendingUp, TrendingDown, Activity, 
  Lightbulb, Target, Calendar, Cpu, Gauge, 
  ChevronRight, Sparkles
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { trackClick, trackMetric } = useMetrics("dashboard");
  const { t } = useLanguage();

  const [consumoData, setConsumoData] = useState<any[]>([]);
  const [dispositivos, setDispositivos] = useState<any[]>([]);
  const [nuevoDispositivo, setNuevoDispositivo] = useState({ nombre: "", potencia_w: "" });
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"hourly" | "daily">("hourly");
  const [hoursWindow, setHoursWindow] = useState<number>(48);
  const [daysWindow, setDaysWindow] = useState<number>(30);
  const [loadingData, setLoadingData] = useState(true);
  const [profileName, setProfileName] = useState<string>("");

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
      return;
    }

    if (user) {
      supabase
        .from("profiles")
        .select("nombre")
        .eq("id", user.id)
        .maybeSingle()
        .then(({ data }) => {
          if (data?.nombre) setProfileName(data.nombre);
        });
    }

    if (user) {
      (async () => {
        try {
          await cargarDispositivos();
          await cargarConsumo();
        } catch (e) {
          console.error("Error cargando datos en useEffect:", e);
        }
      })();
    }
  }, [user, loading, navigate, viewMode, hoursWindow, daysWindow, selectedDevice]);

  useEffect(() => {
    const handleRefreshData = async () => {
      try {
        await cargarDispositivos();
        await cargarConsumo();
      } catch (e) {
        console.error("Error refrescando datos:", e);
      }
    };

    window.addEventListener('refresh-data', handleRefreshData);
    return () => window.removeEventListener('refresh-data', handleRefreshData);
  }, []);

  const cargarDispositivos = async () => {
    try {
      const start = Date.now();
      const { data, error } = await supabase
        .from("dispositivos")
        .select("*")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false });
      const ms = Date.now() - start;
      try { await trackMetric({ accion: 'db_latency_dispositivos', metadata: { ms, rows: (data || []).length } }); } catch {}

      if (error) throw error;
      setDispositivos(data || []);
      if (data && data.length > 0 && !selectedDevice) {
        setSelectedDevice(data[0].id);
      }
    } catch (error) {
      console.error("Error loading devices:", error);
    }
  };

  const cargarConsumo = async () => {
    try {
      if (selectedDevice) {
        if (viewMode === "hourly") {
          const since = new Date(Date.now() - hoursWindow * 3600 * 1000).toISOString();
          const start = Date.now();
          const { data, error } = await supabase
            .from("dispositivo_consumo_horario")
            .select("*")
            .eq("dispositivo_id", selectedDevice)
            .gte("ts", since)
            .order("ts", { ascending: true });
          const ms = Date.now() - start;
          try { await trackMetric({ accion: 'db_latency_consumo_horario', metadata: { ms, rows: (data || []).length, device: selectedDevice } }); } catch {}
          if (error) throw error;
          setConsumoData(data || []);
          return;
        } else {
          const sinceDate = new Date();
          sinceDate.setDate(sinceDate.getDate() - daysWindow + 1);
          const sinceStr = sinceDate.toISOString().split("T")[0];
          const start = Date.now();
          const { data, error } = await supabase
            .from("dispositivo_consumo_diario")
            .select("*")
            .eq("dispositivo_id", selectedDevice)
            .gte("fecha", sinceStr)
            .order("fecha", { ascending: true });
          const ms = Date.now() - start;
          try { await trackMetric({ accion: 'db_latency_consumo_diario', metadata: { ms, rows: (data || []).length, device: selectedDevice } }); } catch {}
          if (error) throw error;
          setConsumoData(data || []);
          return;
        }
      }

      const { data: devices } = await supabase
        .from("dispositivos")
        .select("id")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false })
        .limit(1);
      const firstDeviceId = devices && devices[0] ? devices[0].id : null;
      if (firstDeviceId) {
        setSelectedDevice(firstDeviceId);
        return;
      }

      setConsumoData([]);
    } catch (error) {
      console.error("Error loading consumption:", error);
      toast.error(t('dashboard')?.messages?.error_load_consumption ?? "Error al cargar datos de consumo");
    } finally {
      setLoadingData(false);
    }
  };

  const handleAgregarDispositivo = async (e: React.FormEvent) => {
    e.preventDefault();
    trackClick("add_device");

    try {
      const { data, error } = await supabase.from("dispositivos").insert({
        user_id: user?.id,
        nombre: nuevoDispositivo.nombre,
        potencia_w: nuevoDispositivo.potencia_w ? Number(nuevoDispositivo.potencia_w) : null,
      }).select("*");

      if (error) throw error;
      toast.success(t('dashboard')?.messages?.device_added ?? "Dispositivo agregado");
      setNuevoDispositivo({ nombre: "", potencia_w: "" });

      const newDeviceId = data && data[0] ? data[0].id : null;
      await cargarDispositivos();
      if (newDeviceId) {
        setSelectedDevice(newDeviceId);
        const today = new Date().toISOString().split("T")[0];

        try {
          const potencia = data && data[0] ? Number(data[0].potencia_w || 0) : 0;
          const kwh = Math.round(((potencia * 24) / 1000) * 1000) / 1000;
          await supabase.from("dispositivo_consumo_diario").insert({
            dispositivo_id: newDeviceId,
            fecha: today,
            consumo_kwh: kwh,
          });
        } catch (e) {
          console.warn("No se pudo crear registro diario inicial:", e);
        }

        await cargarConsumo();
        toast.success(t('dashboard')?.messages?.device_added_with_record ?? "Dispositivo agregado y registro diario inicial creado");
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || (t('dashboard')?.messages?.error_add_device ?? "Error al agregar dispositivo"));
    }
  };

  if (loading || !user) return null;

  const totalConsumo = consumoData.reduce((sum, item) => sum + Number(item.consumo_kwh ?? 0), 0);
  const promedioConsumo = consumoData.length > 0 ? totalConsumo / consumoData.length : 0;
  const currentDevice = dispositivos.find(d => d.id === selectedDevice);
  const eficienciaScore = Math.min(100, Math.max(0, 85 - (promedioConsumo * 10)));

  const chartData = consumoData.map((item) => {
    if (viewMode === "hourly") {
      const d = new Date(item.ts);
      return { fecha: d.toLocaleString("es-ES", { hour: "2-digit", minute: "2-digit" }), kwh: Number(item.consumo_kwh) };
    }
    const d = new Date(item.fecha || item.ts);
    return { fecha: d.toLocaleDateString("es-ES", { day: "2-digit", month: "short" }), kwh: Number(item.consumo_kwh) };
  });

  const tips = [
    { icon: Lightbulb, text: "Apaga las luces al salir de una habitación", saving: "10%" },
    { icon: Gauge, text: "Usa electrodomésticos en horarios de menor demanda", saving: "15%" },
    { icon: Target, text: "Mantén los filtros de aire acondicionado limpios", saving: "8%" },
    { icon: Zap, text: "Desconecta dispositivos en standby", saving: "5%" },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 p-4 md:p-6 lg:p-8 space-y-6 bg-gradient-to-br from-background via-background to-muted/20">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 shadow-lg">
              <Activity className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                ¡Hola, {profileName || "Usuario"}!
              </h1>
              <p className="text-muted-foreground">
                Aquí está el resumen de tu consumo energético
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        {/* ... aquí irían los cuatro cards de totalConsumo, promedioConsumo, dispositivos y eficiencia ... */}

        {/* Current Device Info */}
        {/* ... currentDevice Cards ... */}

        {/* Chart Section */}
        {/* ... chartData AreaChart ... */}

        {/* Tips Section */}
        {/* ... tips map ... */}

        {/* Devices Management */}
        {/* ... form + list of devices ... */}
      </main>

      <Footer />
    </div>
  );
}
