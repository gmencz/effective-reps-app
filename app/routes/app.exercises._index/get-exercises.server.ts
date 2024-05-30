import { Prisma } from '@prisma/client';
import { prisma } from '~/utils/prisma.server';

export interface GetExercisesInput {
  userId: string;
  query: string | undefined;
}

export function getExercises(input: GetExercisesInput) {
  const where = input.query
    ? {
        AND: [
          { userId: input.userId },
          ...input.query.split(' ').map((query) => {
            return {
              exerciseTextSearch: {
                contains: query,
                mode: Prisma.QueryMode.insensitive,
              },
            };
          }),
        ],
      }
    : { userId: input.userId };

  return prisma.exercise.findMany({
    where,
    select: {
      id: true,
      name: true,
      muscleGroup: { select: { name: true } },
    },
    orderBy: {
      name: 'asc',
    },
  });
}
