import { prisma } from '~/utils/prisma.server';

export async function getExercisesForSelect(userId: number) {
  return prisma.exercise.findMany({
    where: {
      userId,
    },
    select: {
      id: true,
      name: true,
      unilateral: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}
