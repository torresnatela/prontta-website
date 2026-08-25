'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { X, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input, Textarea, Select } from '@/components/ui/Input';
import { STATUS_LABELS, PROPOSAL_STATUSES, type CompanyFormValues } from '@/lib/proposals/schemas';
import type { SaveProposalResult } from '@/app/proposta/actions';

interface SaveProposalModalProps {
  onClose: () => void;
  onSubmit: (company: CompanyFormValues) => Promise<SaveProposalResult>;
  saving: boolean;
}

const EMPTY: CompanyFormValues = {
  razaoSocial: '',
  cnpj: '',
  contatoNome: '',
  contatoEmail: '',
  contatoTelefone: '',
  observacoes: '',
  status: 'lead',
};

const statusOptions = PROPOSAL_STATUSES.map((value) => ({ value, label: STATUS_LABELS[value] }));

export function SaveProposalModal({ onClose, onSubmit, saving }: SaveProposalModalProps) {
  const [values, setValues] = useState<CompanyFormValues>(EMPTY);
  const [error, setError] = useState<string | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const set = <K extends keyof CompanyFormValues>(key: K, value: CompanyFormValues[K]) =>
    setValues((prev) => ({ ...prev, [key]: value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const result = await onSubmit(values);
    if (result.ok && result.id) {
      setSavedId(result.id);
    } else {
      setError(result.error ?? 'Não foi possível salvar.');
    }
  }

  if (!mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-primary-navy/50 p-4 backdrop-blur-sm md:items-center"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Salvar proposta"
    >
      <div
        className="my-8 w-full max-w-xl rounded-3xl bg-white p-6 shadow-2xl md:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h3 className="font-display text-2xl font-bold text-primary-navy">Salvar proposta</h3>
            <p className="mt-1 text-base text-neutral-gray">
              Vincule esta simulação a uma empresa e a um status do funil.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="rounded-full p-2 text-neutral-gray transition-colors hover:bg-accent-light hover:text-primary-navy"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {savedId ? (
          <div className="py-6 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle2 className="h-9 w-9 text-green-600" />
            </div>
            <h4 className="text-xl font-bold text-primary-navy">Proposta salva!</h4>
            <p className="mt-2 text-base text-neutral-gray">
              Ela já está no seu painel com status inicial.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link href={`/painel/${savedId}`}>
                <Button variant="primary" size="md" className="w-full sm:w-auto">
                  Ver proposta
                </Button>
              </Link>
              <Button variant="secondary" size="md" onClick={onClose} className="w-full sm:w-auto">
                Continuar simulando
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <Input
              label="Razão social *"
              placeholder="Empresa Exemplo Ltda."
              value={values.razaoSocial}
              onChange={(e) => set('razaoSocial', e.target.value)}
              required
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="CNPJ *"
                placeholder="00.000.000/0000-00"
                value={values.cnpj}
                onChange={(e) => set('cnpj', e.target.value)}
                required
              />
              <Select
                label="Status"
                value={values.status}
                onChange={(e) => set('status', e.target.value as CompanyFormValues['status'])}
                options={statusOptions}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Contato (nome)"
                placeholder="Responsável na empresa"
                value={values.contatoNome}
                onChange={(e) => set('contatoNome', e.target.value)}
              />
              <Input
                label="Contato (telefone)"
                type="tel"
                placeholder="(31) 90000-0000"
                value={values.contatoTelefone}
                onChange={(e) => set('contatoTelefone', e.target.value)}
              />
            </div>
            <Input
              label="Contato (e-mail)"
              type="email"
              placeholder="contato@empresa.com.br"
              value={values.contatoEmail}
              onChange={(e) => set('contatoEmail', e.target.value)}
            />
            <Textarea
              label="Observações"
              rows={3}
              placeholder="Notas internas sobre este lead (opcional)."
              value={values.observacoes}
              onChange={(e) => set('observacoes', e.target.value)}
            />

            {error && (
              <p className="rounded-xl bg-red-50 px-4 py-3 text-base text-red-600" role="alert">
                {error}
              </p>
            )}

            <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-end">
              <Button type="button" variant="ghost" size="md" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" variant="primary" size="md" isLoading={saving}>
                {saving ? 'Salvando...' : 'Salvar proposta'}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>,
    document.body,
  );
}
