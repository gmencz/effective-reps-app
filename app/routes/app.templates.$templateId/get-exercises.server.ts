import { prisma } from '~/utils/prisma.server';

export interface GetExercisesInput {
  userId: string;
  query: string | null;
}

export function getExercises(input: GetExercisesInput) {
  return prisma.exercise.findMany({
    where: {
      AND: [
        { userId: input.userId },
        ...(input.query ? [{ name: { search: input.query } }] : []),
      ],
    },
    select: {
      id: true,
      name: true,
    },
    orderBy: {
      name: 'asc',
    },
  });
}
