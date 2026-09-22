import Link from 'next/link'
import { Logo } from './Logo'
import { siteConfig } from '@/lib/site-config'

const columns = [
  {
    label: 'PARA QUEM',
    links: [
      { name: 'Clínicas e laboratórios', href: '/#portas' },
      { name: 'Academias e studios', href: '/#portas' },
      { name: 'Empresas', href: '/#portas' },
      { name: 'Parceiros de vendas', href: '/#contato' },
    ],
  },
  {
    label: 'PRODUTO',
    links: [
      { name: 'Programas pré-estabelecidos', href: '/#programas' },
      { name: 'Como funciona', href: '/#como-funciona' },
      { name: 'Simulador de proposta', href: '/proposta/clinicas' },
      { name: 'Conteúdo', href: '/blog' },
    ],
  },
  {
    label: 'CONFIANÇA',
    links: [
      { name: 'Conformidade e limites', href: '/#conformidade' },
      { name: 'Política de privacidade', href: '/#conformidade' },
      { name: 'Encarregado de dados (LGPD)', href: `mailto:${siteConfig.legal.dpoEmail}` },
      { name: 'Quem somos', href: '/#contato' },
    ],
  },
]

export function Footer() {
  const { legal, contact, address } = siteConfig
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-foot pb-10 pt-[60px] text-foot-ink-2">
      <div className="container-custom">
        <div className="grid grid-cols-1 gap-8 pb-9 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:gap-12">
          <div className="flex flex-col gap-[11px]">
            {/* O Link (self-start) impede o flex-col de esticar a logo à largura da coluna. */}
            <Link href="/" aria-label="Prontta Saúde" className="mb-1.5 self-start">
              <Logo size="lg" variant="white" />
            </Link>
            <p className="text-[14.5px] leading-[1.62] text-foot-ink-2">
              Infraestrutura B2B de telessaúde assistida. Transformamos parceiros físicos em pontos
              de cuidado especializado, com programas recorrentes e responsabilidades definidas em
              contrato.
            </p>
          </div>

          {columns.map((column) => (
            <div key={column.label} className="flex flex-col gap-[11px]">
              <span className="text-[12.5px] font-semibold tracking-[0.1em] text-foot-label">
                {column.label}
              </span>
              {column.links.map((link) =>
                link.href.startsWith('mailto:') ? (
                  <a key={link.name} href={link.href} className="text-[14.5px] text-foot-ink">
                    {link.name}
                  </a>
                ) : (
                  <Link key={link.name} href={link.href} className="text-[14.5px] text-foot-ink">
                    {link.name}
                  </Link>
                ),
              )}
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-[11px] border-t border-foot-line pt-[26px] text-[13px] leading-[1.65] text-foot-ink-2 [&_strong]:font-semibold [&_strong]:text-foot-ink">
          <p>
            <strong>{legal.legalName}</strong> · CNPJ {legal.cnpj} · {address.full} ·{' '}
            {contact.email} · {contact.phoneDisplay} · {contact.hours}.
          </p>
          <p>
            Diretor Técnico Médico: <strong>{legal.technicalDirector}</strong>. Inscrição da pessoa
            jurídica no Conselho Regional de Medicina de Minas Gerais em processamento sob o
            protocolo <strong>{legal.crmProtocol}</strong>. Publicidade em conformidade com a
            Resolução CFM nº 2.336/2023.
          </p>
          <p>
            A Prontta é infraestrutura de telessaúde assistida.{' '}
            <strong>
              Não é operadora de plano de saúde, seguro saúde nem administradora de benefícios.
            </strong>{' '}
            O ato médico é de responsabilidade exclusiva do profissional que o pratica.
          </p>
          <p>
            A inteligência artificial da Prontta realiza pré-triagem e organização de jornada.{' '}
            <strong>Ela não emite diagnóstico.</strong>
          </p>
          <p>
            Encarregado de Dados (LGPD): <strong>{legal.dpoEmail}</strong> · © {currentYear}{' '}
            {legal.legalName}
          </p>
        </div>
      </div>
    </footer>
  )
}
