'use client'

import { useEffect, useState } from 'react'
import { GoogleAnalytics } from '@next/third-parties/google'
import { motion, AnimatePresence } from 'framer-motion'
import { Cookie } from 'lucide-react'
import { Button } from './ui/Button'

const STORAGE_KEY = 'prontta-cookie-consent'
type Consent = 'accepted' | 'rejected'

/**
 * Banner de consentimento de cookies (LGPD) que controla o carregamento do
 * Google Analytics. O GA só é injetado depois do usuário aceitar; a decisão
 * fica salva em localStorage. Se NEXT_PUBLIC_GA_ID não estiver configurado,
 * nada é renderizado.
 */
export function CookieConsent({ gaId }: { gaId?: string }) {
  const [consent, setConsent] = useState<Consent | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const stored = window.localStorage.getItem(STORAGE_KEY) as Consent | null
    if (stored === 'accepted' || stored === 'rejected') setConsent(stored)
  }, [])

  const decide = (value: Consent) => {
    window.localStorage.setItem(STORAGE_KEY, value)
    setConsent(value)
  }

  // Sem GA configurado: não há o que consentir.
  if (!gaId) return null

  const showBanner = mounted && consent === null

  return (
    <>
      {consent === 'accepted' && <GoogleAnalytics gaId={gaId} />}

      <AnimatePresence>
        {showBanner && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.3 }}
            role="dialog"
            aria-label="Aviso de cookies"
            className="fixed bottom-4 inset-x-4 z-[60] mx-auto max-w-3xl"
          >
            <div className="glass-card rounded-2xl p-5 md:p-6 shadow-2xl">
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex items-start gap-3 flex-1">
                  <Cookie className="w-6 h-6 text-primary-cyan shrink-0 mt-0.5" />
                  <p className="text-sm md:text-base text-primary-navy/80 leading-relaxed">
                    Usamos cookies para analisar o tráfego e melhorar sua
                    experiência. Você pode aceitar ou recusar a coleta de dados
                    de análise.
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => decide('rejected')}
                  >
                    Recusar
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => decide('accepted')}
                  >
                    Aceitar
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
