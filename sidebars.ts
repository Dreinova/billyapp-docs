import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

// Se ejecuta en Node.js: no usar código de cliente (APIs del navegador, JSX...).

const sidebars: SidebarsConfig = {
  docs: [
    'intro',
    {
      type: 'category',
      label: 'Guía para usuarios',
      collapsed: false,
      items: [
        'guia-de-usuario/bienvenida',
        'guia-de-usuario/crear-cuenta-e-ingresar',
        'guia-de-usuario/pantalla-de-inicio',
        'guia-de-usuario/facturas-y-deudores',
        'guia-de-usuario/configurar-cobros-automaticos',
        'guia-de-usuario/mi-cuenta-y-plan',
        'guia-de-usuario/preguntas-frecuentes',
      ],
    },
    {
      type: 'category',
      label: 'Primeros pasos (desarrollo)',
      items: ['primeros-pasos/instalacion', 'primeros-pasos/configuracion'],
    },
    {
      type: 'category',
      label: 'Arquitectura',
      items: ['arquitectura/vision-general', 'arquitectura/navegacion', 'arquitectura/datos-y-estado'],
    },
    {
      type: 'category',
      label: 'Funcionalidades',
      items: [
        'funcionalidades/autenticacion',
        'funcionalidades/inicio',
        'funcionalidades/facturas-y-deudores',
        'funcionalidades/cuenta-y-plan',
        'funcionalidades/cobranza-automatica',
        'funcionalidades/notificaciones-push',
      ],
    },
    {
      type: 'category',
      label: 'Datos y persistencia',
      items: ['datos/modelo-de-datos', 'datos/api-backend'],
    },
    'integraciones',
    'seguridad',
    {
      type: 'category',
      label: 'Interfaz',
      items: ['interfaz/sistema-de-diseno', 'interfaz/componentes'],
    },
    'calidad',
    {
      type: 'category',
      label: 'Despliegue y mantenimiento',
      items: ['despliegue/builds-y-publicacion', 'despliegue/diagnostico'],
    },
    {
      type: 'category',
      label: 'Referencia técnica',
      items: ['referencia/modulos', 'referencia/utilidades'],
    },
    'pendientes',
  ],
};

export default sidebars;
