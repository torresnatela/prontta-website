'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Phone, Mail, Send } from 'lucide-react'
import { Button } from '../ui/Button'
import { Input, Textarea } from '../ui/Input'

export function CTA() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setIsSubmitting(false)
    setIsSubmitted(true)
    setFormData({ name: '', email: '', phone: '', message: '' })
    
    // Reset success message after 5 seconds
    setTimeout(() => setIsSubmitted(false), 5000)
  }

  return (
    <section className="relative section-padding overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-cyan/5 via-white to-accent-light" />
      
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary-cyan/10 to-transparent" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-cyan/10 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />

      <div className="container-custom mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-2 bg-primary-cyan/10 text-primary-cyan font-medium rounded-full text-sm mb-4">
              Vamos Conversar
            </span>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-primary-navy mb-6">
              Pronto para{' '}
              <span className="gradient-text">transformar</span>{' '}
              sua clínica?
            </h2>
            <p className="text-neutral-gray text-lg mb-8 max-w-lg">
              Entre em contato conosco ou solicite uma proposta personalizada. 
              Nossa equipe está pronta para entender suas necessidades.
            </p>

            {/* Contact Info */}
            <div className="space-y-4 mb-8">
              <a 
                href="tel:+5511999999999"
                className="flex items-center gap-4 text-primary-navy hover:text-primary-cyan transition-colors"
              >
                <div className="p-3 bg-accent-light rounded-xl">
                  <Phone className="w-5 h-5 text-primary-cyan" />
                </div>
                <div>
                  <div className="text-sm text-neutral-gray">Telefone</div>
                  <div className="font-semibold">(11) 99999-9999</div>
                </div>
              </a>
              <a 
                href="mailto:contato@pronttasaude.com.br"
                className="flex items-center gap-4 text-primary-navy hover:text-primary-cyan transition-colors"
              >
                <div className="p-3 bg-accent-light rounded-xl">
                  <Mail className="w-5 h-5 text-primary-cyan" />
                </div>
                <div>
                  <div className="text-sm text-neutral-gray">E-mail</div>
                  <div className="font-semibold">contato@pronttasaude.com.br</div>
                </div>
              </a>
            </div>

            {/* CTA Button */}
            <Link href="/proposta">
              <Button variant="primary" size="lg" className="group">
                Solicitar Proposta Detalhada
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-white rounded-3xl shadow-2xl shadow-primary-navy/10 p-8 md:p-10">
              <h3 className="font-display text-2xl font-bold text-primary-navy mb-6">
                Envie uma mensagem
              </h3>

              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Send className="w-8 h-8 text-green-600" />
                  </div>
                  <h4 className="text-xl font-bold text-primary-navy mb-2">
                    Mensagem enviada!
                  </h4>
                  <p className="text-neutral-gray">
                    Entraremos em contato em breve.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <Input
                    label="Nome completo"
                    placeholder="Seu nome"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                  
                  <div className="grid sm:grid-cols-2 gap-5">
                    <Input
                      label="E-mail"
                      type="email"
                      placeholder="seu@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                    <Input
                      label="Telefone"
                      type="tel"
                      placeholder="(11) 99999-9999"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                    />
                  </div>

                  <Textarea
                    label="Mensagem"
                    placeholder="Como podemos ajudar?"
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                  />

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="w-full"
                    isLoading={isSubmitting}
                  >
                    {isSubmitting ? 'Enviando...' : 'Enviar Mensagem'}
                  </Button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

