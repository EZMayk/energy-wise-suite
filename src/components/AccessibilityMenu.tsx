import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { useAccessibility } from "@/contexts/AccessibilityContext";
import { 
  Accessibility, 
  Eye, 
  Ear, 
  Hand, 
  Brain, 
  Check, 
  Sun, 
  Moon,
  Type,
  Contrast,
  Volume2,
  Link2,
  Space,
  Palette,
  AlignLeft,
  Keyboard,
  Mic,
  X,
  Sparkles,
} from "lucide-react";
import { useMetrics } from "@/hooks/useMetrics";
import { toast } from "sonner";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const perfiles = [
  {
    value: "ninguna",
    label: "Estándar",
    description: "Interfaz estándar sin ajustes especiales",
    icon: Sparkles,
    color: "from-blue-500 to-cyan-500",
  },
  {
    value: "visual",
    label: "Discapacidad Visual",
    description: "Texto grande, alto contraste, lectores de pantalla",
    icon: Eye,
    color: "from-purple-500 to-pink-500",
  },
  {
    value: "auditiva",
    label: "Discapacidad Auditiva",
    description: "Alertas visuales, sin dependencia de audio",
    icon: Ear,
    color: "from-orange-500 to-red-500",
  },
  {
    value: "motriz",
    label: "Discapacidad Motriz",
    description: "Áreas grandes, navegación por teclado",
    icon: Hand,
    color: "from-green-500 to-emerald-500",
  },
  {
    value: "cognitiva",
    label: "Discapacidad Cognitiva",
    description: "Contenido simplificado, menos distracciones",
    icon: Brain,
    color: "from-yellow-500 to-amber-500",
  },
];

const spacingOptions = [
  { value: 'normal', label: 'Normal', icon: '◽' },
  { value: 'medium', label: 'Medio', icon: '◻' },
  { value: 'wide', label: 'Amplio', icon: '⬜' },
];

const fontFamilyOptions = [
  { value: 'default', label: 'Predeterminada' },
  { value: 'arial', label: 'Arial' },
  { value: 'verdana', label: 'Verdana' },
  { value: 'opendyslexic', label: 'OpenDyslexic' },
  { value: 'comic', label: 'Comic Sans' },
];

const letterSpacingOptions = [
  { value: 'normal', label: 'Normal' },
  { value: 'wide', label: 'Amplio' },
  { value: 'wider', label: 'Muy amplio' },
];

const lineHeightOptions = [
  { value: 'normal', label: 'Normal' },
  { value: 'relaxed', label: 'Relajado' },
  { value: 'loose', label: 'Amplio' },
];

export const AccessibilityMenu = () => {
  const { 
    perfil, 
    setPerfil, 
    aplicarPerfil, 
    dark, 
    toggleDark,
    fontSize,
    setFontSize,
    highContrast,
    setHighContrast,
    textToSpeech,
    setTextToSpeech,
    linkHighlight,
    setLinkHighlight,
    spacing,
    setSpacing,
    fontFamily,
    setFontFamily,
    customColors,
    setCustomColors,
    customColorsEnabled,
    setCustomColorsEnabled,
    letterSpacing,
    setLetterSpacing,
    lineHeight,
    setLineHeight,
    voiceControl,
    setVoiceControl,
  } = useAccessibility();
  const { trackClick } = useMetrics('accessibility');
  const [open, setOpen] = useState(false);
  const [tempPerfil, setTempPerfil] = useState(perfil);

  useEffect(() => {
    setTempPerfil(perfil);
  }, [perfil]);

  const handleApply = () => {
    aplicarPerfil(tempPerfil as any);
    setPerfil(tempPerfil as any);
    setOpen(false);
    toast.success("✨ Perfil de accesibilidad aplicado correctamente");
  };

  const [highContrast, setHighContrast] = useState(false);

  useEffect(() => {
    try {
      if (highContrast) {
        document.documentElement.setAttribute("data-contrast", "high");
      } else {
        document.documentElement.removeAttribute("data-contrast");
      }
    } catch (e) {
      // ignore (SSR or safety)
    }
  }, [highContrast]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="fixed bottom-6 right-6 h-16 w-16 rounded-full shadow-2xl z-50 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground border-0 hover:scale-110 hover:shadow-primary/50 transition-all duration-300 group"
          aria-label="Abrir menú de accesibilidad"
        >
          <Accessibility className="h-7 w-7 group-hover:rotate-180 transition-transform duration-500" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-xl overflow-y-auto p-0 border-0">
        {/* Header with gradient */}
        <div className="sticky top-0 z-10 bg-gradient-to-br from-primary via-primary/95 to-primary/90 text-primary-foreground p-6 shadow-lg">
          <div className="flex items-start justify-between mb-3">
            <div className="space-y-1">
              <SheetTitle className="text-3xl font-black tracking-tight">
                Accesibilidad
              </SheetTitle>
              <SheetDescription className="text-primary-foreground/80 text-sm">
                Personaliza según tus necesidades
              </SheetDescription>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setOpen(false)}
              className="rounded-full hover:bg-primary-foreground/20 text-primary-foreground"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          <div className="flex items-center gap-2 text-xs text-primary-foreground/70 bg-primary-foreground/10 rounded-full px-3 py-1.5 w-fit">
            <Check className="h-3 w-3" />
            <span>Cumple WCAG 2.2 nivel AA</span>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Theme Toggle - Premium Card */}
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-primary/60 rounded-2xl blur opacity-30 group-hover:opacity-100 transition duration-300"></div>
            <div className="relative bg-card rounded-2xl p-5 border-2 border-primary/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "p-2.5 rounded-xl transition-colors",
                    dark ? "bg-slate-800" : "bg-amber-100"
                  )}>
                    {dark ? <Moon className="h-5 w-5 text-slate-300" /> : <Sun className="h-5 w-5 text-amber-500" />}
                  </div>
                  <div>
                    <Label className="text-base font-bold block">Tema de color</Label>
                    <span className="text-xs text-muted-foreground">
                      {dark ? 'Modo oscuro activo' : 'Modo claro activo'}
                    </span>
                  </div>
                </div>
                <Button
                  variant={dark ? "default" : "outline"}
                  size="sm"
                  onClick={() => { 
                    toggleDark(); 
                    trackClick('toggle_theme'); 
                    toast.success(`✨ Tema ${dark ? 'claro' : 'oscuro'} activado`); 
                  }}
                  className="min-h-[44px] min-w-[90px] font-semibold rounded-xl"
                >
                  {dark ? 'Claro' : 'Oscuro'}
                </Button>
              </div>
            </div>
          </div>

          <Separator />

          {/* Accessibility Profiles - Cards Grid */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-8 w-1 bg-gradient-to-b from-primary to-primary/50 rounded-full"></div>
              <h3 className="text-xl font-bold">Perfiles de accesibilidad</h3>
            </div>
            
            <div className="grid gap-3">
              {perfiles.map((perfilItem) => {
                const Icon = perfilItem.icon;
                const isSelected = tempPerfil === perfilItem.value;
                return (
                  <button
                    key={perfilItem.value}
                    onClick={() => setTempPerfil(perfilItem.value as any)}
                    className={cn(
                      "relative overflow-hidden rounded-2xl p-5 text-left transition-all duration-300 group",
                      "border-2 hover:scale-[1.02] active:scale-[0.98]",
                      isSelected
                        ? "border-primary bg-primary/5 shadow-lg shadow-primary/20"
                        : "border-border bg-card hover:border-primary/50 hover:shadow-md"
                    )}
                  >
                    {/* Gradient background */}
                    <div className={cn(
                      "absolute inset-0 opacity-0 transition-opacity duration-300",
                      isSelected && "opacity-10",
                      `bg-gradient-to-br ${perfilItem.color}`
                    )}></div>
                    
                    <div className="relative flex items-start gap-4">
                      {/* Icon with gradient background */}
                      <div className={cn(
                        "p-3 rounded-xl transition-all duration-300",
                        isSelected 
                          ? `bg-gradient-to-br ${perfilItem.color} shadow-lg` 
                          : "bg-muted group-hover:bg-muted/80"
                      )}>
                        <Icon className={cn(
                          "h-6 w-6 transition-colors",
                          isSelected ? "text-white" : "text-muted-foreground"
                        )} />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-bold text-base">{perfilItem.label}</h4>
                          {isSelected && (
                            <div className="flex-shrink-0">
                              <Check className="h-5 w-5 text-primary animate-in zoom-in" />
                            </div>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {perfilItem.description}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <Separator />

          {/* Font Size - Modern Slider */}
          <div className="space-y-4 bg-gradient-to-br from-card to-muted/20 rounded-2xl p-6 border-2 border-border">
            <div className="flex items-center justify-between mb-2">
              <Label className="text-base font-bold flex items-center gap-2">
                <Type className="h-5 w-5 text-primary" />
                Tamaño de fuente
              </Label>
              <span className="text-2xl font-black text-primary">{fontSize}px</span>
            </div>
            <div className="flex items-center gap-4 pt-2">
              <span className="text-sm font-bold text-muted-foreground">A</span>
              <Slider
                value={[fontSize]}
                onValueChange={(value) => {
                  setFontSize(value[0]);
                  trackClick('font_size_change');
                }}
                min={12}
                max={24}
                step={1}
                className="flex-1"
              />
              <span className="text-3xl font-black text-primary">A</span>
            </div>
          </div>

          {/* Font Family - Pill Buttons */}
          <div className="space-y-4">
            <Label className="text-base font-bold flex items-center gap-2">
              <Type className="h-5 w-5 text-primary" />
              Tipo de fuente
            </Label>
            <div className="grid grid-cols-2 gap-3">
              {fontFamilyOptions.map((option) => (
                <Button
                  key={option.value}
                  variant={fontFamily === option.value ? "default" : "outline"}
                  size="lg"
                  onClick={() => {
                    setFontFamily(option.value as any);
                    trackClick(`font_family_${option.value}`);
                    toast.success(`✨ Fuente ${option.label} aplicada`);
                  }}
                  className={cn(
                    "min-h-[48px] font-semibold rounded-xl transition-all",
                    fontFamily === option.value && "shadow-lg shadow-primary/30"
                  )}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Quick Toggles - Modern Cards */}
          <div className="space-y-3">
            {[
              { id: 'high-contrast', icon: Contrast, label: 'Alto contraste', checked: highContrast, onChange: setHighContrast },
              { id: 'tts', icon: Volume2, label: 'Lectura de voz', checked: textToSpeech, onChange: setTextToSpeech },
              { id: 'link-highlight', icon: Link2, label: 'Resaltar enlaces', checked: linkHighlight, onChange: setLinkHighlight },
              { id: 'voice-control', icon: Mic, label: 'Control por voz', checked: voiceControl, onChange: setVoiceControl },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div 
                  key={item.id} 
                  className={cn(
                    "flex items-center justify-between rounded-xl p-4 transition-all border-2",
                    item.checked 
                      ? "bg-primary/5 border-primary/30" 
                      : "bg-card border-border hover:border-primary/30"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "p-2 rounded-lg transition-colors",
                      item.checked ? "bg-primary/10" : "bg-muted"
                    )}>
                      <Icon className={cn(
                        "h-5 w-5",
                        item.checked ? "text-primary" : "text-muted-foreground"
                      )} />
                    </div>
                    <Label htmlFor={item.id} className="text-base font-medium cursor-pointer">
                      {item.label}
                    </Label>
                  </div>
                  <Switch
                    id={item.id}
                    checked={item.checked}
                    onCheckedChange={(value) => {
                      item.onChange(value);
                      toast.success(`${item.label} ${value ? 'activado' : 'desactivado'}`);
                    }}
                  />
                </div>
              );
            })}
          </div>

          {/* Spacing Options */}
          <div className="space-y-4">
            <Label className="text-base font-bold flex items-center gap-2">
              <Space className="h-5 w-5 text-primary" />
              Espaciado de elementos
            </Label>
            <div className="grid grid-cols-3 gap-3">
              {spacingOptions.map((option) => (
                <Button
                  key={option.value}
                  variant={spacing === option.value ? "default" : "outline"}
                  size="lg"
                  onClick={() => {
                    setSpacing(option.value as any);
                    toast.success(`Espaciado ${option.label} aplicado`);
                  }}
                  className={cn(
                    "min-h-[56px] rounded-xl font-semibold flex flex-col gap-1",
                    spacing === option.value && "shadow-lg shadow-primary/30"
                  )}
                >
                  <span className="text-2xl">{option.icon}</span>
                  <span className="text-xs">{option.label}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Letter Spacing */}
          <div className="space-y-4">
            <Label className="text-base font-bold flex items-center gap-2">
              <AlignLeft className="h-5 w-5 text-primary" />
              Espaciado entre letras
            </Label>
            <div className="flex gap-3">
              {letterSpacingOptions.map((option) => (
                <Button
                  key={option.value}
                  variant={letterSpacing === option.value ? "default" : "outline"}
                  size="lg"
                  onClick={() => {
                    setLetterSpacing(option.value as any);
                    toast.success(`Espaciado ${option.label} aplicado`);
                  }}
                  className={cn(
                    "flex-1 min-h-[48px] rounded-xl font-semibold",
                    letterSpacing === option.value && "shadow-lg shadow-primary/30"
                  )}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Line Height */}
          <div className="space-y-4">
            <Label className="text-base font-bold flex items-center gap-2">
              <AlignLeft className="h-5 w-5 text-primary" />
              Altura de línea
            </Label>
            <div className="flex gap-3">
              {lineHeightOptions.map((option) => (
                <Button
                  key={option.value}
                  variant={lineHeight === option.value ? "default" : "outline"}
                  size="lg"
                  onClick={() => {
                    setLineHeight(option.value as any);
                    toast.success(`Altura ${option.label} aplicada`);
                  }}
                  className={cn(
                    "flex-1 min-h-[48px] rounded-xl font-semibold",
                    lineHeight === option.value && "shadow-lg shadow-primary/30"
                  )}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Custom Colors */}
          <div className="space-y-4 bg-gradient-to-br from-card to-muted/20 rounded-2xl p-6 border-2 border-border">
            <div className="flex items-center justify-between">
              <Label className="text-base font-bold flex items-center gap-2">
                <Palette className="h-5 w-5 text-primary" />
                Colores personalizados
              </Label>
              <Switch
                checked={customColorsEnabled}
                onCheckedChange={setCustomColorsEnabled}
              />
            </div>
            
            {customColorsEnabled && (
              <div className="space-y-4 animate-in fade-in slide-in-from-top-2 pt-2">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Color de fondo</Label>
                  <div className="flex gap-3">
                    <Input
                      type="color"
                      value={customColors.background}
                      onChange={(e) => setCustomColors({ ...customColors, background: e.target.value })}
                      className="w-16 h-14 p-1 cursor-pointer rounded-xl"
                    />
                    <Input
                      type="text"
                      value={customColors.background}
                      onChange={(e) => setCustomColors({ ...customColors, background: e.target.value })}
                      className="flex-1 font-mono rounded-xl"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Color de texto</Label>
                  <div className="flex gap-3">
                    <Input
                      type="color"
                      value={customColors.text}
                      onChange={(e) => setCustomColors({ ...customColors, text: e.target.value })}
                      className="w-16 h-14 p-1 cursor-pointer rounded-xl"
                    />
                    <Input
                      type="text"
                      value={customColors.text}
                      onChange={(e) => setCustomColors({ ...customColors, text: e.target.value })}
                      className="flex-1 font-mono rounded-xl"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Keyboard Shortcuts - Premium Box */}
          <div className="rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-background border-2 border-primary/20 p-6">
            <Label className="text-base font-bold flex items-center gap-2 mb-4">
              <Keyboard className="h-5 w-5 text-primary" />
              Atajos de teclado disponibles
            </Label>
            <div className="space-y-3 text-sm">
              {[
                { keys: ['Tab'], desc: 'Navegar entre elementos' },
                { keys: ['Shift', 'Tab'], desc: 'Navegar hacia atrás' },
                { keys: ['Enter'], desc: 'Activar botón/enlace' },
                { keys: ['Space'], desc: 'Activar elemento enfocado' },
                { keys: ['Esc'], desc: 'Cerrar menús' },
                { keys: ['Ctrl', '+/-'], desc: 'Zoom del navegador' },
                { keys: ['Arrow Keys'], desc: 'Navegar en menús' },
              ].map((shortcut, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="flex gap-1">
                    {shortcut.keys.map((key, j) => (
                      <kbd key={j} className="px-2.5 py-1.5 bg-background rounded-lg border-2 border-border font-mono text-xs font-semibold shadow-sm">
                        {key}
                      </kbd>
                    ))}
                  </div>
                  <span className="text-muted-foreground">- {shortcut.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sticky Action Buttons */}
        <div className="sticky bottom-0 bg-gradient-to-t from-background via-background to-transparent p-6 pt-8">
          <div className="flex gap-3">
            <Button 
              onClick={handleApply} 
              size="lg"
              className="flex-1 h-14 text-base font-bold rounded-xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all bg-gradient-to-r from-primary to-primary/90"
            >
              Aplicar Cambios
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => {
                setTempPerfil(perfil);
                setOpen(false);
              }}
              className="h-14 px-8 font-semibold rounded-xl hover:scale-105 transition-all"
            >
              Cancelar
            </Button>
          </div>
          <div className="mt-4">
            <Label className="mb-2">Contraste</Label>
            <div className="flex items-center gap-3">
              <Button
                variant={highContrast ? "default" : "outline"}
                onClick={() => setHighContrast((v) => !v)}
                size="sm"
              >
                {highContrast ? <Check className="h-4 w-4 mr-2" /> : null}
                Contraste Alto
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};