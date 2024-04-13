import { prisma } from '~/utils/prisma.server';
import bcrypt from 'bcryptjs';

export async function checkCredentials(email: string, password: string) {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
      passwordHash: true,
    },
  });

  if (!user) {
    return null;
  }

  if (await bcrypt.compare(password, user.passwordHash)) {
    return { id: user.id };
  }

  return null;
}
