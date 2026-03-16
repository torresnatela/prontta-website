import { Document } from '@react-pdf/renderer'
import type { ProposalState } from '@/lib/calculator-types'
import { calculateTotalMonthlyConsultations } from '@/lib/pricing-engine'
import { CoverPage } from './sections/CoverPage'
import { SobreProntta } from './sections/SobreProntta'
import { DesafioAcesso } from './sections/DesafioAcesso'
import { ModeloPronttaCare } from './sections/ModeloPronttaCare'
import { FluxoAtendimento } from './sections/FluxoAtendimento'
import { InfraestruturaAdaptavel } from './sections/InfraestruturaAdaptavel'
import { Conectividade } from './sections/Conectividade'
import { MetodologiaImplementacao } from './sections/MetodologiaImplementacao'
import { ResumoResponsabilidades } from './sections/ResumoResponsabilidades'
import { EspecialidadesInvestimento } from './sections/EspecialidadesInvestimento'
import { ImpactosEstrategicos } from './sections/ImpactosEstrategicos'
import { Conclusao } from './sections/Conclusao'

interface MunicipioPDFProps {
  state: ProposalState
}

export function MunicipioPDF({ state }: MunicipioPDFProps) {
  const uniqueSpecialties = new Set(state.dedicatedPackages.map((p) => p.specialty))
  const totalSpecialties = uniqueSpecialties.size
  const totalConsultations = calculateTotalMonthlyConsultations(state)

  return (
    <Document>
      {/* Capa */}
      <CoverPage totalSpecialties={totalSpecialties} totalConsultations={totalConsultations} />
      {/* Seção 1 */}
      <SobreProntta />
      {/* Seção 2 */}
      <DesafioAcesso />
      {/* Seção 3 */}
      <ModeloPronttaCare />
      {/* Seção 4 */}
      <FluxoAtendimento />
      {/* Seção 5 */}
      <InfraestruturaAdaptavel selectedOption={state.infrastructure.option} />
      {/* Seção 6 */}
      <Conectividade />
      {/* Seção 7 */}
      <MetodologiaImplementacao />
      {/* Seção 8 */}
      <ResumoResponsabilidades />
      {/* Seção 9 */}
      <EspecialidadesInvestimento state={state} />
      {/* Seção 10 */}
      <ImpactosEstrategicos />
      {/* Seção 11 */}
      <Conclusao />
    </Document>
  )
}
