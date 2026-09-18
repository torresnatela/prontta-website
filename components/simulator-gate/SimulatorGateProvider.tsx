'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { useRouter } from 'next/navigation'
import { Button, ButtonLink } from '@/components/ui/Button'
import { whatsappHref } from '@/lib/site-config'
import { cn } from '@/lib/utils'

/**
 * O gate que antecede os simuladores.
 *
 * Todo botão "Simular" do site abre este modal: primeiro o visitante escolhe o
 * segmento (ou já chega com ele escolhido), depois deixa nome, WhatsApp e CNPJ
 * e só então é levado ao simulador do canal — /proposta/clinicas,
 * /proposta/academias ou /proposta/empresa. Segmentos sem simulador
 * automático ("outro formato", "programa de parceiros") terminam no passo 3,
 * que encaminha para o WhatsApp.
 */

export type GateSegment = 'clinicas' | 'academias' | 'empresas' | 'outros' | 'parceiro'

const ROUTES: Partial<Record<GateSegment, string>> = {
  clinicas: '/proposta/clinicas',
  academias: '/proposta/academias',
  empresas: '/proposta/empresa',
}

const LABELS: Record<GateSegment, string> = {
  clinicas: 'Simulador de clínicas e laboratórios',
  academias: 'Simulador de academias',
  empresas: 'Simulador de empresas',
  outros: 'Outro formato',
  parceiro: 'Programa de parceiros',
}

const OPTIONS: { seg: GateSegment; title: string; sub: string }[] = [
  {
    seg: 'clinicas',
    title: 'Clínica ou laboratório',
    sub: 'Simula a margem de revenda dos pacotes',
  },
  { seg: 'academias', title: 'Academia ou studio', sub: 'Simula a receita de cessão de espaço' },
  { seg: 'empresas', title: 'Empresa', sub: 'Calcula o custo por consulta' },
  {
    seg: 'outros',
    title: 'Outro formato',
    sub: 'Hospital, associação, pré e pós-cirúrgico, e demais casos',
  },
]

interface GateContextValue {
  /** Abre o modal; com `segment`, pula direto para o passo dos dados. */
  open: (segment?: GateSegment) => void
}

const GateContext = createContext<GateContextValue | null>(null)

export function useSimulatorGate(): GateContextValue {
  const context = useContext(GateContext)
  if (!context) {
    throw new Error('useSimulatorGate deve ser usado dentro de <SimulatorGateProvider>')
  }
  return context
}

type Step = 1 | 2 | 3

export function SimulatorGateProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [step, setStep] = useState<Step>(1)
  const [segment, setSegment] = useState<GateSegment | null>(null)

  const open = useCallback((seg?: GateSegment) => {
    setSegment(seg ?? null)
    setStep(seg ? 2 : 1)
    setIsOpen(true)
  }, [])

  const close = useCallback(() => setIsOpen(false), [])

  const value = useMemo(() => ({ open }), [open])

  return (
    <GateContext.Provider value={value}>
      {children}
      {isOpen ? (
        <GateModal
          step={step}
          segment={segment}
          onPick={(seg) => {
            setSegment(seg)
            setStep(2)
          }}
          onBack={() => setStep(1)}
          onDone={() => setStep(3)}
          onClose={close}
        />
      ) : null}
    </GateContext.Provider>
  )
}

interface GateModalProps {
  step: Step
  segment: GateSegment | null
  onPick: (seg: GateSegment) => void
  onBack: () => void
  onDone: () => void
  onClose: () => void
}

function GateModal({ step, segment, onPick, onBack, onDone, onClose }: GateModalProps) {
  const router = useRouter()
  const sheetRef = useRef<HTMLDivElement>(null)
  const [nome, setNome] = useState('')
  const [telefone, setTelefone] = useState('')
  const [documento, setDocumento] = useState('')
  const [consent, setConsent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Trava a rolagem da página e fecha com Esc enquanto o modal está aberto.
  useEffect(() => {
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    sheetRef.current?.focus()
    return () => {
      document.body.style.overflow = previous
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  const submit = () => {
    if (!nome.trim() || !telefone.trim() || !consent) {
      setError('Preencha nome, WhatsApp e marque a autorização para continuar.')
      return
    }
    setError(null)
    const route = segment ? ROUTES[segment] : undefined
    if (route) {
      router.push(route)
      onClose()
      return
    }
    onDone()
  }

  return (
    <div
      className="fixed inset-0 z-[90] flex items-start justify-center overflow-y-auto bg-[rgba(0,8,20,0.8)] p-6"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div
        ref={sheetRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="sim-gate-title"
        className="m-auto flex w-full max-w-[640px] flex-col gap-5 rounded-[18px] border border-line bg-bg p-6 outline-none sm:p-8"
      >
        <div className="flex items-center justify-between">
          <div className="flex gap-1.5" aria-hidden="true">
            {[1, 2, 3].map((n) => (
              <i
                key={n}
                className={cn(
                  'h-1 w-[22px] rounded-sm not-italic',
                  step >= n ? 'bg-cyan' : 'bg-line',
                )}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer border-0 bg-transparent p-2 font-sans text-sm text-ink-3"
          >
            Fechar
          </button>
        </div>

        {step === 1 ? (
          <div>
            <h2 id="sim-gate-title" className="heading text-[26px] font-extrabold">
              Qual é o seu negócio?
            </h2>
            <p className="mb-5 mt-2.5 text-[15.5px] text-ink-2">
              Cada segmento tem um simulador próprio, com as variáveis que fazem sentido para ele.
            </p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {OPTIONS.map((option) => (
                <button
                  key={option.seg}
                  type="button"
                  onClick={() => onPick(option.seg)}
                  className="flex min-h-[88px] cursor-pointer flex-col items-start gap-1 rounded-xl border-[1.5px] border-line bg-card p-[18px] text-left font-sans hover:border-cyan"
                >
                  <b className="font-display text-[17px] font-bold text-ink">{option.title}</b>
                  <span className="text-[13.5px] leading-[1.45] text-ink-3">{option.sub}</span>
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {step === 2 ? (
          <div>
            <h2 id="sim-gate-title" className="heading text-[26px] font-extrabold">
              {segment ? LABELS[segment] : 'Antes de simular'}
            </h2>
            <p className="mb-5 mt-2.5 text-[15.5px] text-ink-2">
              Precisamos de três dados para gerar a proposta com o seu nome e enviá-la em PDF.
            </p>
            <form
              className="flex flex-col gap-4"
              onSubmit={(event) => {
                event.preventDefault()
                submit()
              }}
              noValidate
            >
              <Field
                id="gate-nome"
                label="Nome completo"
                type="text"
                autoComplete="name"
                placeholder="Como devemos te chamar"
                value={nome}
                onChange={setNome}
              />
              <Field
                id="gate-tel"
                label="WhatsApp"
                type="tel"
                autoComplete="tel"
                placeholder="(31) 90000-0000"
                value={telefone}
                onChange={setTelefone}
              />
              <Field
                id="gate-doc"
                label="CNPJ da empresa"
                type="text"
                inputMode="numeric"
                placeholder="00.000.000/0000-00"
                value={documento}
                onChange={setDocumento}
                hint="Se você ainda não tem CNPJ, deixe em branco e seguimos pelo WhatsApp."
              />
              <label
                htmlFor="gate-ok"
                className="flex items-start gap-2.5 text-[13px] leading-[1.5] text-ink-2"
              >
                <input
                  id="gate-ok"
                  type="checkbox"
                  checked={consent}
                  onChange={(event) => setConsent(event.currentTarget.checked)}
                  className="mt-[3px] h-[18px] w-[18px] shrink-0 accent-cyan"
                />
                <span>
                  Autorizo a Prontta Saúde a usar estes dados para entrar em contato comercial e
                  enviar a proposta. Nenhuma informação de saúde é coletada aqui. Posso pedir a
                  exclusão a qualquer momento pelo canal do encarregado de dados.
                </span>
              </label>
              {error ? (
                <p role="alert" className="text-[13.5px] font-medium text-amber">
                  {error}
                </p>
              ) : null}
              <div className="flex flex-wrap gap-3">
                <Button type="submit" className="w-full sm:w-auto">
                  Ver a minha simulação
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={onBack}
                  className="w-full sm:w-auto"
                >
                  Voltar
                </Button>
              </div>
            </form>
          </div>
        ) : null}

        {step === 3 ? (
          <div>
            <h2 id="sim-gate-title" className="heading text-[26px] font-extrabold">
              Recebemos os seus dados
            </h2>
            <p className="mb-5 mt-2.5 text-[15.5px] text-ink-2">
              Este formato não tem simulador automático porque a conta muda caso a caso. Um de nós
              entra em contato em até um dia útil para entender o seu cenário e montar a proposta.
            </p>
            <div className="flex flex-wrap gap-3">
              <ButtonLink href={whatsappHref()} external className="w-full sm:w-auto">
                Adiantar pelo WhatsApp
              </ButtonLink>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="w-full sm:w-auto"
              >
                Fechar
              </Button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}

interface FieldProps {
  id: string
  label: string
  type: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  autoComplete?: string
  inputMode?: 'numeric' | 'text' | 'tel'
  hint?: string
}

function Field({ id, label, hint, value, onChange, ...input }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-[13.5px] font-semibold text-ink">
        {label}
      </label>
      <input
        id={id}
        value={value}
        onChange={(event) => onChange(event.currentTarget.value)}
        className="h-[50px] rounded-[9px] border-[1.5px] border-line bg-card px-[14px] font-sans text-[15px] text-ink placeholder:text-ink-3/70 focus:outline focus:outline-2 focus:outline-offset-1 focus:outline-cyan"
        {...input}
      />
      {hint ? <small className="text-[12.5px] text-ink-3">{hint}</small> : null}
    </div>
  )
}
