'use client';

import { useMemo, useState } from 'react';
import { ACADEMIA_CYCLES, CYCLE_LABELS, getAcademiaProgram } from '@/lib/academias/catalog';
import {
  buildAssociadoWhatsAppMessage,
  type AcademiaOfferParams,
} from '@/lib/academias/params';
import {
  compareBundleVsCustom,
  EXTRA_SPECIALTY_IDS,
  getAssociadoBundle,
  getBuilderModules,
  priceCustomPackage,
  priceExtras,
} from '@/lib/academias/pricing';
import { getSpecialty, type Cycle } from '@/lib/pricing';
import { whatsappHref } from '@/lib/site-config';
import { AcademiaFooter, AcademiaTopBar } from '../shared/AcademiaChrome';
import { brlAuto, plural } from '../shared/format';
import { specialtyIcon } from '../shared/icons';
import { ProgramPicker } from '../shared/ProgramPicker';
import { RollingCurrency } from '../shared/RollingCurrency';
import { IncludedChips, SpecialistGrid } from '../shared/SpecialistGrid';

type OfferMode = 'bundle' | 'custom';

interface ProgramasAppProps {
  /** Resolvido no SERVIDOR a partir da query string — nunca via useSearchParams. */
  offer: AcademiaOfferParams;
}

export function ProgramasApp({ offer }: ProgramasAppProps) {
  // Estado raso e independente: a oferta é prop do servidor, não há fonte
  // mutável compartilhada que justifique reducer ou context.
  const [programa, setPrograma] = useState(offer.programa);
  const [viewCycle, setViewCycle] = useState<Cycle>(offer.ciclo);
  const [mode, setMode] = useState<OfferMode>('bundle');
  const [selectedModules, setSelectedModules] = useState<string[]>([]);
  const [extras, setExtras] = useState<Record<string, number>>({});

  const program = getAcademiaProgram(programa);

  // O ?preco= da academia só vale para o programa que ela configurou.
  const effectiveOffer = useMemo(
    () => ({ ...offer, programa, preco: programa === offer.programa ? offer.preco : null }),
    [offer, programa],
  );

  const bundle = useMemo(
    () => getAssociadoBundle(effectiveOffer, viewCycle),
    [effectiveOffer, viewCycle],
  );
  const modules = useMemo(() => getBuilderModules(programa, viewCycle), [programa, viewCycle]);
  const custom = useMemo(
    () => priceCustomPackage(programa, viewCycle, selectedModules),
    [programa, viewCycle, selectedModules],
  );
  const extrasResult = useMemo(
    () => priceExtras(Object.entries(extras).map(([specialtyId, quantity]) => ({ specialtyId, quantity }))),
    [extras],
  );
  // A economia é medida contra o pacote COMPLETO montado avulso — é a comparação
  // maçã-com-maçã. Usar o `custom` parcial faria a mensagem sumir enquanto o
  // visitante ainda não tivesse marcado tudo.
  const fullCustom = useMemo(
    () => priceCustomPackage(programa, viewCycle, modules.map((m) => m.moduleId)),
    [programa, viewCycle, modules],
  );
  const comparison = useMemo(() => compareBundleVsCustom(bundle, fullCustom), [bundle, fullCustom]);

  const bundleTotal = bundle.cycleTotal + extrasResult.total;
  const activeTotal = mode === 'bundle' ? bundleTotal : custom.cycleTotal;
  const activeMonthly = activeTotal / viewCycle;

  const switchProgram = (id: typeof programa) => {
    setPrograma(id);
    setSelectedModules([]);
    setExtras({});
  };

  const switchCycle = (cycle: Cycle) => {
    setViewCycle(cycle);
    setSelectedModules([]);
    setExtras({});
  };

  const toggleModule = (moduleId: string) => {
    setMode('custom');
    setSelectedModules((current) =>
      current.includes(moduleId)
        ? current.filter((id) => id !== moduleId)
        : [...current, moduleId],
    );
  };

  const setExtra = (specialtyId: string, quantity: number) => {
    setMode('bundle');
    setExtras((current) => ({ ...current, [specialtyId]: Math.max(0, quantity) }));
  };

  const extrasCount = Object.values(extras).reduce((sum, qty) => sum + qty, 0);
  const whatsapp = whatsappHref(
    buildAssociadoWhatsAppMessage({ ...effectiveOffer, ciclo: viewCycle }, activeMonthly),
  );

  return (
    <div className="academias-root programas" data-theme={program.theme}>
      <div className="shell">
        <AcademiaTopBar subtitle="Programas para seus associados" pill="Escolha seu programa" />

        <section className="hero">
          <div className="hero-content">
            <div className="eyebrow">Jornadas de saúde assistida</div>
            <h1>{program.program.name}</h1>
            <p>{program.publicDescription}</p>
            <div className="hero-price">
              <strong>
                <RollingCurrency value={activeTotal} />
              </strong>
              <span>
                equivalente a {brlAuto(activeMonthly)}/mês por {viewCycle} meses
              </span>
            </div>
            <div className="hero-stats">
              <div className="hero-stat">
                <b aria-hidden="true">✓</b> Ciclos de 3, 6 ou 12 meses
              </div>
              <div className="hero-stat">
                <b aria-hidden="true">+</b> Especialistas integrados
              </div>
              <div className="hero-stat">
                <b aria-hidden="true">↗</b> Acompanhamento contínuo
              </div>
            </div>
          </div>
        </section>

        <section className="catalog-section">
          <div className="section-title">
            <div>
              <h2>Escolha o programa ideal para seu objetivo</h2>
              <p>
                Você pode montar sua própria combinação de especialistas ou escolher o pacote fechado
                recomendado para este programa.
              </p>
            </div>
          </div>
          <ProgramPicker selectedId={programa} onSelect={switchProgram} withPopover />
        </section>

        <section className="main-card">
          <div className="main-head">
            <div className="main-head-top">
              <div>
                <h2>{program.program.name}</h2>
                <p>{program.program.description}</p>
              </div>
              <div className="live-box">
                <small>Seu investimento no ciclo</small>
                <strong>
                  <RollingCurrency value={activeTotal} />
                </strong>
                <span>
                  equivalente a {brlAuto(activeMonthly)}/mês por {viewCycle} meses
                </span>
                <div className="compare-note">
                  {mode === 'bundle' ? (
                    <>
                      <span>Pacote personalizado: </span>
                      <b>a partir de {brlAuto(custom.baseModulePrice)} no ciclo</b>
                    </>
                  ) : (
                    <>
                      <span>Pacote fechado recomendado: </span>
                      <b>{brlAuto(bundle.cycleTotal)} no ciclo</b>
                    </>
                  )}
                </div>
                {bundle.fromOwnerPrice ? (
                  <div className="owner-flag">
                    <span aria-hidden="true">★</span> Preço definido pela sua academia
                  </div>
                ) : null}
              </div>
            </div>

            <div className="cycle-tabs" role="group" aria-label="Duração do ciclo">
              {ACADEMIA_CYCLES.map((cycle) => {
                const active = cycle === viewCycle;
                const preview = getAssociadoBundle(effectiveOffer, cycle);
                return (
                  <button
                    key={cycle}
                    type="button"
                    className={`cycle-tab${active ? ' active' : ''}`}
                    aria-pressed={active}
                    onClick={() => switchCycle(cycle)}
                  >
                    <small>{cycle} meses</small>
                    <strong>Ciclo {CYCLE_LABELS[cycle]}</strong>
                    <span>{brlAuto(preview.monthlyPrice)}/mês</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="main-body">
            <div className="builder-grid">
              <div>
                <div className="body-title">
                  <h3>Monte seu pacote</h3>
                  <span>Ciclo {CYCLE_LABELS[viewCycle]}</span>
                </div>
                <p className="helper">
                  Clique nos especialistas que deseja incluir. Cada módulo é cobrado pelo valor
                  avulso da consulta — por isso o pacote fechado abaixo sai mais em conta.
                </p>
                <div className="options">
                  {modules.map((module) => {
                    const active = selectedModules.includes(module.moduleId);
                    return (
                      <button
                        key={module.moduleId}
                        type="button"
                        className={`option${active ? ' active' : ''}`}
                        aria-pressed={active}
                        onClick={() => toggleModule(module.moduleId)}
                      >
                        <span className="tick" aria-hidden="true">
                          ✓
                        </span>
                        <span className="spec-icon">{specialtyIcon(module.specialtyId)}</span>
                        <span>
                          <strong>{module.specialtyName}</strong>
                          <small>
                            {module.quantity}{' '}
                            {plural(module.quantity, 'atendimento', 'atendimentos')} ·{' '}
                            {brlAuto(module.unitSellPrice)} cada
                          </small>
                          <b>{brlAuto(module.lineTotal)}</b>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <aside className="builder-side">
                <div className="side-kicker">Pacote ao vivo</div>
                <div className="side-value">
                  <small>Total do pacote personalizado</small>
                  <strong>
                    <RollingCurrency value={custom.cycleTotal} />
                  </strong>
                  <div className="side-total">
                    equivalente a {brlAuto(custom.monthlyPrice)}/mês por {viewCycle} meses
                  </div>
                </div>
                <div className="mini-tag">
                  {custom.lines.length}{' '}
                  {plural(custom.lines.length, 'especialista adicionado', 'especialistas adicionados')}
                </div>
                <div className="selected-list">
                  <div>
                    <span>Base: jornada, IA de pré-triagem e plataforma</span>
                    <strong>{brlAuto(custom.baseModulePrice)}</strong>
                  </div>
                  {custom.lines.map((line) => (
                    <div key={line.specialtyId}>
                      <span>
                        {line.specialtyName} ({line.quantity}×)
                      </span>
                      <strong>{brlAuto(line.lineTotal)}</strong>
                    </div>
                  ))}
                </div>
                <div className="summary-note">
                  A base já inclui organização da jornada, acolhimento e acompanhamento. Você
                  adiciona os módulos médicos que quiser.
                </div>
                <button
                  type="button"
                  className={`select-offer${mode === 'custom' ? '' : ' ghost'}`}
                  onClick={() => setMode('custom')}
                >
                  {mode === 'custom' ? '✓ Pacote personalizado escolhido' : 'Quero este pacote personalizado'}
                </button>
              </aside>
            </div>

            <div className="bundle-card">
              <div className="bundle-top">
                <div>
                  <div className="bundle-kicker">Ou escolha o pacote fechado recomendado</div>
                  <h3 className="bundle-title">Pacote fechado • {CYCLE_LABELS[viewCycle]}</h3>
                  <p className="bundle-desc">
                    Tudo o que a academia selecionou para oferecer aos seus associados neste
                    programa, com o desconto de pacote.
                  </p>
                </div>
                <div className="bundle-price">
                  <small>Total do pacote fechado</small>
                  <strong>
                    <RollingCurrency value={bundleTotal} />
                  </strong>
                  <span>
                    equivalente a {brlAuto(bundleTotal / viewCycle)}/mês por {viewCycle} meses
                  </span>
                </div>
              </div>

              <SpecialistGrid lines={bundle.composition} />
              <IncludedChips
                items={[
                  'Avaliação inicial estruturada',
                  'Prontuário integrado',
                  'Prescrição digital',
                  'Acompanhamento contínuo',
                ]}
              />

              <div className="extras-card">
                <div className="extras-head">
                  <div>
                    <h4>Consultas adicionais fora do pacote</h4>
                    <p>
                      Se quiser, inclua atendimentos extras além do pacote fechado. Por serem
                      consultas avulsas, saem pelo valor cheio — dentro do pacote o mesmo
                      atendimento custa menos. O valor acima é atualizado automaticamente.
                    </p>
                  </div>
                  <div className="bundle-save">
                    {extrasCount === 0
                      ? 'Nenhuma consulta extra'
                      : `${extrasCount} ${plural(extrasCount, 'consulta extra', 'consultas extras')} · ${brlAuto(extrasResult.total)}`}
                  </div>
                </div>
                <div className="extras-grid">
                  {EXTRA_SPECIALTY_IDS.map((specialtyId) => {
                    const quantity = extras[specialtyId] ?? 0;
                    const specialty = getSpecialty(specialtyId);
                    const unit = priceExtras([{ specialtyId, quantity: 1 }]).total;
                    return (
                      <div className="extra" key={specialtyId}>
                        <span>
                          <strong>{specialty.name}</strong>
                          <small>{brlAuto(unit)} por consulta</small>
                        </span>
                        <span className="stepper">
                          <button
                            type="button"
                            onClick={() => setExtra(specialtyId, quantity - 1)}
                            disabled={quantity === 0}
                            aria-label={`Remover uma consulta de ${specialty.name}`}
                          >
                            −
                          </button>
                          <output aria-label={`${specialty.name}: ${quantity}`}>{quantity}</output>
                          <button
                            type="button"
                            onClick={() => setExtra(specialtyId, quantity + 1)}
                            aria-label={`Adicionar uma consulta de ${specialty.name}`}
                          >
                            +
                          </button>
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bundle-actions">
                <div className="bundle-save">
                  {comparison.savings > 0
                    ? `Economize ${brlAuto(comparison.savings)} (${comparison.bundleDiscountPercent.toFixed(0)}%) — montar estes mesmos atendimentos avulsos custaria ${brlAuto(fullCustom.cycleTotal)}`
                    : 'Opção sugerida pela academia'}
                </div>
                <button type="button" className="bundle-btn" onClick={() => setMode('bundle')}>
                  {mode === 'bundle' ? '✓ Pacote fechado escolhido' : 'Quero o pacote fechado'}
                </button>
              </div>
            </div>

            <div className="how">
              <div>
                <b aria-hidden="true">1</b>
                <strong>Escolha o programa</strong>
                <small>Selecione a jornada mais alinhada ao seu objetivo.</small>
              </div>
              <div>
                <b aria-hidden="true">2</b>
                <strong>Personalize ou aceite o recomendado</strong>
                <small>Monte seu pacote ou escolha a opção fechada da academia.</small>
              </div>
              <div>
                <b aria-hidden="true">3</b>
                <strong>Fale com a academia</strong>
                <small>Confirme as condições e conclua sua participação no programa.</small>
              </div>
            </div>

            <div className="notice">
              Este programa oferece acompanhamento em saúde e não substitui atendimento de urgência
              ou emergência. As condições finais de adesão devem ser confirmadas com a academia.
            </div>
          </div>
        </section>

        <AcademiaFooter>Prontta Saúde · Programas de saúde assistida para academias</AcademiaFooter>
      </div>

      <div className="sticky-cta">
        <div className="sticky-inner">
          <div className="sticky-price">
            <strong>
              <RollingCurrency value={activeTotal} />
            </strong>
            <small>
              {mode === 'bundle' ? 'Pacote fechado' : 'Pacote personalizado'} ·{' '}
              {brlAuto(activeMonthly)}/mês · {viewCycle} meses
            </small>
          </div>
          <a className="join" href={whatsapp} target="_blank" rel="noopener noreferrer">
            Quero participar
          </a>
        </div>
      </div>
    </div>
  );
}
