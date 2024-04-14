import { prisma } from '~/shared/prisma.server';

export async function getExercises(userId: number) {
  return prisma.exercise.findMany({
    where: {
      userId,
    },
    select: {
      id: true,
      name: true,
      unilateral: true,
    },
  });
}
