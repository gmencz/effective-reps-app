import { prisma } from '~/shared/prisma.server';

export async function getTrainingSession(id: number, userId: number) {
  return prisma.trainingSession.findFirst({
    where: {
      AND: [{ userId }, { id }],
    },
    select: {
      id: true,
      notes: true,
      exercises: {
        select: {
          id: true,
          number: true,
          exercise: { select: { name: true } },
          notes: true,
          mesocycleDayExercise: {
            select: {
              notes: true,
              sets: {
                select: {
                  number: true,
                  notes: true,
                  repRange: true,
                  rir: true,
                  restSeconds: true,
                },
              },
            },
          },
          sets: {
            select: {
              id: true,
              number: true,
              notes: true,
              weight: true,
              reps: true,
              rir: true,
              restSeconds: true,
            },
            orderBy: {
              number: 'asc',
            },
          },
        },
        orderBy: {
          number: 'asc',
        },
      },
      mesocycleDay: {
        select: {
          name: true,
          notes: true,
        },
      },
    },
  });
}
