import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email('E-mail inválido.'),
  password: z.string().min(1, 'Informe a senha.'),
});

export const createUserSchema = z.object({
  name: z.string().trim().min(2, 'Informe o nome.'),
  email: z.string().trim().toLowerCase().email('E-mail inválido.'),
  password: z.string().min(10, 'A senha deve ter no mínimo 10 caracteres.'),
  role: z.enum(['admin', 'partner']),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type CreateUserInput = z.infer<typeof createUserSchema>;
