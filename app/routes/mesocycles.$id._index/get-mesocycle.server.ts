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
          notes: true,
          exercises: {
            select: {
              id: true,
              exercise: { select: { name: true } },
              sets: { select: { id: true, repRange: true } },
            },
            orderBy: {
              number: 'asc',
            },
          },
        },
        orderBy: {
          order: 'asc',
        },
      },
    },
  });
}
