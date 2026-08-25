import 'server-only';
import { asc, eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { users, type NewUser, type User } from '@/lib/db/schema';

/** Dados públicos de um usuário (sem o hash de senha). */
export type PublicUser = Omit<User, 'passwordHash'>;

export async function findUserByEmail(email: string): Promise<User | null> {
  const [row] = await db
    .select()
    .from(users)
    .where(eq(users.email, email.toLowerCase()))
    .limit(1);
  return row ?? null;
}

export async function listUsers(): Promise<PublicUser[]> {
  return db
    .select({
      id: users.id,
      email: users.email,
      name: users.name,
      role: users.role,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
    })
    .from(users)
    .orderBy(asc(users.createdAt));
}

export async function insertUser(data: NewUser): Promise<PublicUser> {
  const [row] = await db
    .insert(users)
    .values({ ...data, email: data.email.toLowerCase() })
    .returning({
      id: users.id,
      email: users.email,
      name: users.name,
      role: users.role,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
    });
  return row;
}
