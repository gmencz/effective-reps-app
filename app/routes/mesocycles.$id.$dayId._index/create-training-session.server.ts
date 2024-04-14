import { prisma } from '~/shared/prisma.server';

export async function createTrainingSession(userId: number, dayId: number) {
  const day = await prisma.mesocycleDay.findFirst({
    where: {
      AND: [{ mesocycle: { userId } }, { id: dayId }],
    },
    select: {
      exercises: {
        select: {
          id: true,
          exerciseId: true,
          number: true,
          sets: {
            select: {
              number: true,
              rir: true,
              restSeconds: true,
            },
          },
        },
      },
    },
  });

  const { id } = await prisma.trainingSession.create({
    data: {
      userId,
      mesocycleDayId: dayId,
      exercises: {
        create: day?.exercises.map((exercise) => ({
          mesocycleDayExerciseId: exercise.id,
          exerciseId: exercise.exerciseId,
          number: exercise.number,
          sets: {
            create: exercise.sets.map((set) => ({
              number: set.number,
            })),
          },
        })),
      },
    },
    select: {
      id: true,
    },
  });

  return id;
}
