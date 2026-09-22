import { ButtonLink } from '@/components/ui'
import { OpenSimulatorButton } from '@/components/simulator-gate'
import { siteConfig, whatsappHref } from '@/lib/site-config'

/** O fechamento de todas as páginas públicas: simular ou chamar no WhatsApp. */
export function FinalCTA() {
  return (
    <section id="contato" className="py-[60px] text-center sm:py-[88px]">
      <div className="container-custom">
        <h2 className="heading mx-auto max-w-[760px] text-[clamp(28px,3.4vw,42px)] font-extrabold">
          Vinte minutos bastam para saber se faz sentido
        </h2>
        <p className="mx-auto mt-4 max-w-[600px] text-[17px] text-ink-2">
          Uma conversa curta, com o número do seu negócio na mesa. Se não fizer sentido, a gente diz
          na hora.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3.5">
          <OpenSimulatorButton className="w-full sm:w-auto">
            Simular e agendar conversa
          </OpenSimulatorButton>
          <ButtonLink href={whatsappHref()} variant="ghost" external className="w-full sm:w-auto">
            WhatsApp {siteConfig.contact.phoneDisplay}
          </ButtonLink>
        </div>
      </div>
    </section>
  )
}
