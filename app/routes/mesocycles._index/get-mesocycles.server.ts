import { prisma } from '~/utils/prisma.server';

export async function getMesocycles(userId: number) {
  return prisma.mesocycle.findMany({
    where: { userId },
    select: {
      id: true,
      name: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}
