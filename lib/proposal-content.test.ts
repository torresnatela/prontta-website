import { describe, expect, it } from 'vitest';
import { CLIENT_TYPE_IDS } from './pricing';
import { PROPOSAL_CONTENT } from './proposal-content';

describe('estrutura do conteúdo narrativo', () => {
  it('cobre os 5 tipos de cliente com headline personalizada', () => {
    expect(Object.keys(PROPOSAL_CONTENT.clientTypes).sort()).toEqual([...CLIENT_TYPE_IDS].sort());
    for (const clientType of CLIENT_TYPE_IDS) {
      const entry = PROPOSAL_CONTENT.clientTypes[clientType];
      expect(entry.label.length).toBeGreaterThan(2);
      expect(entry.headline).toContain(entry.headlineTarget);
    }
  });

  it('tem escopo, responsabilidades, compliance e implantação preenchidos', () => {
    expect(PROPOSAL_CONTENT.scope.included.length).toBeGreaterThanOrEqual(3);
    expect(PROPOSAL_CONTENT.scope.notIncluded.length).toBeGreaterThanOrEqual(3);
    expect(PROPOSAL_CONTENT.responsibilities.length).toBeGreaterThanOrEqual(5);
    expect(PROPOSAL_CONTENT.compliance.length).toBeGreaterThanOrEqual(6);
    expect(PROPOSAL_CONTENT.implantationSteps.length).toBe(5);
    expect(PROPOSAL_CONTENT.legalFramework).toContain('14.510/2022');
    expect(PROPOSAL_CONTENT.proposalValidity).toContain('30 dias');
  });

  it('mantém os avisos legais da simulação', () => {
    expect(PROPOSAL_CONTENT.legalNotes.totalSimulado).toMatch(/simulad/i);
    expect(PROPOSAL_CONTENT.legalNotes.resultadoParceiro).toMatch(/simula/i);
  });
});
