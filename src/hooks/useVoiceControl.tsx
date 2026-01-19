import { useEffect, useCallback, useRef } from 'react';
import { useAccessibility } from '@/contexts/AccessibilityContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

// Define los comandos de voz disponibles
const VOICE_COMMANDS = {
  // Navegación
  'ir a inicio': '/',
  'ir a dashboard': '/dashboard',
  'ir a perfil': '/profile',
  'ir al panel': '/dashboard',
  'volver': -1,
  
  // Acciones
  'modo oscuro': 'toggleDark',
  'modo claro': 'toggleDark',
  'aumentar texto': 'increaseFontSize',
  'disminuir texto': 'decreaseFontSize',
  'alto contraste': 'toggleContrast',
  'resaltar enlaces': 'toggleLinks',
  
  // Ayuda
  'ayuda': 'showHelp',
  'comandos': 'showHelp',
  'qué puedo decir': 'showHelp',
};

export const useVoiceControl = () => {
  const { voiceControl, toggleDark, setFontSize, fontSize, setHighContrast, highContrast, setLinkHighlight, linkHighlight } = useAccessibility();
  const navigate = useNavigate();
  const recognitionRef = useRef<any>(null);
  const isListeningRef = useRef(false);

  const showHelp = useCallback(() => {
    const commandsList = Object.keys(VOICE_COMMANDS).join(', ');
    toast.info(`Comandos disponibles: ${commandsList}`, {
      duration: 10000,
    });
  }, []);

  const executeCommand = useCallback((command: string) => {
    console.log('Ejecutando comando:', command);
    const action = VOICE_COMMANDS[command as keyof typeof VOICE_COMMANDS];
    
    if (!action) {
      toast.error(`Comando "${command}" no reconocido. Di "ayuda" para ver comandos.`);
      return;
    }

    toast.info(`Comando reconocido: "${command}"`);

    // Ejecutar el comando
    if (typeof action === 'string') {
      if (action === 'toggleDark') {
        toggleDark();
        toast.success('Tema cambiado');
      } else if (action === 'increaseFontSize') {
        const newSize = Math.min(fontSize + 2, 24);
        setFontSize(newSize);
        toast.success(`Texto aumentado a ${newSize}px`);
      } else if (action === 'decreaseFontSize') {
        const newSize = Math.max(fontSize - 2, 12);
        setFontSize(newSize);
        toast.success(`Texto disminuido a ${newSize}px`);
      } else if (action === 'toggleContrast') {
        setHighContrast(!highContrast);
        toast.success(highContrast ? 'Contraste normal' : 'Alto contraste activado');
      } else if (action === 'toggleLinks') {
        setLinkHighlight(!linkHighlight);
        toast.success(linkHighlight ? 'Enlaces normales' : 'Enlaces resaltados');
      } else if (action === 'showHelp') {
        showHelp();
      } else {
        // Es una ruta de navegación
        navigate(action);
        toast.success(`Navegando a ${action}`);
      }
    } else if (typeof action === 'number') {
      // Comando de navegación hacia atrás
      navigate(action);
      toast.success('Navegando hacia atrás');
    }
  }, [navigate, toggleDark, setFontSize, fontSize, setHighContrast, highContrast, setLinkHighlight, linkHighlight, showHelp]);

  const startListening = useCallback(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast.error('Tu navegador no soporta reconocimiento de voz');
      return;
    }

    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.lang = 'es-ES';
      recognition.continuous = true;
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        isListeningRef.current = true;
        document.documentElement.classList.add('voice-control-active');
        toast.success('Control por voz activado. Di "ayuda" para ver comandos.');
      };

      recognition.onresult = (event: any) => {
        const last = event.results.length - 1;
        const transcript = event.results[last][0].transcript.toLowerCase().trim();
        
        console.log('🎤 Voz detectada:', transcript);
        toast.info(`Escuché: "${transcript}"`);
        
        executeCommand(transcript);
      };

      recognition.onerror = (event: any) => {
        console.error('Error en reconocimiento de voz:', event.error);
        if (event.error === 'no-speech') {
          toast.info('No se detectó voz. Intenta de nuevo.');
        } else if (event.error === 'not-allowed') {
          toast.error('Permiso de micrófono denegado');
        } else {
          toast.error('Error en reconocimiento de voz');
        }
      };

      recognition.onend = () => {
        if (isListeningRef.current && voiceControl) {
          // Reiniciar el reconocimiento si todavía está activado
          try {
            recognition.start();
          } catch (e) {
            console.error('Error reiniciando reconocimiento:', e);
          }
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (error) {
      console.error('Error iniciando reconocimiento de voz:', error);
      toast.error('No se pudo iniciar el control por voz');
    }
  }, [voiceControl, executeCommand]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      isListeningRef.current = false;
      document.documentElement.classList.remove('voice-control-active');
      recognitionRef.current.stop();
      recognitionRef.current = null;
      toast.info('Control por voz desactivado');
    }
  }, []);

  useEffect(() => {
    if (voiceControl) {
      startListening();
    } else {
      stopListening();
    }

    return () => {
      stopListening();
    };
  }, [voiceControl, startListening, stopListening]);

  return {
    isListening: isListeningRef.current,
    startListening,
    stopListening,
  };
};