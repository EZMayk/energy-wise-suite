export const translations = {
  en: {
    search_placeholder: 'Search (press "/" or Ctrl+K)',
    pages: [
      { label: 'Home', path: '/' },
      { label: 'Dashboard', path: '/dashboard' },
      { label: 'Profile', path: '/profile' },
      { label: 'Admin', path: '/admin' },
      { label: 'Contact', path: '/contact' },
    ],
    perfil: 'Profile',
    login: 'Sign in',
    notifications_test: 'Test notification',
    header: {
      local_pref_title: 'Local preference detected',
      local_pref_desc: 'A locally saved accessibility preference differs from your account setting. Use local or account preference?',
      use_local: 'Use local',
      use_account: 'Use account',
      pref_synced_title: 'Preference synced',
      pref_synced_desc: 'Your local preference was applied and synced.'
    },
    notification_test_title: 'Test notification',
    notification_test_desc: 'This is a visual test notification.',
    lang_changed_title: 'Language changed',
    logout: 'Sign out',
    profile_label: 'Profile:',
    none_label: 'None',
    footer: {
      tagline: 'Smart energy consumption management with universal accessibility.',
      legal: 'Legal',
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
      contact: 'Contact',
      copyright: '© {year} EcoSense. All rights reserved.'
    },
    sidebar: {
      navigation: 'Navigation',
      information: 'Information',
      info: 'Information',
      admin: 'Admin'
    },
    home: {
      tagline: 'Sustainability + Technology',
      hero_title_1: 'Manage your',
      hero_title_highlight: 'energy',
      hero_subtitle: 'EcoSense helps you monitor, analyze and optimize your energy consumption with an accessible interface for everyone.',
      cta_primary_logged: 'Go to Dashboard',
      cta_primary_guest: 'Get Started',
      cta_secondary: 'Learn More',
      features: [
        { title: 'Real-time Monitoring', description: 'See your daily energy consumption with up-to-date metrics.' },
        { title: 'Reduce Consumption', description: 'Receive personalized recommendations to optimize your energy.' },
        { title: 'Detailed Analysis', description: 'Charts and comprehensive reports of your consumption history.' },
        { title: 'Secure Data', description: 'Your information protected with robust authentication.' },
        { title: 'Universal Accessibility', description: 'Interface adaptable according to WCAG standards.' },
      ],
      cta_footer: 'Create Free Account',
    },
    auth: {
      welcome_title: 'Welcome',
      welcome_description: 'Sign in or create an account to get started',
      login_tab: 'Sign In',
      register_tab: 'Register',
      email_placeholder: 'you@email.com',
      remember_label: 'Remember me',
      login_button: 'Sign In',
      login_loading: 'Signing in...',
      register_button: 'Create Account',
      register_loading: 'Registering...',
      reset_summary: 'Forgot your password?',
      reset_button: 'Recover Password',
      reset_sending: 'Sending...',
      back_home: 'Return to Home',
      labels: {
        nombre: 'Full name',
        terms_text: 'I accept the terms and privacy policy',
      }
    },
    dashboard: {
      title: 'Consumption Dashboard',
      subtitle: 'Manage and visualize your energy consumption',
      cards: {
        device: 'Device',
        device_label: 'name',
        rated_power: 'Nominal Power',
        rated_power_label: 'configured power',
        current_power: 'Current Power',
        current_power_label: 'instant estimation (W)'
      },
      history: {
        title: 'Consumption History',
        last_hours: 'Last {n} hours',
        last_days: 'Last {n} days'
      },
      select_device: 'Select device',
      viewModes: {
        hourly: 'Hourly (by hour)',
        daily: 'Daily'
      },
      chart: {
        y_hourly: 'Watts (W)',
        y_daily: 'kWh'
      },
      no_data: 'No consumption data yet for the selected device.',
      devices: {
        title: 'My Devices',
        description: 'Add and manage the electrical devices associated with your account',
        labels: {
          name: 'Device name',
          power: 'Power (W)'
        },
        placeholders: {
          name: 'e.g. Refrigerator',
          power: 'e.g. 1500'
        },
        add_button: 'Add device',
        no_devices: 'No devices. Add one above.'
      },
      messages: {
        error_load_consumption: 'Error loading consumption data',
        device_added: 'Device added',
        device_added_with_record: 'Device added and initial daily record created',
        error_add_device: 'Error adding device'
      }
    },
    profile: {
      title: 'My Profile',
      description: 'View and edit your account details',
      email_note: 'Email is tied to your account. To change it, use account management.',
      messages: {
        error_load: 'Could not load profile',
        name_too_short: 'Name must be at least 2 characters',
        updated: 'Profile updated',
        error_update: 'Could not update profile'
      }
    },
    privacy: {
      title: 'Privacy Policy',
      last_updated: 'Last updated: {date}',
      sections: {
        '1': { title: '1. Information Collection' },
        '2': { title: '2. Use of Information' },
        '3': { title: '3. Data Protection' },
        '4': { title: '4. Share Information' },
        '5': { title: '5. Your Rights' },
        '6': { title: '6. Cookies and Similar Technologies' },
        '7': { title: '7. Changes to this Policy' },
        '8': { title: '8. Contact' }
      },
      contact_paragraph: 'If you have questions about this Privacy Policy, contact us through our',
      contact_link: 'contact page'
    },
    terms: {
      title: 'Terms of Use',
      last_updated: 'Last updated: {date}',
      sections: {
        '1': { title: '1. Acceptance of Terms' },
        '2': { title: '2. Service Description' },
        '3': { title: '3. User Registration and Account' },
        '4': { title: '4. Acceptable Use' },
        '5': { title: '5. Intellectual Property' },
        '6': { title: '6. Privacy and Data' },
        '7': { title: '7. Limitation of Liability' },
        '8': { title: '8. Service Modifications' },
        '9': { title: '9. Termination' },
        '10': { title: '10. Applicable Law' },
        '11': { title: '11. Contact' }
      },
      contact_paragraph: 'If you have questions about these Terms of Use, contact us through our',
      contact_link: 'contact page'
    },
    contact: {
      title: 'Contact Us',
      subtitle: 'Have a question? We are here to help.',
      messages: {
        sent: 'Message sent successfully! We will reply soon.',
        error_send: 'Error sending message. Please try again.'
      },
      form: {
        title: 'Send us a message',
        description: 'Fill out the form and we will contact you as soon as possible.',
        labels: {
          name: 'Full name',
          email: 'Email address',
          message: 'Message'
        },
        placeholders: {
          name: 'Your name',
          email: 'your@email.com',
          message: 'Write your message here...'
        },
        send_button: 'Send message',
        sending: 'Sending...'
      },
      info: {
        title: 'Contact information',
        description: 'You can also contact us directly through these means.',
        labels: {
          email: 'Email',
          phone: 'Phone',
          address: 'Address'
        }
      },
      hours: {
        title: 'Office hours'
      },
      faq: {
        title: 'Frequently asked questions'
      }
    },
    notfound: {
      message: 'Oops! Page not found',
      home_link: 'Return to Home'
    }
  },
  es: {
    search_placeholder: 'Buscar (presiona "/" o Ctrl+K)',
    pages: [
      { label: 'Inicio', path: '/' },
      { label: 'Dashboard', path: '/dashboard' },
      { label: 'Perfil', path: '/profile' },
      { label: 'Admin', path: '/admin' },
      { label: 'Contacto', path: '/contact' },
    ],
    perfil: 'Perfil',
    login: 'Iniciar Sesión',
    notifications_test: 'Notificación de prueba',
    header: {
      local_pref_title: 'Preferencia local detectada',
      local_pref_desc: 'Se encontró una preferencia de accesibilidad guardada localmente que difiere de la configurada en tu cuenta. ¿Deseas usar tu preferencia local o la de tu cuenta?',
      use_local: 'Usar local',
      use_account: 'Usar cuenta',
      pref_synced_title: 'Preferencia sincronizada',
      pref_synced_desc: 'Se aplicó y sincronizó tu preferencia local.'
    },
    notification_test_title: 'Notificación de prueba',
    notification_test_desc: 'Esta es una notificación visual de prueba.',
    lang_changed_title: 'Idioma cambiado',
    logout: 'Cerrar sesión',
    profile_label: 'Perfil:',
    none_label: 'Ninguno',
    footer: {
      tagline: 'Gestión inteligente de consumo energético con accesibilidad universal.',
      legal: 'Legal',
      privacy: 'Política de privacidad',
      terms: 'Términos de servicio',
      contact: 'Contacto',
      copyright: '© {year} EcoSense. Todos los derechos reservados.'
    },
    sidebar: {
      navigation: 'Navegación',
      information: 'Información',
      info: 'Información',
      admin: 'Admin'
    },
    home: {
      tagline: 'Sostenibilidad + Tecnología',
      hero_title_1: 'Gestiona tu',
      hero_title_highlight: 'energía',
      hero_subtitle: 'EcoSense te ayuda a monitorear, analizar y optimizar tu consumo energético con una interfaz completamente accesible para todos.',
      cta_primary_logged: 'Ir al Dashboard',
      cta_primary_guest: 'Comenzar Gratis',
      cta_secondary: 'Conocer Más',
      features: [
        { title: 'Monitoreo en Tiempo Real', description: 'Visualiza tu consumo energético diario con métricas actualizadas.' },
        { title: 'Reduce tu Consumo', description: 'Recibe recomendaciones personalizadas para optimizar tu energía.' },
        { title: 'Análisis Detallado', description: 'Gráficas y reportes completos de tu historial de consumo.' },
        { title: 'Datos Seguros', description: 'Tu información protegida con autenticación robusta.' },
        { title: 'Accesibilidad Universal', description: 'Interfaz adaptable según WCAG 2.2 para todos los usuarios.' },
      ],
      cta_footer: 'Crear Cuenta Gratuita',
    },
    auth: {
      welcome_title: 'Bienvenido',
      welcome_description: 'Inicia sesión o crea una cuenta para comenzar',
      login_tab: 'Iniciar Sesión',
      register_tab: 'Registrarse',
      email_placeholder: 'tu@email.com',
      remember_label: 'Recordarme',
      login_button: 'Iniciar Sesión',
      login_loading: 'Iniciando...',
      register_button: 'Crear Cuenta',
      register_loading: 'Registrando...',
      reset_summary: '¿Olvidaste tu contraseña?',
      reset_button: 'Recuperar Contraseña',
      reset_sending: 'Enviando...',
      back_home: 'Volver al inicio',
      labels: {
        nombre: 'Nombre completo',
        terms_text: 'Acepto los términos y la política de privacidad',
      }
    },
    dashboard: {
      title: 'Dashboard de Consumo',
      subtitle: 'Gestiona y visualiza tu consumo energético',
      cards: {
        device: 'Dispositivo',
        device_label: 'nombre',
        rated_power: 'Potencia nominal',
        rated_power_label: 'potencia configurada',
        current_power: 'Potencia actual',
        current_power_label: 'estimación instantánea (W)'
      },
      history: {
        title: 'Historial de Consumo',
        last_hours: 'Últimas {n} horas',
        last_days: 'Últimos {n} días'
      },
      select_device: 'Selecciona dispositivo',
      viewModes: {
        hourly: 'Horario (por hora)',
        daily: 'Diario'
      },
      chart: {
        y_hourly: 'Watts (W)',
        y_daily: 'kWh'
      },
      no_data: 'No hay datos de consumo aún para el dispositivo seleccionado.',
      devices: {
        title: 'Mis Dispositivos',
        description: 'Agrega y administra los dispositivos eléctricos asociados a tu cuenta',
        labels: {
          name: 'Nombre del dispositivo',
          power: 'Potencia (W)'
        },
        placeholders: {
          name: 'Ej. Nevera',
          power: 'Ej. 1500'
        },
        add_button: 'Agregar dispositivo',
        no_devices: 'No hay dispositivos. Agrega uno arriba.'
      },
      messages: {
        error_load_consumption: 'Error al cargar datos de consumo',
        device_added: 'Dispositivo agregado',
        device_added_with_record: 'Dispositivo agregado y registro diario inicial creado',
        error_add_device: 'Error al agregar dispositivo'
      }
    },
    profile: {
      title: 'Mi Perfil',
      description: 'Ver y editar los datos de tu cuenta',
      email_note: 'El correo está asociado a tu cuenta. Para cambiarlo, utiliza la gestión de cuenta.',
      messages: {
        error_load: 'No se pudo cargar el perfil',
        name_too_short: 'El nombre debe tener al menos 2 caracteres',
        updated: 'Perfil actualizado',
        error_update: 'No se pudo actualizar el perfil'
      }
    },
    privacy: {
      title: 'Política de Privacidad',
      last_updated: 'Última actualización: {date}',
      sections: {
        '1': { title: '1. Recopilación de Información' },
        '2': { title: '2. Uso de la Información' },
        '3': { title: '3. Protección de Datos' },
        '4': { title: '4. Compartir Información' },
        '5': { title: '5. Sus Derechos' },
        '6': { title: '6. Cookies y Tecnologías Similares' },
        '7': { title: '7. Cambios a esta Política' },
        '8': { title: '8. Contacto' }
      },
      contact_paragraph: 'Si tiene preguntas sobre esta Política de Privacidad, contáctenos a través de nuestra',
      contact_link: 'página de contacto'
    },
    terms: {
      title: 'Términos de Uso',
      last_updated: 'Última actualización: {date}',
      sections: {
        '1': { title: '1. Aceptación de los Términos' },
        '2': { title: '2. Descripción del Servicio' },
        '3': { title: '3. Registro y Cuenta de Usuario' },
        '4': { title: '4. Uso Aceptable' },
        '5': { title: '5. Propiedad Intelectual' },
        '6': { title: '6. Privacidad y Datos' },
        '7': { title: '7. Limitación de Responsabilidad' },
        '8': { title: '8. Modificaciones del Servicio' },
        '9': { title: '9. Terminación' },
        '10': { title: '10. Ley Aplicable' },
        '11': { title: '11. Contacto' }
      },
      contact_paragraph: 'Si tiene preguntas sobre estos Términos de Uso, contáctenos a través de nuestra',
      contact_link: 'página de contacto'
    },
    contact: {
      title: 'Contáctanos',
      subtitle: '¿Tienes alguna pregunta? Estamos aquí para ayudarte.',
      messages: {
        sent: '¡Mensaje enviado correctamente! Te responderemos pronto.',
        error_send: 'Error al enviar el mensaje. Por favor, intenta de nuevo.'
      },
      form: {
        title: 'Envíanos un mensaje',
        description: 'Completa el formulario y nos pondremos en contacto contigo lo antes posible.',
        labels: {
          name: 'Nombre completo',
          email: 'Correo electrónico',
          message: 'Mensaje'
        },
        placeholders: {
          name: 'Tu nombre',
          email: 'tu@email.com',
          message: 'Escribe tu mensaje aquí...'
        },
        send_button: 'Enviar mensaje',
        sending: 'Enviando...'
      },
      info: {
        title: 'Información de contacto',
        description: 'También puedes contactarnos directamente a través de estos medios.',
        labels: {
          email: 'Email',
          phone: 'Teléfono',
          address: 'Dirección'
        }
      },
      hours: {
        title: 'Horario de atención'
      },
      faq: {
        title: 'Preguntas frecuentes'
      }
    },
    notfound: {
      message: '¡Vaya! Página no encontrada',
      home_link: 'Volver al inicio'
    }
  },
};

export type Lang = 'es' | 'en';
