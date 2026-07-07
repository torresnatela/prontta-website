import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { CLIENT_TYPE_IDS } from './pricing';
import { PROPOSAL_CONTENT } from './proposal-content';

/**
 * Decisão de produto: a proposta 2.0 não menciona remuneração do parceiro
 * em NENHUM texto voltado ao visitante (nem comissionamento de canal).
 * A linha de repasse da DRE usa o rótulo neutro "Custo Prontta".
 */
const FORBIDDEN_TERMS =
  /comiss[ãa]o|ganho do parceiro|margem do parceiro|remunerad|repasse|gestor de conta|master parceiro|\bN1\b|\bN2\b|\bN3\b/i;

function collectSourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) return collectSourceFiles(full);
    if (!/\.(ts|tsx)$/.test(entry) || /\.test\./.test(entry)) return [];
    return [full];
  });
}

describe('guard de termos proibidos (remuneração do parceiro)', () => {
  it('conteúdo narrativo não contém termos de remuneração', () => {
    expect(JSON.stringify(PROPOSAL_CONTENT)).not.toMatch(FORBIDDEN_TERMS);
  });

  it('nenhum código de UI da proposta contém termos de remuneração', () => {
    const files = [
      ...collectSourceFiles(join(process.cwd(), 'components/proposta')),
      join(process.cwd(), 'lib/proposal-content.ts'),
    ];
    for (const file of files) {
      const source = readFileSync(file, 'utf-8');
      expect(source, `termo proibido em ${file}`).not.toMatch(FORBIDDEN_TERMS);
    }
  });
});

describe('estrutura do conteúdo narrativo', () => {
  it('cobre os 5 tipos de cliente com headline personalizada', () => {
    expect(Object.keys(PROPOSAL_CONTENT.clientTypes).sort()).toEqual([...CLIENT_TYPE_IDS].sort());
    for (const clientType of CLIENT_TYPE_IDS) {
      const entry = PROPOSAL_CONTENT.clientTypes[clientType];
      expect(entry.label.length).toBeGreaterThan(2);
      expect(entry.headline).toContain(entry.headlineTarget);
    }
  });

  it('tem escopo, responsabilidades, compliance e contato preenchidos', () => {
    expect(PROPOSAL_CONTENT.scope.included.length).toBeGreaterThanOrEqual(3);
    expect(PROPOSAL_CONTENT.scope.notIncluded.length).toBeGreaterThanOrEqual(3);
    expect(PROPOSAL_CONTENT.responsibilities.length).toBeGreaterThanOrEqual(4);
    expect(PROPOSAL_CONTENT.compliance.length).toBeGreaterThanOrEqual(4);
    expect(PROPOSAL_CONTENT.legalFramework).toContain('14.510/2022');
    expect(PROPOSAL_CONTENT.proposalValidity).toContain('30 dias');
  });
});
