import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import styles from './index.module.css';

const STACK = [
  {label: 'Expo SDK', value: '57'},
  {label: 'React Native', value: '0.86'},
  {label: 'Navegación', value: 'expo-router'},
  {label: 'Backend', value: 'Strapi v5'},
];

const SECTIONS: {eyebrow: string; title: string; text: string; to: string}[] = [
  {eyebrow: 'Primeros pasos', title: 'Instalar y ejecutar', text: 'Requisitos, variables de entorno, development build y Expo Go.', to: '/docs/primeros-pasos/instalacion'},
  {eyebrow: 'Arquitectura', title: 'Cómo está construida', text: 'Capas, rutas protegidas, cliente HTTP y carga de datos.', to: '/docs/arquitectura/vision-general'},
  {eyebrow: 'Funcionalidades', title: 'Qué hace cada pantalla', text: 'Autenticación, inicio, facturas, deudores, plan y cobranza automática.', to: '/docs/funcionalidades/autenticacion'},
  {eyebrow: 'Datos', title: 'Modelo y API', text: 'Entidades de Strapi que consume la app y cada endpoint utilizado.', to: '/docs/datos/api-backend'},
  {eyebrow: 'Interfaz', title: 'Billy Design System', text: 'Tokens de color, tipografía, espaciado y componentes de src/ui.', to: '/docs/interfaz/sistema-de-diseno'},
  {eyebrow: 'Operación', title: 'Builds y publicación', text: 'Perfiles de EAS, firma, tiendas y diagnóstico de errores.', to: '/docs/despliegue/builds-y-publicacion'},
];

function Hero(): ReactNode {
  return (
    <header className={styles.hero}>
      <div className={styles.heroText}>
        <p className={styles.eyebrow}>Documentación técnica</p>
        <Heading as="h1" className={styles.title}>
          BillyApp, <span>por dentro</span>
        </Heading>
        <p className={styles.lead}>
          La app móvil de cobranza automática de Oblicua: sesión con huella o Face ID, saldo y actividad,
          facturas, deudores y ajustes de cobranza, conectada directamente a la API de Strapi.
        </p>
        <div className={styles.actions}>
          <Link className={styles.primary} to="/docs/intro">
            Empezar
          </Link>
          <Link className={styles.secondary} to="/docs/arquitectura/vision-general">
            Ver arquitectura
          </Link>
        </div>
      </div>
      <div className={styles.phone} aria-hidden>
        <img src={useBaseUrl('/img/screens/01-inicio.png')} alt="" width={1080} height={2400} />
      </div>
    </header>
  );
}

export default function Home(): ReactNode {
  return (
    <Layout title="Inicio" description="Documentación técnica de BillyApp, la app móvil de cobranza automática de Oblicua.">
      <main className={styles.main}>
        <Hero />

        <section className={styles.balance} aria-label="Stack principal">
          <div className={styles.balanceHead}>
            <span>Stack principal</span>
            <span className={styles.pill}>v1.0.0</span>
          </div>
          <dl className={styles.stack}>
            {STACK.map((s) => (
              <div key={s.label}>
                <dt>{s.label}</dt>
                <dd>{s.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section aria-labelledby="secciones">
          <Heading as="h2" id="secciones" className={styles.sectionTitle}>
            Explorar la documentación
          </Heading>
          <div className={styles.grid}>
            {SECTIONS.map((s) => (
              <Link key={s.to} to={s.to} className={styles.card}>
                <span className={styles.cardEyebrow}>{s.eyebrow}</span>
                <span className={styles.cardTitle}>{s.title}</span>
                <span className={styles.cardText}>{s.text}</span>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </Layout>
  );
}
