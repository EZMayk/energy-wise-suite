import { Leaf, Mail, Github, Twitter } from "lucide-react";
import { useLanguage } from '@/contexts/LanguageContext';

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { t } = useLanguage();

  return (
    <footer className="border-t bg-background mt-auto">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center">
                <Leaf className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                EcoSense
              </span>
            </div>
            <p className="text-sm text-muted-foreground">{t('footer')?.tagline ?? 'Gestión inteligente de consumo energético con accesibilidad universal.'}</p>
          </div>

          {/* Links */}
          <div className="space-y-3">
            <h3 className="font-semibold">{t('footer')?.legal ?? 'Legal'}</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="/privacy" className="hover:text-primary transition-colors">
                  {t('footer')?.privacy ?? 'Política de privacidad'}
                </a>
              </li>
              <li>
                <a href="/terms" className="hover:text-primary transition-colors">
                  {t('footer')?.terms ?? 'Términos de servicio'}
                </a>
              </li>
              <li>
                <a href="/contact" className="hover:text-primary transition-colors">
                  {t('footer')?.contact ?? 'Contacto'}
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-3">
            <h3 className="font-semibold">{t('footer')?.contact ?? 'Contacto'}</h3>
            <div className="flex gap-4">
              <a
                href="mailto:info@ecosense.com"
                className="h-9 w-9 rounded-lg bg-muted hover:bg-primary hover:text-primary-foreground transition-colors flex items-center justify-center"
                aria-label="Email"
              >
                <Mail className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="h-9 w-9 rounded-lg bg-muted hover:bg-primary hover:text-primary-foreground transition-colors flex items-center justify-center"
                aria-label="GitHub"
              >
                <Github className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="h-9 w-9 rounded-lg bg-muted hover:bg-primary hover:text-primary-foreground transition-colors flex items-center justify-center"
                aria-label="Twitter"
              >
                <Twitter className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t text-center text-sm text-muted-foreground">
          <p>{(t('footer')?.copyright ?? '© {year} EcoSense. Todos los derechos reservados.').replace('{year}', String(currentYear))}</p>
        </div>
      </div>
    </footer>
  );
};
