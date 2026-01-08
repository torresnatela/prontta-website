'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Instagram, Linkedin, Clock } from 'lucide-react'
import { Logo } from './Logo'

const footerLinks = {
  empresa: [
    { name: 'Sobre Nós', href: '#' },
    { name: 'Nossa Equipe', href: '#' },
    { name: 'Carreiras', href: '#' },
  ],
  servicos: [
    { name: 'Retorno Implante Capilar', href: '#servicos' },
    { name: 'Acompanhamento Pós-Op', href: '#servicos' },
    { name: 'Pré-Operatório', href: '#servicos' },
  ],
  recursos: [
    { name: 'Calculadora de Propostas', href: '/proposta' },
    { name: 'Blog', href: '#' },
    { name: 'FAQ', href: '#' },
  ],
}

const socialLinks = [
  { name: 'Instagram', icon: Instagram, href: 'https://instagram.com/pronttasaude' },
  { name: 'LinkedIn', icon: Linkedin, href: 'https://linkedin.com/company/pronttasaude' },
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
            <Logo size="lg" className="[&_span]:text-white [&_.text-primary-cyan]:text-primary-cyan" />
            <p className="mt-6 text-white/70 max-w-md leading-relaxed">
              Soluções inovadoras em terceirização de serviços médicos. 
              Conectamos clínicas e hospitais aos melhores profissionais de saúde.
            </p>
            
            {/* Contact Info */}
            <div className="mt-8 space-y-4">
              <a 
                href="tel:+5511999999999" 
                className="flex items-center gap-3 text-white/70 hover:text-primary-cyan transition-colors"
              >
                <Phone className="w-5 h-5" />
                <span>(11) 99999-9999</span>
              </a>
              <a 
                href="mailto:contato@pronttasaude.com.br" 
                className="flex items-center gap-3 text-white/70 hover:text-primary-cyan transition-colors"
              >
                <Mail className="w-5 h-5" />
                <span>contato@pronttasaude.com.br</span>
              </a>
              <div className="flex items-center gap-3 text-white/70">
                <MapPin className="w-5 h-5" />
                <span>São Paulo, SP - Brasil</span>
              </div>
              <div className="flex items-center gap-3 text-white/70">
                <Clock className="w-5 h-5" />
                <span>Seg - Sex: 8h às 18h</span>
              </div>
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h4 className="font-display font-bold text-lg mb-6">Empresa</h4>
            <ul className="space-y-3">
              {footerLinks.empresa.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-white/70 hover:text-primary-cyan transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold text-lg mb-6">Serviços</h4>
            <ul className="space-y-3">
              {footerLinks.servicos.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-white/70 hover:text-primary-cyan transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold text-lg mb-6">Recursos</h4>
            <ul className="space-y-3">
              {footerLinks.recursos.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-white/70 hover:text-primary-cyan transition-colors"
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
                  className="p-3 rounded-full bg-white/10 hover:bg-primary-cyan transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={social.name}
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>

            <p className="text-white/50 text-sm">
              © {currentYear} Prontta Saúde. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

