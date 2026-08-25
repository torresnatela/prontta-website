'use server';

import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/auth/current-user';
import { createUserSchema } from '@/lib/auth/schemas';
import { hashPassword } from '@/lib/auth/password';
import { findUserByEmail, insertUser } from '@/lib/db/queries/users';

export interface CreateUserResult {
  ok: boolean;
  error?: string;
}

export async function createUser(input: {
  name: string;
  email: string;
  password: string;
  role: string;
}): Promise<CreateUserResult> {
  await requireAdmin();

  const parsed = createUserSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? 'Dados inválidos.' };
  }

  const { name, email, password, role } = parsed.data;

  const existing = await findUserByEmail(email);
  if (existing) return { ok: false, error: 'Já existe um usuário com esse e-mail.' };

  const passwordHash = await hashPassword(password);
  try {
    await insertUser({ name, email, passwordHash, role });
  } catch (err) {
    // Corrida no índice único de e-mail.
    if (typeof err === 'object' && err !== null && 'code' in err && err.code === '23505') {
      return { ok: false, error: 'Já existe um usuário com esse e-mail.' };
    }
    throw err;
  }

  revalidatePath('/admin/users');
  return { ok: true };
}
