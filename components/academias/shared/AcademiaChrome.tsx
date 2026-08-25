import Link from 'next/link';
import { Logo } from '@/components/layout/Logo';
import { siteConfig } from '@/lib/site-config';

interface AcademiaTopBarProps {
  /** Legenda abaixo do nome, ex.: "Simulador para academias". */
  subtitle: string;
  /** Pílula à direita — some no mobile. */
  pill?: string;
}

export function AcademiaTopBar({ subtitle, pill }: AcademiaTopBarProps) {
  return (
    <header className="topbar">
      <Link href="/" className="brand" aria-label={`${siteConfig.name} — voltar ao site`}>
        <Logo size="md" priority />
        <span className="brand-sub">{subtitle}</span>
      </Link>
      {pill ? <div className="top-pill">{pill}</div> : null}
    </header>
  );
}

export function AcademiaFooter({ children }: { children: React.ReactNode }) {
  return (
    <footer className="site-footer">
      {children} · <Link href="/">Conheça a {siteConfig.name}</Link>
    </footer>
  );
}
