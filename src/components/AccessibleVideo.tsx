import React from "react";
import { useAccessibility } from "@/contexts/AccessibilityContext";

interface AccessibleVideoProps extends React.VideoHTMLAttributes<HTMLVideoElement> {
  src: string;
  captionsSrc?: string; // VTT file URL
}

export const AccessibleVideo: React.FC<AccessibleVideoProps> = ({ src, captionsSrc, ...rest }) => {
  const { perfil } = useAccessibility();

  return (
    <div className="w-full">
      
      <video
        src={src}
        controls
        {...rest}
        className={`w-full ${rest.className ?? ""}`}
        aria-label={rest['aria-label'] ?? 'Video accesible'}
      >
        {captionsSrc && (
          <track
            kind="captions"
            srcLang="es"
            src={captionsSrc}
            default={perfil === 'auditiva'}
          />
        )}
        {/* Fallback text for browsers without video support */}
        Tu navegador no soporta el elemento de video.
      </video>
    </div>
  );
};

export default AccessibleVideo;
