import { prisma } from '~/utils/prisma.server';

export interface GetWorkoutsInput {
  userId: string;
}

export function getWorkouts(input: GetWorkoutsInput) {
  return prisma.workout.findMany({
    where: {
      userId: input.userId,
    },
    select: {
      id: true,
      name: true,
      feedback: true,
      date: true,
    },
  });
}
