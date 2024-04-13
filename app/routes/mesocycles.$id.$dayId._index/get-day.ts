import { prisma } from '~/utils/prisma.server';

export async function getDay(id: number, userId: number) {
  return prisma.mesocycleDay.findFirst({
    where: {
      AND: [{ mesocycle: { userId } }, { id }],
    },
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
  });
}
