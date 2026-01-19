import { useEffect } from 'react';
import { useVoiceControl } from '@/hooks/useVoiceControl';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';

/**
 * Componente que activa todas las funcionalidades de accesibilidad avanzadas:
 * - Control por voz
 * - Atajos de teclado
 * - Gestión del DOM para estilos dinámicos
 */
export const AccessibilityFeatures = () => {
  // Activar control por voz
  useVoiceControl();
  
  // Activar atajos de teclado
  useKeyboardShortcuts();

  // Agregar un enlace "skip to content" para navegación por teclado
  useEffect(() => {
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.className = 'skip-link';
    skipLink.textContent = 'Saltar al contenido principal';
    skipLink.setAttribute('aria-label', 'Saltar al contenido principal');
    
    document.body.insertBefore(skipLink, document.body.firstChild);

    // Agregar id al contenido principal si no existe
    const main = document.querySelector('main');
    if (main && !main.id) {
      main.id = 'main-content';
    }

    return () => {
      if (skipLink.parentNode) {
        skipLink.parentNode.removeChild(skipLink);
      }
    };
  }, []);

  // Este componente no renderiza nada visible
  return null;
};