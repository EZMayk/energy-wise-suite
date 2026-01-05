import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useMetrics } from "@/hooks/useMetrics";
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

    // Fetch profile name
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
      toast.error("Error al cargar datos de consumo");
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
      toast.success("Dispositivo agregado correctamente");
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
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Error al agregar dispositivo");
    }
  };

  if (loading || !user) {
    return null;
  }

  const totalConsumo = consumoData.reduce((sum, item) => sum + Number(item.consumo_kwh ?? 0), 0);
  const promedioConsumo = consumoData.length > 0 ? totalConsumo / consumoData.length : 0;
  const currentDevice = dispositivos.find(d => d.id === selectedDevice);
  const eficienciaScore = Math.min(100, Math.max(0, 85 - (promedioConsumo * 10)));

  const chartData = consumoData.map((item) => {
    if (viewMode === "hourly") {
      const d = new Date(item.ts);
      return {
        fecha: d.toLocaleString("es-ES", { hour: "2-digit", minute: "2-digit" }),
        kwh: Number(item.consumo_kwh),
      };
    }
    const d = new Date(item.fecha || item.ts);
    return {
      fecha: d.toLocaleDateString("es-ES", { day: "2-digit", month: "short" }),
      kwh: Number(item.consumo_kwh),
    };
  });

  const tips = [
    { icon: Lightbulb, text: "Apaga las luces al salir de una habitación", saving: "10%" },
    { icon: Gauge, text: "Usa electrodomésticos en horarios de menor demanda", saving: "15%" },
    { icon: Target, text: "Mantén los filtros de aire acondicionado limpios", saving: "8%" },
    { icon: Zap, text: "Desconecta dispositivos en standby", saving: "5%" },
  ];

  return (
    <main className="flex-1 p-4 md:p-6 lg:p-8 space-y-6 bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header Section */}
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
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent shadow-lg hover:shadow-xl transition-all duration-300 group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full -mr-12 -mt-12 group-hover:scale-110 transition-transform" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Consumo Total
            </CardTitle>
            <div className="p-2 rounded-lg bg-primary/20">
              <Zap className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            {loadingData ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <>
                <div className="text-2xl font-bold">{totalConsumo.toFixed(2)} kWh</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {viewMode === "hourly" ? `Últimas ${hoursWindow}h` : `Últimos ${daysWindow} días`}
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-green-500/10 via-green-500/5 to-transparent shadow-lg hover:shadow-xl transition-all duration-300 group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/10 rounded-full -mr-12 -mt-12 group-hover:scale-110 transition-transform" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Promedio
            </CardTitle>
            <div className="p-2 rounded-lg bg-green-500/20">
              <TrendingDown className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            {loadingData ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <>
                <div className="text-2xl font-bold">{promedioConsumo.toFixed(3)} kWh</div>
                <Badge variant="secondary" className="mt-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs">
                  <TrendingDown className="h-3 w-3 mr-1" />
                  Óptimo
                </Badge>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent shadow-lg hover:shadow-xl transition-all duration-300 group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full -mr-12 -mt-12 group-hover:scale-110 transition-transform" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Dispositivos
            </CardTitle>
            <div className="p-2 rounded-lg bg-amber-500/20">
              <Cpu className="h-4 w-4 text-amber-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dispositivos.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Registrados en tu cuenta
            </p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-transparent shadow-lg hover:shadow-xl transition-all duration-300 group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full -mr-12 -mt-12 group-hover:scale-110 transition-transform" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Eficiencia
            </CardTitle>
            <div className="p-2 rounded-lg bg-blue-500/20">
              <Target className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            {loadingData ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <>
                <div className="text-2xl font-bold">{eficienciaScore.toFixed(0)}%</div>
                <Progress value={eficienciaScore} className="mt-2 h-2" />
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Current Device Info */}
      {currentDevice && (
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="border-0 shadow-md bg-card/80 backdrop-blur">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Cpu className="h-4 w-4" />
                Dispositivo Activo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">{currentDevice.nombre}</div>
              <p className="text-xs text-muted-foreground">Seleccionado actualmente</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md bg-card/80 backdrop-blur">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Gauge className="h-4 w-4" />
                Potencia Nominal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">{currentDevice.potencia_w ?? 0} W</div>
              <p className="text-xs text-muted-foreground">Potencia configurada</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md bg-card/80 backdrop-blur">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Consumo Instantáneo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">
                {consumoData.length > 0 
                  ? Math.round(Number(consumoData[consumoData.length - 1].consumo_kwh ?? 0) * 1000) 
                  : currentDevice.potencia_w ?? 0} W
              </div>
              <p className="text-xs text-muted-foreground">Estimación actual</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Chart Section */}
      <Card className="border-0 shadow-lg overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>Historial de Consumo</CardTitle>
                <CardDescription>
                  {viewMode === "hourly"
                    ? `Últimas ${hoursWindow} horas`
                    : `Últimos ${daysWindow} días`}
                </CardDescription>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Select value={selectedDevice ?? ""} onValueChange={(v) => { setSelectedDevice(v || null); setLoadingData(true); }}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Selecciona dispositivo" />
                </SelectTrigger>
                <SelectContent>
                  {dispositivos.map((d) => (
                    <SelectItem key={d.id} value={d.id}>{d.nombre || d.id}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={viewMode} onValueChange={(v) => { setViewMode(v as any); setLoadingData(true); }}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hourly">Por hora</SelectItem>
                  <SelectItem value="daily">Por día</SelectItem>
                </SelectContent>
              </Select>

              {viewMode === "hourly" ? (
                <Select value={String(hoursWindow)} onValueChange={(v) => setHoursWindow(Number(v))}>
                  <SelectTrigger className="w-[100px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="24">24h</SelectItem>
                    <SelectItem value="48">48h</SelectItem>
                    <SelectItem value="72">72h</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <Select value={String(daysWindow)} onValueChange={(v) => setDaysWindow(Number(v))}>
                  <SelectTrigger className="w-[100px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">7 días</SelectItem>
                    <SelectItem value="30">30 días</SelectItem>
                    <SelectItem value="90">90 días</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {loadingData ? (
            <Skeleton className="h-[300px] w-full rounded-lg" />
          ) : chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorKwh" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted/50" />
                <XAxis 
                  dataKey="fecha" 
                  tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}`}
                  label={{ 
                    value: 'kWh', 
                    angle: -90, 
                    position: 'insideLeft',
                    style: { fill: "hsl(var(--muted-foreground))" }
                  }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  }}
                  labelStyle={{ color: "hsl(var(--foreground))" }}
                  formatter={(value: number) => [`${value.toFixed(3)} kWh`, "Consumo"]}
                />
                <Area
                  type="monotone"
                  dataKey="kwh"
                  stroke="hsl(var(--primary))"
                  strokeWidth={3}
                  fill="url(#colorKwh)"
                  dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: "hsl(var(--primary))" }}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              <div className="text-center space-y-3">
                <div className="p-4 rounded-full bg-muted/50 mx-auto w-fit">
                  <Zap className="h-10 w-10 opacity-30" />
                </div>
                <p className="font-medium">No hay datos de consumo</p>
                <p className="text-sm">Agrega un dispositivo para comenzar a monitorear</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tips Section */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-amber-500/5 via-transparent to-green-500/5">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/20">
              <Sparkles className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <CardTitle>Consejos de Ahorro Energético</CardTitle>
              <CardDescription>
                Pequeños cambios que hacen una gran diferencia
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            {tips.map((tip, index) => (
              <div
                key={index}
                className="p-4 rounded-xl bg-card border border-border/50 hover:border-primary/30 hover:shadow-md transition-all duration-300 cursor-pointer group"
                onClick={() => trackClick(`tip_${index}`)}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 shrink-0 group-hover:bg-primary/20 transition-colors">
                    <tip.icon className="h-4 w-4 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-foreground font-medium leading-tight">{tip.text}</p>
                    <Badge variant="outline" className="text-xs text-green-600 border-green-200 dark:border-green-800">
                      Ahorra hasta {tip.saving}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Devices Management */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Plus className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle>Gestión de Dispositivos</CardTitle>
              <CardDescription>
                Agrega y administra los dispositivos eléctricos de tu hogar
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-6">
            <form onSubmit={handleAgregarDispositivo} className="grid md:grid-cols-3 gap-4 items-end p-4 rounded-xl bg-muted/30 border border-border/50">
              <div className="space-y-2">
                <Label htmlFor="device-nombre" className="text-sm font-medium">
                  Nombre del dispositivo
                </Label>
                <Input
                  id="device-nombre"
                  placeholder="Ej. Refrigerador, TV, Aire acondicionado"
                  value={nuevoDispositivo.nombre}
                  onChange={(e) => setNuevoDispositivo({ ...nuevoDispositivo, nombre: e.target.value })}
                  required
                  className="bg-background"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="device-potencia" className="text-sm font-medium">
                  Potencia (Watts)
                </Label>
                <Input
                  id="device-potencia"
                  type="number"
                  step="1"
                  min="0"
                  placeholder="Ej. 1500"
                  value={nuevoDispositivo.potencia_w}
                  onChange={(e) => setNuevoDispositivo({ ...nuevoDispositivo, potencia_w: e.target.value })}
                  className="bg-background"
                />
              </div>

              <Button type="submit" className="w-full gap-2">
                <Plus className="h-4 w-4" />
                Agregar dispositivo
              </Button>
            </form>

            {dispositivos.length > 0 ? (
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {dispositivos.map((d) => (
                  <div 
                    key={d.id} 
                    className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-300 cursor-pointer ${
                      selectedDevice === d.id 
                        ? "border-primary bg-primary/5 shadow-md" 
                        : "border-border bg-card hover:border-primary/30 hover:shadow-sm"
                    }`}
                    onClick={() => { setSelectedDevice(d.id); setLoadingData(true); }}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${selectedDevice === d.id ? "bg-primary/20" : "bg-muted"}`}>
                        <Cpu className={`h-4 w-4 ${selectedDevice === d.id ? "text-primary" : "text-muted-foreground"}`} />
                      </div>
                      <div>
                        <div className="font-medium">{d.nombre}</div>
                        <div className="text-xs text-muted-foreground">
                          {d.potencia_w ? `${d.potencia_w} W` : "Potencia no definida"}
                        </div>
                      </div>
                    </div>
                    <ChevronRight className={`h-4 w-4 transition-transform ${selectedDevice === d.id ? "text-primary rotate-90" : "text-muted-foreground"}`} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <div className="p-4 rounded-full bg-muted/50 mx-auto w-fit mb-3">
                  <Cpu className="h-8 w-8 opacity-30" />
                </div>
                <p className="font-medium">No hay dispositivos registrados</p>
                <p className="text-sm">Agrega tu primer dispositivo para comenzar</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
