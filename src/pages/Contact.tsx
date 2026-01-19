import { useMetrics } from "@/hooks/useMetrics";
import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Mail, MapPin, Phone } from "lucide-react";
import { z } from "zod";

const contactSchema = z.object({
  nombre: z.string().trim().min(2, "El nombre debe tener al menos 2 caracteres").max(100),
  email: z.string().trim().email("Email inválido").max(255),
  mensaje: z.string().trim().min(10, "El mensaje debe tener al menos 10 caracteres").max(1000),
});

export default function Contact() {
  const { trackPageView, trackClick } = useMetrics("contact");
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    mensaje: "",
  });

  useEffect(() => {
    trackPageView();
  }, [trackPageView]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      contactSchema.parse(formData);
      setLoading(true);
      trackClick("submit_contact_form");

      // Simulación de envío (reemplaza con servicio real si deseas)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success(t('contact')?.messages?.sent ?? "¡Mensaje enviado correctamente! Te responderemos pronto.");
      setFormData({ nombre: "", email: "", mensaje: "" });
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.errors.forEach((err) => {
          toast.error(err.message);
        });
      } else {
        toast.error(t('contact')?.messages?.error_send ?? "Error al enviar el mensaje. Por favor, intenta de nuevo.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="container max-w-6xl py-8">
      {/* Título y subtítulo */}
      <div className="space-y-2 mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          {t('contact')?.title ?? 'Contáctanos'}
        </h1>
        <p className="text-muted-foreground text-lg">
          {t('contact')?.subtitle ?? '¿Tienes alguna pregunta? Estamos aquí para ayudarte.'}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Formulario de contacto */}
        <Card>
          <CardHeader>
            <CardTitle>{t('contact')?.form?.title ?? 'Envíanos un mensaje'}</CardTitle>
            <CardDescription>{t('contact')?.form?.description ?? 'Completa el formulario y nos pondremos en contacto contigo lo antes posible.'}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nombre">{t('contact')?.form?.labels?.name ?? 'Nombre completo'}</Label>
                <Input
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  placeholder={t('contact')?.form?.placeholders?.name ?? 'Tu nombre'}
                  required
                  maxLength={100}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">{t('contact')?.form?.labels?.email ?? 'Correo electrónico'}</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={t('contact')?.form?.placeholders?.email ?? 'tu@email.com'}
                  required
                  maxLength={255}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mensaje">{t('contact')?.form?.labels?.message ?? 'Mensaje'}</Label>
                <Textarea
                  id="mensaje"
                  name="mensaje"
                  value={formData.mensaje}
                  onChange={handleChange}
                  placeholder={t('contact')?.form?.placeholders?.message ?? 'Escribe tu mensaje aquí...'}
                  required
                  rows={6}
                  maxLength={1000}
                  className="resize-none"
                />
                <p className="text-xs text-muted-foreground text-right">{formData.mensaje.length}/1000</p>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (t('contact')?.form?.sending ?? 'Enviando...') : (t('contact')?.form?.send_button ?? 'Enviar mensaje')}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Información de contacto */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('contact')?.info?.title ?? 'Información de contacto'}</CardTitle>
              <CardDescription>{t('contact')?.info?.description ?? 'También puedes contactarnos directamente a través de estos medios.'}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-primary mt-1" />
                <div>
                  <p className="font-medium">{t('contact')?.info?.labels?.email ?? 'Email'}</p>
                  <a href="mailto:contacto@ecosense.com" className="text-muted-foreground hover:text-primary">
                    contacto@ecosense.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-primary mt-1" />
                <div>
                  <p className="font-medium">{t('contact')?.info?.labels?.phone ?? 'Teléfono'}</p>
                  <p className="text-muted-foreground">+593 96 2357 512</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary mt-1" />
                <div>
                  <p className="font-medium">{t('contact')?.info?.labels?.address ?? 'Dirección'}</p>
                  <p className="text-muted-foreground">
                    Ciudadela Universitaria<br />
                    28001 Manta, Ecuador
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Preguntas frecuentes */}
          <Card>
            <CardHeader>
              <CardTitle>{t('contact')?.faq?.title ?? 'Preguntas frecuentes'}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Antes de contactarnos, revisa nuestra sección de preguntas frecuentes. 
                Puede que encuentres la respuesta que buscas de forma inmediata.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
