import { useState } from "react";
import {
  Accessibility,
  Eye,
  Ear,
  Hand,
  Brain,
  Sun,
  Moon,
  ChevronDown,
  Check,
  Type,
  Contrast,
  Volume2,
} from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useAccessibility } from "@/contexts/AccessibilityContext";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useMetrics } from "@/hooks/useMetrics";

const perfiles = [
  { value: "ninguna", label: "Estándar", icon: Accessibility },
  { value: "visual", label: "Visual", icon: Eye },
  { value: "auditiva", label: "Auditiva", icon: Ear },
  { value: "motriz", label: "Motriz", icon: Hand },
  { value: "cognitiva", label: "Cognitiva", icon: Brain },
];

interface AccessibilitySidebarMenuProps {
  isCollapsed: boolean;
}

export function AccessibilitySidebarMenu({ isCollapsed }: AccessibilitySidebarMenuProps) {
  const [open, setOpen] = useState(false);
  const { 
    perfil, 
    aplicarPerfil, 
    dark, 
    toggleDark,
    fontSize,
    setFontSize,
    highContrast,
    setHighContrast,
    textToSpeech,
    setTextToSpeech,
  } = useAccessibility();
  const { trackClick } = useMetrics('accessibility');

  const currentProfile = perfiles.find(p => p.value === perfil) || perfiles[0];
  const CurrentIcon = currentProfile.icon;

  const handleProfileChange = (value: string) => {
    aplicarPerfil(value as any);
    trackClick(`profile_${value}`);
    toast.success(`Perfil "${perfiles.find(p => p.value === value)?.label}" aplicado`);
  };

  const handleFontSizeChange = (value: number[]) => {
    setFontSize(value[0]);
    trackClick('font_size_change');
  };

  const handleContrastToggle = () => {
    setHighContrast(!highContrast);
    trackClick('contrast_toggle');
    toast.success(highContrast ? "Contraste normal activado" : "Alto contraste activado");
  };

  const handleTTSToggle = () => {
    setTextToSpeech(!textToSpeech);
    trackClick('tts_toggle');
    toast.success(textToSpeech ? "Lectura de voz desactivada" : "Lectura de voz activada");
  };

  if (isCollapsed) {
    return (
      <SidebarGroup>
        <SidebarMenu>
          <SidebarMenuItem>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-full h-11 rounded-lg hover:bg-sidebar-accent"
                  onClick={() => setOpen(true)}
                  aria-label="Abrir menú de accesibilidad"
                >
                  <Accessibility className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                Accesibilidad
              </TooltipContent>
            </Tooltip>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>
    );
  }

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <SidebarGroup>
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "w-full justify-between px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground",
              "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring"
            )}
            aria-expanded={open}
            aria-label={open ? "Contraer menú de accesibilidad" : "Expandir menú de accesibilidad"}
          >
            <span className="flex items-center gap-2">
              <Accessibility className="h-4 w-4" aria-hidden="true" />
              Accesibilidad
            </span>
            <ChevronDown 
              className={cn(
                "h-4 w-4 transition-transform duration-200",
                open && "rotate-180"
              )} 
              aria-hidden="true"
            />
          </Button>
        </CollapsibleTrigger>
        
        <CollapsibleContent className="animate-accordion-down">
          <SidebarGroupContent className="mt-2 space-y-4 px-2">
            {/* Theme Toggle */}
            <div className="flex items-center justify-between rounded-lg border border-sidebar-border p-3">
              <Label htmlFor="theme-toggle" className="text-sm font-medium flex items-center gap-2">
                {dark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                Tema
              </Label>
              <Button
                id="theme-toggle"
                variant="outline"
                size="sm"
                onClick={() => {
                  toggleDark();
                  trackClick('toggle_theme');
                  toast.success(`Tema ${dark ? 'claro' : 'oscuro'} activado`);
                }}
                className="min-h-[36px]"
                aria-pressed={dark}
              >
                {dark ? 'Claro' : 'Oscuro'}
              </Button>
            </div>

            {/* Accessibility Profiles */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Perfil de accesibilidad
              </Label>
              <div className="grid grid-cols-1 gap-1">
                {perfiles.map((p) => {
                  const Icon = p.icon;
                  const isActive = perfil === p.value;
                  return (
                    <Button
                      key={p.value}
                      variant={isActive ? "default" : "ghost"}
                      size="sm"
                      onClick={() => handleProfileChange(p.value)}
                      className={cn(
                        "justify-start gap-2 min-h-[40px]",
                        isActive && "bg-primary text-primary-foreground"
                      )}
                      aria-pressed={isActive}
                    >
                      <Icon className="h-4 w-4" aria-hidden="true" />
                      {p.label}
                      {isActive && <Check className="h-4 w-4 ml-auto" aria-hidden="true" />}
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* Font Size Control */}
            <div className="space-y-3 rounded-lg border border-sidebar-border p-3">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Type className="h-4 w-4" aria-hidden="true" />
                Tamaño de fuente
              </Label>
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground">A</span>
                <Slider
                  value={[fontSize]}
                  onValueChange={handleFontSizeChange}
                  min={12}
                  max={24}
                  step={1}
                  className="flex-1"
                  aria-label="Ajustar tamaño de fuente"
                />
                <span className="text-lg font-bold">A</span>
              </div>
              <span className="text-xs text-muted-foreground text-center block">
                {fontSize}px
              </span>
            </div>

            {/* Quick Toggles */}
            <div className="space-y-3">
              {/* High Contrast */}
              <div className="flex items-center justify-between rounded-lg border border-sidebar-border p-3">
                <Label 
                  htmlFor="high-contrast" 
                  className="text-sm font-medium flex items-center gap-2 cursor-pointer"
                >
                  <Contrast className="h-4 w-4" aria-hidden="true" />
                  Alto contraste
                </Label>
                <Switch
                  id="high-contrast"
                  checked={highContrast}
                  onCheckedChange={handleContrastToggle}
                  aria-label="Activar alto contraste"
                />
              </div>

              {/* Text to Speech */}
              <div className="flex items-center justify-between rounded-lg border border-sidebar-border p-3">
                <Label 
                  htmlFor="tts-toggle" 
                  className="text-sm font-medium flex items-center gap-2 cursor-pointer"
                >
                  <Volume2 className="h-4 w-4" aria-hidden="true" />
                  Lectura de voz
                </Label>
                <Switch
                  id="tts-toggle"
                  checked={textToSpeech}
                  onCheckedChange={handleTTSToggle}
                  aria-label="Activar lectura de voz"
                />
              </div>
            </div>
          </SidebarGroupContent>
        </CollapsibleContent>
      </SidebarGroup>
    </Collapsible>
  );
}
