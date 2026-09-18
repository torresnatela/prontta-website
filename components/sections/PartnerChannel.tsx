import { OpenSimulatorButton } from '@/components/simulator-gate'

/** Faixa do programa de parceiros comerciais (indicadores, gestores de conta). */
export function PartnerChannel() {
  return (
    <section className="bg-surface py-14">
      <div className="container-custom flex flex-col items-start gap-6 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-12">
        <div className="flex max-w-[740px] flex-col gap-2.5">
          <h2 className="heading text-[28px] font-bold">
            Você já vende para clínicas, academias ou empresas?
          </h2>
          <p className="text-[16px] text-ink-2">
            A Prontta remunera indicadores, gestores de conta e parceiros master sobre o resultado
            líquido recorrente dos contratos que eles trazem, sempre contra nota fiscal, sem
            informalidade. Sem exclusividade automática e sem garantia de volume.
          </p>
        </div>
        <OpenSimulatorButton segment="parceiro" className="w-full sm:w-auto">
          Ver o programa de parceiros
        </OpenSimulatorButton>
      </div>
    </section>
  )
}
