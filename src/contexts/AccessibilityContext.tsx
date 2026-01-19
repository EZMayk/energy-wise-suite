import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

type PerfilAccesibilidad = "visual" | "auditiva" | "motriz" | "cognitiva" | "ninguna";
type FontFamily = "default" | "arial" | "verdana" | "opendyslexic" | "comic";

interface AccessibilityContextType {
  perfil: PerfilAccesibilidad;
  setPerfil: (perfil: PerfilAccesibilidad) => void;
  aplicarPerfil: (perfil?: PerfilAccesibilidad) => void;
  cargarPerfil: (apply?: boolean) => Promise<PerfilAccesibilidad | null>;
  dark: boolean;
  toggleDark: () => void;
  fontSize: number;
  setFontSize: (size: number) => void;
  highContrast: boolean;
  setHighContrast: (value: boolean) => void;
  textToSpeech: boolean;
  setTextToSpeech: (value: boolean) => void;
  linkHighlight: boolean;
  setLinkHighlight: (value: boolean) => void;
  spacing: 'normal' | 'medium' | 'wide';
  setSpacing: (value: 'normal' | 'medium' | 'wide') => void;
  fontFamily: FontFamily;
  setFontFamily: (font: FontFamily) => void;
  customColors: { background: string; text: string };
  setCustomColors: (colors: { background: string; text: string }) => void;
  customColorsEnabled: boolean;
  setCustomColorsEnabled: (enabled: boolean) => void;
  letterSpacing: 'normal' | 'wide' | 'wider';
  setLetterSpacing: (value: 'normal' | 'wide' | 'wider') => void;
  lineHeight: 'normal' | 'relaxed' | 'loose';
  setLineHeight: (value: 'normal' | 'relaxed' | 'loose') => void;
  customShortcuts: Record<string, string>;
  setCustomShortcuts: (shortcuts: Record<string, string>) => void;
  voiceControl: boolean;
  setVoiceControl: (enabled: boolean) => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [perfil, setPerfil] = useState<PerfilAccesibilidad>("ninguna");
  const [dark, setDark] = useState<boolean>(false);
  const [fontSize, setFontSizeState] = useState<number>(16);
  const [highContrast, setHighContrastState] = useState<boolean>(false);
  const [textToSpeech, setTextToSpeechState] = useState<boolean>(false);
  const [linkHighlight, setLinkHighlightState] = useState<boolean>(false);
  const [spacing, setSpacingState] = useState<'normal' | 'medium' | 'wide'>('normal');

  // NEW STATES
  const [fontFamily, setFontFamilyState] = useState<FontFamily>('default');
  const [customColors, setCustomColorsState] = useState({ background: '#ffffff', text: '#000000' });
  const [customColorsEnabled, setCustomColorsEnabledState] = useState(false);
  const [letterSpacing, setLetterSpacingState] = useState<'normal' | 'wide' | 'wider'>('normal');
  const [lineHeight, setLineHeightState] = useState<'normal' | 'relaxed' | 'loose'>('normal');
  const [customShortcuts, setCustomShortcutsState] = useState<Record<string, string>>({});
  const [voiceControl, setVoiceControlState] = useState(false);

  const { user } = useAuth();

  const LOCAL_KEY = "accessibility_perfil";
  const LOCAL_THEME = "theme_pref";
  const LOCAL_FONT_SIZE = "accessibility_font_size";
  const LOCAL_HIGH_CONTRAST = "accessibility_high_contrast";
  const LOCAL_TTS = "accessibility_tts";
  const LOCAL_LINK_HIGHLIGHT = "accessibility_link_highlight";
  const LOCAL_SPACING = "accessibility_spacing";
  const LOCAL_FONT_FAMILY = "accessibility_font_family";
  const LOCAL_CUSTOM_COLORS = "accessibility_custom_colors";
  const LOCAL_CUSTOM_COLORS_ENABLED = "accessibility_custom_colors_enabled";
  const LOCAL_LETTER_SPACING = "accessibility_letter_spacing";
  const LOCAL_LINE_HEIGHT = "accessibility_line_height";
  const LOCAL_CUSTOM_SHORTCUTS = "accessibility_custom_shortcuts";
  const LOCAL_VOICE_CONTROL = "accessibility_voice_control";

  // --- DOM APPLY FUNCTIONS ---
  const applyFontSizeDOM = useCallback((size: number) => {
    document.documentElement.style.setProperty('--font-size-base', `${size}px`);
  }, []);

  const applyHighContrastDOM = useCallback((value: boolean) => {
    const root = document.documentElement;
    if (value) {
      root.classList.add('high-contrast');
      root.style.setProperty('--contrast-boost', '1.5');
    } else {
      root.classList.remove('high-contrast');
      root.style.removeProperty('--contrast-boost');
    }
  }, []);

  const applyLinkHighlightDOM = useCallback((value: boolean) => {
    const root = document.documentElement;
    value ? root.classList.add('link-highlight') : root.classList.remove('link-highlight');
  }, []);

  const applySpacingDOM = useCallback((value: 'normal' | 'medium' | 'wide') => {
    const root = document.documentElement;
    root.classList.remove('spacing-normal', 'spacing-medium', 'spacing-wide');
    root.classList.add(`spacing-${value}`);
    const spacingValues = { normal: '0.5rem', medium: '1rem', wide: '1.5rem' };
    root.style.setProperty('--spacing-interactive', spacingValues[value]);
  }, []);

  const applyFontFamilyDOM = useCallback((font: FontFamily) => {
    const fontMap = {
      default: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      arial: 'Arial, sans-serif',
      verdana: 'Verdana, sans-serif',
      opendyslexic: '"OpenDyslexic", sans-serif',
      comic: '"Comic Sans MS", "Comic Sans", cursive'
    };
    document.documentElement.style.setProperty('--font-family-base', fontMap[font]);
  }, []);

  const applyCustomColorsDOM = useCallback((colors: { background: string; text: string }, enabled: boolean) => {
    const root = document.documentElement;
    if (enabled) {
      root.style.setProperty('--custom-bg', colors.background);
      root.style.setProperty('--custom-text', colors.text);
      root.classList.add('custom-colors-enabled');
    } else {
      root.classList.remove('custom-colors-enabled');
      root.style.removeProperty('--custom-bg');
      root.style.removeProperty('--custom-text');
    }
  }, []);

  const applyLetterSpacingDOM = useCallback((value: 'normal' | 'wide' | 'wider') => {
    const spacingMap = { normal: '0', wide: '0.05em', wider: '0.1em' };
    document.documentElement.style.setProperty('--letter-spacing', spacingMap[value]);
  }, []);

  const applyLineHeightDOM = useCallback((value: 'normal' | 'relaxed' | 'loose') => {
    const heightMap = { normal: '1.6', relaxed: '2.0', loose: '2.5' };
    document.documentElement.style.setProperty('--line-height-text', heightMap[value]);
  }, []);

  // --- SETTERS WITH PERSISTENCE ---
  const setFontSize = useCallback((size: number) => { setFontSizeState(size); applyFontSizeDOM(size); try { localStorage.setItem(LOCAL_FONT_SIZE, String(size)); } catch {} }, [applyFontSizeDOM]);
  const setHighContrast = useCallback((value: boolean) => { setHighContrastState(value); applyHighContrastDOM(value); try { localStorage.setItem(LOCAL_HIGH_CONTRAST, String(value)); } catch {} }, [applyHighContrastDOM]);
  const setTextToSpeech = useCallback((value: boolean) => { setTextToSpeechState(value); try { localStorage.setItem(LOCAL_TTS, String(value)); } catch {}; if (!value && 'speechSynthesis' in window) window.speechSynthesis.cancel(); }, []);
  const setLinkHighlight = useCallback((value: boolean) => { setLinkHighlightState(value); applyLinkHighlightDOM(value); try { localStorage.setItem(LOCAL_LINK_HIGHLIGHT, String(value)); } catch {} }, [applyLinkHighlightDOM]);
  const setSpacing = useCallback((value: 'normal' | 'medium' | 'wide') => { setSpacingState(value); applySpacingDOM(value); try { localStorage.setItem(LOCAL_SPACING, value); } catch {} }, [applySpacingDOM]);
  const setFontFamily = useCallback((font: FontFamily) => { setFontFamilyState(font); applyFontFamilyDOM(font); try { localStorage.setItem(LOCAL_FONT_FAMILY, font); } catch {} }, [applyFontFamilyDOM]);
  const setCustomColors = useCallback((colors: { background: string; text: string }) => { setCustomColorsState(colors); applyCustomColorsDOM(colors, customColorsEnabled); try { localStorage.setItem(LOCAL_CUSTOM_COLORS, JSON.stringify(colors)); } catch {} }, [applyCustomColorsDOM, customColorsEnabled]);
  const setCustomColorsEnabled = useCallback((enabled: boolean) => { setCustomColorsEnabledState(enabled); applyCustomColorsDOM(customColors, enabled); try { localStorage.setItem(LOCAL_CUSTOM_COLORS_ENABLED, String(enabled)); } catch {} }, [applyCustomColorsDOM, customColors]);
  const setLetterSpacing = useCallback((value: 'normal' | 'wide' | 'wider') => { setLetterSpacingState(value); applyLetterSpacingDOM(value); try { localStorage.setItem(LOCAL_LETTER_SPACING, value); } catch {} }, [applyLetterSpacingDOM]);
  const setLineHeight = useCallback((value: 'normal' | 'relaxed' | 'loose') => { setLineHeightState(value); applyLineHeightDOM(value); try { localStorage.setItem(LOCAL_LINE_HEIGHT, value); } catch {} }, [applyLineHeightDOM]);
  const setCustomShortcuts = useCallback((shortcuts: Record<string,string>) => { setCustomShortcutsState(shortcuts); try { localStorage.setItem(LOCAL_CUSTOM_SHORTCUTS, JSON.stringify(shortcuts)); } catch {} }, []);
  const setVoiceControl = useCallback((enabled: boolean) => { setVoiceControlState(enabled); try { localStorage.setItem(LOCAL_VOICE_CONTROL, String(enabled)); } catch {} }, []);

  // --- THEME ---
  const applyThemeDOM = (isDark: boolean) => document.documentElement.classList.toggle('dark', isDark);
  const toggleDark = () => { const next = !dark; setDark(next); try { localStorage.setItem(LOCAL_THEME, next ? 'dark' : 'light'); } catch {} applyThemeDOM(next); };

  // --- PERFIL ---
  const aplicarPerfilDOM = (perfilActual: PerfilAccesibilidad) => {
    const root = document.documentElement;
    root.classList.remove('perfil-visual', 'perfil-auditiva', 'perfil-motriz', 'perfil-cognitiva');
    if (perfilActual !== 'ninguna') root.classList.add(`perfil-${perfilActual}`);

    switch(perfilActual) {
      case 'visual': root.style.setProperty('--font-size-base','1.125rem'); root.style.setProperty('--contrast-boost','1.2'); break;
      case 'auditiva': root.style.setProperty('--animation-duration','0.6s'); root.style.setProperty('--prefers-visual-alerts','1'); root.style.setProperty('--prefers-reduced-motion','1'); break;
      case 'motriz': root.style.setProperty('--target-size-min','48px'); root.style.setProperty('--spacing-interactive','1rem'); break;
      case 'cognitiva': root.style.setProperty('--content-max-width','65ch'); root.style.setProperty('--line-height','1.8'); break;
      default: ['--font-size-base','--contrast-boost','--animation-duration','--target-size-min','--spacing-interactive','--content-max-width','--line-height','--prefers-visual-alerts','--prefers-reduced-motion'].forEach(prop => root.style.removeProperty(prop));
    }
  };

  const cargarPerfil = async (apply: boolean = true): Promise<PerfilAccesibilidad | null> => {
    if (!user) return null;
    try {
      const { data, error } = await supabase.from("profiles").select("perfil_accesibilidad").eq("id", user.id).single();
      if (error) throw error;
      const perfilDb = (data?.perfil_accesibilidad as PerfilAccesibilidad) ?? 'ninguna';
      if (apply) { setPerfil(perfilDb); aplicarPerfilDOM(perfilDb); try { localStorage.setItem(LOCAL_KEY, perfilDb); } catch {} }
      return perfilDb;
    } catch (error) { console.error(error); return null; }
  };

  const aplicarPerfil = async (perfilArg?: PerfilAccesibilidad) => {
    const perfilParaAplicar = perfilArg ?? perfil;
    setPerfil(perfilParaAplicar);
    aplicarPerfilDOM(perfilParaAplicar);
    try { localStorage.setItem(LOCAL_KEY, perfilParaAplicar); } catch {}
    if (!user) return;
    try { const { error } = await supabase.from("profiles").update({ perfil_accesibilidad: perfilParaAplicar }).eq("id", user.id); if (error) throw error; } catch (error) { console.error(error); }
  };

  return (
    <AccessibilityContext.Provider value={{ 
      perfil, setPerfil, aplicarPerfil, cargarPerfil,
      dark, toggleDark,
      fontSize, setFontSize,
      highContrast, setHighContrast,
      textToSpeech, setTextToSpeech,
      linkHighlight, setLinkHighlight,
      spacing, setSpacing,
      fontFamily, setFontFamily,
      customColors, setCustomColors,
      customColorsEnabled, setCustomColorsEnabled,
      letterSpacing, setLetterSpacing,
      lineHeight, setLineHeight,
      customShortcuts, setCustomShortcuts,
      voiceControl, setVoiceControl,
    }}>
      {children}
    </AccessibilityContext.Provider>
  );
};

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (!context) throw new Error("useAccessibility must be used within an AccessibilityProvider");
  return context;
}
