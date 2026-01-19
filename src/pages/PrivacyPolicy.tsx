import { useMetrics } from "@/hooks/useMetrics";
import { useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function PrivacyPolicy() {
  const { trackPageView } = useMetrics("privacy");
  const { t } = useLanguage();

  useEffect(() => {
    trackPageView();
  }, [trackPageView]);

  return (
    <div className="container max-w-4xl py-8 space-y-6">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          {t('privacy')?.title ?? 'Política de Privacidad'}
        </h1>
        <p className="text-muted-foreground">
          {(t('privacy')?.last_updated ?? 'Última actualización: {date}').replace('{date}', new Date().toLocaleDateString('es-ES'))}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('privacy')?.sections?.['1']?.title ?? '1. Recopilación de Información'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            En EcoSense, recopilamos información que usted nos proporciona directamente, como:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Nombre y dirección de correo electrónico al registrarse</li>
            <li>Datos de consumo energético que ingrese en la plataforma</li>
            <li>Preferencias de accesibilidad seleccionadas</li>
            <li>Métricas de uso de la aplicación para mejorar la experiencia</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('privacy')?.sections?.['2']?.title ?? '2. Uso de la Información'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            Utilizamos la información recopilada para:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Proveer y mantener nuestros servicios</li>
            <li>Personalizar su experiencia según sus preferencias de accesibilidad</li>
            <li>Analizar patrones de consumo energético</li>
            <li>Mejorar nuestros servicios mediante análisis de métricas de usabilidad</li>
            <li>Comunicarnos con usted sobre actualizaciones y cambios en el servicio</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('privacy')?.sections?.['3']?.title ?? '3. Protección de Datos'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            Implementamos medidas de seguridad técnicas y organizativas para proteger sus datos personales:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Cifrado de datos en tránsito y en reposo</li>
            <li>Autenticación segura mediante Supabase Auth</li>
            <li>Políticas de seguridad a nivel de fila (RLS) en la base de datos</li>
            <li>Acceso restringido a datos sensibles solo para personal autorizado</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('privacy')?.sections?.['4']?.title ?? '4. Compartir Información'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            No vendemos ni compartimos su información personal con terceros, excepto:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Cuando sea requerido por ley</li>
            <li>Con proveedores de servicios que nos ayudan a operar la plataforma (como Supabase)</li>
            <li>Con su consentimiento explícito</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('privacy')?.sections?.['5']?.title ?? '5. Sus Derechos'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            Usted tiene derecho a:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Acceder a sus datos personales</li>
            <li>Rectificar datos inexactos</li>
            <li>Solicitar la eliminación de sus datos</li>
            <li>Oponerse al procesamiento de sus datos</li>
            <li>Solicitar la portabilidad de sus datos</li>
          </ul>
          <p className="mt-4">
            Para ejercer estos derechos, contáctenos a través de nuestra página de contacto.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('privacy')?.sections?.['6']?.title ?? '6. Cookies y Tecnologías Similares'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            Utilizamos cookies y tecnologías similares para:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Mantener su sesión activa</li>
            <li>Recordar sus preferencias de accesibilidad</li>
            <li>Analizar el uso de la aplicación</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('privacy')?.sections?.['7']?.title ?? '7. Cambios a esta Política'}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            Podemos actualizar esta política de privacidad ocasionalmente. Le notificaremos sobre cambios significativos 
            publicando la nueva política en esta página y actualizando la fecha de "última actualización".
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('privacy')?.sections?.['8']?.title ?? '8. Contacto'}</CardTitle>
        </CardHeader>
        <CardContent>
            <p>
            {t('privacy')?.contact_paragraph ?? 'Si tiene preguntas sobre esta Política de Privacidad, contáctenos a través de nuestra'} 
            <a href="/contact" className="text-primary hover:underline ml-1">{t('privacy')?.contact_link ?? 'página de contacto'}</a>.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
