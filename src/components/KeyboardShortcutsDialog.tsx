import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

interface KeyboardShortcutsDialogProps {
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const KeyboardShortcutsDialog: React.FC<KeyboardShortcutsDialogProps> = ({
  isOpen: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const onOpenChange = controlledOnOpenChange || setInternalOpen;

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const isCmd = e.ctrlKey || e.metaKey;
      // Show shortcuts on Cmd/Ctrl+Shift+?
      if (isCmd && e.shiftKey && e.key === "?") {
        e.preventDefault();
        onOpenChange(true);
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onOpenChange]);

  const shortcuts = [
    { keys: ["/"], description: "Enfocar búsqueda global" },
    { keys: ["Ctrl", "K"], description: "Enfocar búsqueda global" },
    { keys: ["Ctrl", "D"], description: "Ir al Dashboard" },
    { keys: ["Ctrl", "P"], description: "Ir a Perfil" },
    { keys: ["Ctrl", "H"], description: "Ir a Inicio" },
    { keys: ["Ctrl", "R"], description: "Refrescar datos" },
    { keys: ["Ctrl", "B"], description: "Alternar barra lateral" },
    { keys: ["Ctrl", "Shift", "L"], description: "Cambiar idioma" },
    { keys: ["Ctrl", "Shift", "?"], description: "Mostrar ayuda de atajos" },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Atajos de Teclado</DialogTitle>
          <DialogDescription>
            Utiliza estos atajos para navegar más rápidamente
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {shortcuts.map((shortcut, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {shortcut.description}
              </span>
              <div className="flex gap-1">
                {shortcut.keys.map((key, keyIndex) => (
                  <React.Fragment key={keyIndex}>
                    <Badge variant="outline" className="font-mono text-xs px-2">
                      {key}
                    </Badge>
                    {keyIndex < shortcut.keys.length - 1 && (
                      <span className="text-xs text-muted-foreground">+</span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
