'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Instagram, Linkedin, Clock } from 'lucide-react'
import { Logo } from './Logo'
import { siteConfig } from '@/lib/site-config'

const footerLinks = {
  empresa: [
    { name: 'Sobre Nós', href: '/#contato' },
    { name: 'Nossa Equipe', href: '/#contato' },
    { name: 'Carreiras', href: '/#contato' },
  ],
  servicos: [
    { name: 'Agenda On Demand', href: '/#servicos' },
    { name: 'Agenda Dedicada', href: '/#servicos' },
    { name: 'Pacotes de Atendimento', href: '/#servicos' },
    { name: 'Telesaúde Híbrida', href: '/#telesaude' },
  ],
  recursos: [
    { name: 'Simulador de Proposta', href: '/proposta' },
    { name: 'Blog', href: '/blog' },
    { name: 'FAQ', href: '/faq' },
  ],
}

const socialLinks = [
  { name: 'Instagram', icon: Instagram, href: siteConfig.social.instagram },
  { name: 'LinkedIn', icon: Linkedin, href: siteConfig.social.linkedin },
]

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer id="contato" className="bg-primary-navy text-white">
      {/* Main Footer */}
      <div className="container-custom mx-auto section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Logo size="lg" variant="white" />
            <p className="mt-6 text-white/70 max-w-md leading-relaxed text-lg">
              Soluções inovadoras em terceirização de serviços médicos. 
              Conectamos clínicas e hospitais aos melhores profissionais de saúde.
            </p>
            
            {/* Contact Info */}
            <div className="mt-8 space-y-5">
              <a
                href={siteConfig.contact.phoneHref}
                className="flex items-center gap-3 text-white/70 hover:text-primary-cyan transition-colors text-lg"
              >
                <Phone className="w-6 h-6" />
                <span>{siteConfig.contact.phoneDisplay}</span>
              </a>
              <a
                href={`mailto:${siteConfig.contact.email}`}
                className="flex items-center gap-3 text-white/70 hover:text-primary-cyan transition-colors text-lg"
              >
                <Mail className="w-6 h-6" />
                <span>{siteConfig.contact.email}</span>
              </a>
              <div className="flex items-start gap-3 text-white/70 text-lg">
                <MapPin className="w-6 h-6 shrink-0 mt-1" />
                <span>{siteConfig.address.full}</span>
              </div>
              <div className="flex items-center gap-3 text-white/70 text-lg">
                <Clock className="w-6 h-6" />
                <span>{siteConfig.contact.hours}</span>
              </div>
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h4 className="font-display font-bold text-xl mb-6">Empresa</h4>
            <ul className="space-y-4">
              {footerLinks.empresa.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-white/70 hover:text-primary-cyan transition-colors text-lg"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold text-xl mb-6">Serviços</h4>
            <ul className="space-y-4">
              {footerLinks.servicos.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-white/70 hover:text-primary-cyan transition-colors text-lg"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold text-xl mb-6">Recursos</h4>
            <ul className="space-y-4">
              {footerLinks.recursos.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-white/70 hover:text-primary-cyan transition-colors text-lg"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Social Links */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 rounded-full bg-white/10 hover:bg-primary-cyan transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={social.name}
                >
                  <social.icon className="w-6 h-6" />
                </motion.a>
              ))}
            </div>

            <p className="text-white/50 text-base">
              © {currentYear} Prontta Saúde. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

