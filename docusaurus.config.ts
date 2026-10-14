import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// Se ejecuta en Node.js: no usar código de cliente (APIs del navegador, JSX...).

const config: Config = {
  title: 'BillyApp',
  tagline: 'Documentación técnica de la app móvil de cobranza automática de Oblicua',
  favicon: 'img/favicon.png',

  future: {
    v4: true,
  },

  // Publicado como GitHub Pages de proyecto (.github/workflows/deploy.yml):
  // sirve bajo /billyapp-docs/, no en la raíz del dominio.
  url: 'https://dreinova.github.io',
  baseUrl: '/billyapp-docs/',
  organizationName: 'Dreinova',
  projectName: 'billyapp-docs',

  onBrokenLinks: 'throw',
  onBrokenAnchors: 'throw',

  i18n: {
    defaultLocale: 'es',
    locales: ['es'],
  },

  markdown: {
    mermaid: true,
    hooks: {
      onBrokenMarkdownLinks: 'throw',
    },
  },

  themes: ['@docusaurus/theme-mermaid'],

  // Plus Jakarta Sans: la misma familia que carga la app (@expo-google-fonts/plus-jakarta-sans).
  stylesheets: [
    {
      href: 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap',
      type: 'text/css',
    },
  ],

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/social-card.png',
    colorMode: {
      respectPrefersColorScheme: true,
    },
    docs: {
      sidebar: {
        hideable: true,
      },
    },
    tableOfContents: {
      minHeadingLevel: 2,
      maxHeadingLevel: 3,
    },
    navbar: {
      title: 'Billy',
      logo: {
        alt: 'Billy by Oblicua',
        src: 'img/logo-mark.png',
        className: 'billy-navbar-logo',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docs',
          position: 'left',
          label: 'Documentación',
        },
        {to: '/docs/arquitectura/vision-general', label: 'Arquitectura', position: 'left'},
        {to: '/docs/datos/api-backend', label: 'API', position: 'left'},
        {to: '/docs/pendientes', label: 'Pendientes', position: 'left'},
        {
          href: 'https://billy.oblicua.co',
          label: 'billy.oblicua.co',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'light',
      links: [
        {
          title: 'Empezar',
          items: [
            {label: 'Introducción', to: '/docs/intro'},
            {label: 'Instalación', to: '/docs/primeros-pasos/instalacion'},
            {label: 'Configuración', to: '/docs/primeros-pasos/configuracion'},
          ],
        },
        {
          title: 'Producto',
          items: [
            {label: 'Autenticación', to: '/docs/funcionalidades/autenticacion'},
            {label: 'Cobranza automática', to: '/docs/funcionalidades/cobranza-automatica'},
            {label: 'Sistema de diseño', to: '/docs/interfaz/sistema-de-diseno'},
          ],
        },
        {
          title: 'Operación',
          items: [
            {label: 'Builds y publicación', to: '/docs/despliegue/builds-y-publicacion'},
            {label: 'Diagnóstico', to: '/docs/despliegue/diagnostico'},
            {label: 'Pendientes', to: '/docs/pendientes'},
          ],
        },
        {
          title: 'Oblicua',
          items: [
            {label: 'Billy web', href: 'https://billy.oblicua.co'},
            {label: 'Política de privacidad', href: 'https://www.web.oblicua.co/politica-privacidad'},
          ],
        },
      ],
      copyright: `© ${new Date().getFullYear()} Oblicua · Documentación técnica de BillyApp`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.oneDark,
      additionalLanguages: ['bash', 'json'],
    },
    mermaid: {
      theme: {light: 'base', dark: 'dark'},
      options: {
        fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
      },
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
