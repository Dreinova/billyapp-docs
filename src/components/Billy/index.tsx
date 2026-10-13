import type {ReactNode} from 'react';
import clsx from 'clsx';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './styles.module.css';

type Tone = 'neutral' | 'primary' | 'success' | 'warning' | 'danger' | 'info';

/** Réplica web de src/ui/Badge.tsx: punto = estado vivo, sin punto = categoría. */
export function Badge({children, tone = 'neutral', dot = false}: {children: ReactNode; tone?: Tone; dot?: boolean}) {
  return (
    <span className={clsx('billy-badge', `billy-badge--${tone}`)}>
      {dot ? <span className="billy-badge__dot" aria-hidden /> : null}
      {children}
    </span>
  );
}

/** Estado de verificación de lo documentado. */
export function Verified() {
  return <Badge tone="success" dot>Verificado en código</Badge>;
}
export function Unverified() {
  return <Badge tone="warning" dot>Fuera de los repositorios</Badge>;
}

export interface Swatch {
  token: string;
  value: string;
  note?: string;
}

/** Muestras de color de los tokens de src/ui/theme.ts. */
export function Swatches({items}: {items: Swatch[]}) {
  return (
    <div className={styles.swatches}>
      {items.map((s) => (
        <div key={s.token} className={styles.swatch}>
          <div className={styles.chip} style={{background: s.value}} aria-hidden />
          <div className={styles.swatchText}>
            <code>{s.token}</code>
            <span className={styles.value}>{s.value}</span>
            {s.note ? <span className={styles.note}>{s.note}</span> : null}
          </div>
        </div>
      ))}
    </div>
  );
}

export interface Screen {
  src: string;
  title: string;
  caption?: string;
}

/** Capturas reales de la app (billy-app/assets/store/raw). */
export function ScreenGallery({items}: {items: Screen[]}) {
  return (
    <div className={styles.gallery}>
      {items.map((s) => (
        <figure key={s.src} className={styles.shot}>
          <div className={styles.frame}>
            <img src={useBaseUrl(s.src)} alt={`Pantalla ${s.title}`} loading="lazy" width={1080} height={2400} />
          </div>
          <figcaption>
            <strong>{s.title}</strong>
            {s.caption ? <span>{s.caption}</span> : null}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
