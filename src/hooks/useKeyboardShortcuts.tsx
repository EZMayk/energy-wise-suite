import { useEffect, useCallback } from 'react';
import { useAccessibility } from '@/contexts/AccessibilityContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

// Atajos de teclado predeterminados
const DEFAULT_SHORTCUTS = {
  'ctrl+d': 'toggleDark',
  'ctrl+shift+h': 'goHome',
  'ctrl+shift+d': 'goDashboard',
  'ctrl+shift+p': 'goProfile',
  'ctrl+=': 'increaseFontSize',
  'ctrl+-': 'decreaseFontSize',
  'ctrl+shift+c': 'toggleContrast',
  'ctrl+shift+l': 'toggleLinks',
  'ctrl+shift+?': 'showHelp',
};

export const useKeyboardShortcuts = () => {
  const { 
    customShortcuts, 
    toggleDark, 
    setFontSize, 
    fontSize,
    setHighContrast,
    highContrast,
    setLinkHighlight,
    linkHighlight,
  } = useAccessibility();
  const navigate = useNavigate();

  const showHelp = useCallback(() => {
    const shortcuts = { ...DEFAULT_SHORTCUTS, ...customShortcuts };
    const shortcutsList = Object.entries(shortcuts)
      .map(([key, action]) => `${key}: ${getActionDescription(action)}`)
      .join('\n');
    
    toast.info(`Atajos de teclado disponibles:\n${shortcutsList}`, {
      duration: 10000,
    });
  }, [customShortcuts]);

  const getActionDescription = (action: string): string => {
    const descriptions: Record<string, string> = {
      'toggleDark': 'Cambiar tema',
      'goHome': 'Ir a inicio',
      'goDashboard': 'Ir a dashboard',
      'goProfile': 'Ir a perfil',
      'increaseFontSize': 'Aumentar texto',
      'decreaseFontSize': 'Disminuir texto',
      'toggleContrast': 'Alto contraste',
      'toggleLinks': 'Resaltar enlaces',
      'showHelp': 'Mostrar ayuda',
    };
    return descriptions[action] || action;
  };

  const executeAction = useCallback((action: string) => {
    switch (action) {
      case 'toggleDark':
        toggleDark();
        toast.success('Tema cambiado');
        break;
      case 'goHome':
        navigate('/');
        toast.success('Navegando a inicio');
        break;
      case 'goDashboard':
        navigate('/dashboard');
        toast.success('Navegando a dashboard');
        break;
      case 'goProfile':
        navigate('/profile');
        toast.success('Navegando a perfil');
        break;
      case 'increaseFontSize':
        setFontSize(Math.min(fontSize + 2, 24));
        toast.success('Texto aumentado');
        break;
      case 'decreaseFontSize':
        setFontSize(Math.max(fontSize - 2, 12));
        toast.success('Texto disminuido');
        break;
      case 'toggleContrast':
        setHighContrast(!highContrast);
        toast.success(highContrast ? 'Contraste normal' : 'Alto contraste');
        break;
      case 'toggleLinks':
        setLinkHighlight(!linkHighlight);
        toast.success(linkHighlight ? 'Enlaces normales' : 'Enlaces resaltados');
        break;
      case 'showHelp':
        showHelp();
        break;
      default:
        toast.error(`Acción desconocida: ${action}`);
    }
  }, [navigate, toggleDark, setFontSize, fontSize, setHighContrast, highContrast, setLinkHighlight, linkHighlight, showHelp]);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Construir la combinación de teclas
    const keys: string[] = [];
    
    if (event.ctrlKey || event.metaKey) keys.push('ctrl');
    if (event.shiftKey) keys.push('shift');
    if (event.altKey) keys.push('alt');
    
    // Agregar la tecla principal
    let key = event.key.toLowerCase();
    
    // Manejar teclas especiales
    if (key === '+' || key === '=') key = '=';
    if (key === '-' || key === '_') key = '-';
    if (key === '?') key = '?';
    
    if (key !== 'control' && key !== 'shift' && key !== 'alt' && key !== 'meta') {
      keys.push(key);
    }
    
    const combination = keys.join('+');
    
    // Buscar en atajos personalizados primero, luego en predeterminados
    const shortcuts = { ...DEFAULT_SHORTCUTS, ...customShortcuts };
    const action = shortcuts[combination];
    
    if (action) {
      event.preventDefault();
      executeAction(action);
    }
  }, [customShortcuts, executeAction]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  return {
    shortcuts: { ...DEFAULT_SHORTCUTS, ...customShortcuts },
    showHelp,
  };
};