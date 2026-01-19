import { useMetrics } from "@/hooks/useMetrics";
import { useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TermsOfService() {
  const { trackPageView } = useMetrics("terms");
  const { t } = useLanguage();

  useEffect(() => {
    trackPageView();
  }, [trackPageView]);

  return (
    <div className="container max-w-4xl py-8 space-y-6">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          {t('terms')?.title ?? 'Términos de Uso'}
        </h1>
        <p className="text-muted-foreground">
          {(t('terms')?.last_updated ?? 'Última actualización: {date}').replace('{date}', new Date().toLocaleDateString('es-ES'))}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('terms')?.sections?.['1']?.title ?? '1. Aceptación de los Términos'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            Al acceder y utilizar EcoSense, usted acepta estar sujeto a estos Términos de Uso. 
            Si no está de acuerdo con alguna parte de estos términos, no debe utilizar nuestros servicios.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('terms')?.sections?.['2']?.title ?? '2. Descripción del Servicio'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            EcoSense es una plataforma de gestión de consumo energético que permite a los usuarios:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Registrar y monitorear su consumo energético</li>
            <li>Visualizar reportes y análisis de eficiencia energética</li>
            <li>Acceder a funcionalidades de accesibilidad personalizadas</li>
            <li>Gestionar dispositivos y su consumo</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('terms')?.sections?.['3']?.title ?? '3. Registro y Cuenta de Usuario'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            Para utilizar ciertas funcionalidades, debe crear una cuenta. Usted se compromete a:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Proporcionar información precisa y actualizada</li>
            <li>Mantener la seguridad de su contraseña</li>
            <li>Notificarnos inmediatamente sobre cualquier uso no autorizado de su cuenta</li>
            <li>Ser responsable de todas las actividades bajo su cuenta</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('terms')?.sections?.['4']?.title ?? '4. Uso Aceptable'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            Usted acepta NO utilizar EcoSense para:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Violar leyes o regulaciones aplicables</li>
            <li>Transmitir contenido malicioso, difamatorio o ilegal</li>
            <li>Intentar acceder a sistemas o datos sin autorización</li>
            <li>Interferir con el funcionamiento normal del servicio</li>
            <li>Realizar ingeniería inversa de la plataforma</li>
            <li>Utilizar el servicio para propósitos comerciales sin autorización</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('terms')?.sections?.['5']?.title ?? '5. Propiedad Intelectual'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            Todo el contenido, diseño, código y marcas de EcoSense son propiedad de la plataforma o 
            sus licenciantes. No se le otorga ningún derecho sobre la propiedad intelectual excepto 
            el uso limitado del servicio según estos términos.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('terms')?.sections?.['6']?.title ?? '6. Privacidad y Datos'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            El uso de sus datos personales está regido por nuestra 
            <a href="/privacy" className="text-primary hover:underline mx-1">Política de Privacidad</a>. 
            Al utilizar EcoSense, usted consiente la recopilación y uso de datos según se describe en dicha política.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('terms')?.sections?.['7']?.title ?? '7. Limitación de Responsabilidad'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            EcoSense se proporciona "tal cual" sin garantías de ningún tipo. No nos hacemos responsables de:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Daños directos, indirectos o consecuentes derivados del uso del servicio</li>
            <li>Pérdida de datos o interrupciones del servicio</li>
            <li>Decisiones tomadas basándose en la información proporcionada</li>
            <li>Acceso no autorizado a sus datos debido a brechas de seguridad</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('terms')?.sections?.['8']?.title ?? '8. Modificaciones del Servicio'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            Nos reservamos el derecho de:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Modificar o discontinuar el servicio en cualquier momento</li>
            <li>Actualizar estos términos de uso</li>
            <li>Cambiar precios o planes (si aplicable)</li>
            <li>Suspender o terminar cuentas que violen estos términos</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('terms')?.sections?.['9']?.title ?? '9. Terminación'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            Podemos terminar o suspender su cuenta inmediatamente, sin previo aviso, si:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Viola estos Términos de Uso</li>
            <li>Proporciona información falsa</li>
            <li>Realiza actividades fraudulentas o ilegales</li>
            <li>Por solicitud de autoridades legales</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('terms')?.sections?.['10']?.title ?? '10. Ley Aplicable'}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            Estos términos se rigen por las leyes aplicables. Cualquier disputa será resuelta en los 
            tribunales competentes correspondientes.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('terms')?.sections?.['11']?.title ?? '11. Contacto'}</CardTitle>
        </CardHeader>
        <CardContent>
            <p>
            {t('terms')?.contact_paragraph ?? 'Si tiene preguntas sobre estos Términos de Uso, contáctenos a través de nuestra'} 
            <a href="/contact" className="text-primary hover:underline ml-1">{t('terms')?.contact_link ?? 'página de contacto'}</a>.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
