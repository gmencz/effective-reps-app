import { prisma } from '~/utils/prisma.server';

export async function getMesocycle(id: number, userId: number) {
  return prisma.mesocycle.findFirst({
    where: {
      AND: [{ id }, { userId }],
    },
    select: {
      id: true,
      name: true,
      days: {
        select: {
          id: true,
          name: true,
        },
        orderBy: {
          order: 'asc',
        },
      },
    },
  });
}
