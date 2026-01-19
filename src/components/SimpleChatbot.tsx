import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, X, Send, Sparkles, Zap, Bot } from "lucide-react";
import { Card } from "@/components/ui/card";
import { GoogleGenerativeAI } from "@google/generative-ai";

// 🔴 1. PEGA TU NUEVA API KEY (LA DE "ENERGY3") AQUÍ DENTRO DE LAS COMILLAS:
const API_KEY_DIRECTA = ""; 

const SUGERENCIAS = [
  "¿Cómo puedo ahorrar energía?",
  "Explícame las funciones",
  "¿Qué es EcoSense?",
  "Consejos de eficiencia"
];

const SYSTEM_PROMPT = `Eres un asistente virtual amigable de EcoSense, una plataforma de gestión inteligente de energía.

Tu rol es ayudar a los usuarios con:
- Información sobre monitoreo de consumo energético
- Consejos para ahorrar energía
- Explicar funcionalidades de accesibilidad
- Guiar en la navegación de la plataforma

Responde de forma:
- Breve (máximo 3-4 oraciones)
- Amigable y cercana
- Enfocada en sostenibilidad
- Con emojis ocasionales (⚡ 🌱 💡 📊)

Si no sabes algo específico de EcoSense, sé honesto y sugiere contactar soporte.`;

export const SimpleChatbot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{text: string, user: boolean}>>([
    { 
      text: "¡Hola! 👋 Soy tu asistente con IA de EcoSense. ¿En qué puedo ayudarte hoy para ahorrar energía?", 
      user: false 
    }
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Inicializar Gemini
  const getGeminiResponse = async (userMessage: string): Promise<string> => {
    try {
      // Usa la clave directa o la del entorno
      const apiKey = API_KEY_DIRECTA || import.meta.env.VITE_GEMINI_API_KEY;
      
      if (!apiKey || apiKey === "PEGA_TU_CLAVE_AQUI" || apiKey === "") {
        return "⚠️ Error: No has pegado tu API Key en la línea 10 del código.";
      }

      const genAI = new GoogleGenerativeAI(apiKey);
      
      // ✅ Usamos gemini-1.5-flash (Funcionará perfecto con tu proyecto nuevo)
      const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
      // Crear contexto con historial
      const context = messages
        .slice(-6) // Últimos 6 mensajes
        .map(msg => `${msg.user ? 'Usuario' : 'Asistente'}: ${msg.text}`)
        .join('\n');

      const prompt = `${SYSTEM_PROMPT}

Contexto de la conversación:
${context}

Usuario: ${userMessage}

Asistente:`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
      
    } catch (error: any) {
      console.error("Error con Gemini:", error);
      
      // Mensajes de error amigables
      if (error.message?.includes('404')) {
        return "⚠️ Error de configuración: El modelo no está activo en tu cuenta. Verifica tu API Key.";
      }
      if (error.message?.includes('API_KEY')) {
        return "⚠️ Error de acceso: Tu API Key no es válida.";
      }
      
      return "Lo siento, tuve un problema de conexión. ¿Puedes intentar de nuevo? 🤔";
    }
  };

  // Auto-scroll al final
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (message?: string) => {
    const userMessage = (message || input).trim();
    if (!userMessage) return;
    
    setMessages(prev => [...prev, { text: userMessage, user: true }]);
    setInput("");
    setTyping(true);

    try {
      const response = await getGeminiResponse(userMessage);
      setMessages(prev => [...prev, { text: response, user: false }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        text: "Lo siento, hubo un error al conectar. Intenta más tarde.", 
        user: false 
      }]);
    } finally {
      setTyping(false);
    }
  };

  const handleSugerencia = (sugerencia: string) => {
    handleSend(sugerencia);
  };

  return (
    <>
      {/* Botón flotante */}
      <Button
        onClick={() => setOpen(!open)}
        className="fixed bottom-4 left-4 h-12 w-12 rounded-full shadow-lg z-40 bg-gradient-to-br from-primary via-primary to-primary/80 hover:from-primary/90 hover:scale-110 transition-all duration-300"
        aria-label="Abrir asistente virtual"
      >
        <MessageCircle className="h-5 w-5 text-primary-foreground" />
        {!open && (
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse shadow-lg" />
        )}
      </Button>

      {/* Ventana del chatbot */}
      {open && (
        <Card className="fixed bottom-20 left-4 w-80 h-[480px] bg-background border-2 border-primary/20 rounded-2xl shadow-2xl z-40 flex flex-col overflow-hidden font-sans animate-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="relative px-4 py-3 bg-gradient-to-r from-primary via-primary to-primary/90 text-primary-foreground">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary-foreground/20 backdrop-blur flex items-center justify-center">
                  <Zap className="h-4 w-4 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-bold text-sm tracking-tight flex items-center gap-1">
                    Asistente IA
                    <Sparkles className="h-3 w-3" />
                  </h3>
                  <p className="text-[10px] opacity-90">Powered by Gemini</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setOpen(false)} className="h-7 w-7 text-primary-foreground hover:bg-white/20 rounded-full">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Mensajes */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-muted/5 chatbot-scrollbar">
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-2 ${msg.user ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2`}>
                {!msg.user && (
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Bot className="h-3 w-3 text-primary" />
                  </div>
                )}
                
                <div className={`max-w-[75%] px-3 py-2 rounded-xl shadow-sm ${msg.user ? 'bg-primary text-primary-foreground rounded-br-sm' : 'bg-card border border-border/50 text-card-foreground rounded-bl-sm'}`}>
                  <p className="text-xs leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                </div>
              </div>
            ))}
            
            {typing && (
              <div className="flex gap-2 justify-start">
                 <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Bot className="h-3 w-3 text-primary" />
                 </div>
                 <div className="bg-card border px-3 py-2 rounded-xl rounded-bl-sm">
                   <div className="flex gap-1">
                     <div className="w-1.5 h-1.5 bg-primary/50 rounded-full animate-bounce" />
                     <div className="w-1.5 h-1.5 bg-primary/50 rounded-full animate-bounce delay-75" />
                     <div className="w-1.5 h-1.5 bg-primary/50 rounded-full animate-bounce delay-150" />
                   </div>
                 </div>
              </div>
            )}

            {messages.length === 1 && (
              <div className="space-y-2 pt-2">
                <p className="text-[10px] text-muted-foreground text-center font-medium">Sugerencias rápidas:</p>
                <div className="grid grid-cols-2 gap-1.5">
                  {SUGERENCIAS.map((sug, i) => (
                    <Button key={i} variant="outline" size="sm" onClick={() => handleSugerencia(sug)} className="text-[10px] h-auto py-2 hover:border-primary hover:text-primary transition-colors">
                      {sug}
                    </Button>
                  ))}
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
          
          {/* Input */}
          <div className="p-3 border-t bg-background">
            <div className="flex gap-2 relative">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !typing && handleSend()}
                placeholder="Escribe tu pregunta..."
                className="pr-10 text-xs rounded-full border-muted-foreground/20 focus-visible:ring-primary h-9"
                disabled={typing}
              />
              <Button 
                onClick={() => handleSend()} 
                size="icon"
                className="absolute right-1 top-1 h-7 w-7 rounded-full bg-primary hover:bg-primary/90 transition-transform hover:scale-105"
                disabled={!input.trim() || typing}
              >
                <Send className="h-3 w-3" />
              </Button>
            </div>
            <p className="text-[9px] text-muted-foreground/60 text-center mt-1.5 flex justify-center items-center gap-1">
              <Sparkles className="h-2 w-2" /> Powered by Google Gemini AI
            </p>
          </div>
        </Card>
      )}
    </>
  );
};