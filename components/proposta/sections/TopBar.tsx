'use client';

import Link from 'next/link';
import { Logo } from '@/components/layout/Logo';
import { PROPOSAL_CONTENT } from '@/lib/proposal-content';

export function TopBar() {
  return (
    <div className="top">
      <div className="wrap">
        <Link href="/" aria-label="Prontta Saúde" style={{ display: 'flex', alignItems: 'center' }}>
          <Logo size="sm" />
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Link href="/" className="back">
            ← Voltar ao site
          </Link>
          <a className="cta" href="#contato">
            {PROPOSAL_CONTENT.cta.primary}
          </a>
        </div>
      </div>
    </div>
  );
}
