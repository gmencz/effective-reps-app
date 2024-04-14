import { prisma } from '~/shared/prisma.server';

type UpdatedSet = {
  weight: number | null;
  reps: number | null;
  rir: number | null;
  restSeconds: number | null;
  notes: string | null;
};

export async function updateSet(
  id: number,
  trainingSessionId: number,
  userId: number,
  updatedSet: UpdatedSet,
) {
  const trainingSession = await prisma.trainingSession.findFirst({
    where: {
      AND: [{ userId }, { id: trainingSessionId }],
    },
    select: {
      exercises: {
        select: {
          sets: {
            select: {
              id: true,
            },
          },
        },
        where: {
          sets: {
            some: {
              id,
            },
          },
        },
      },
    },
  });

  if (!trainingSession || trainingSession.exercises.length === 0) {
    return;
  }

  await prisma.trainingSessionExerciseSet.update({
    where: { id },
    data: {
      weight: { set: updatedSet.weight },
      reps: { set: updatedSet.reps },
      rir: { set: updatedSet.rir },
      restSeconds: { set: updatedSet.restSeconds },
      notes: { set: updatedSet.notes },
    },
  });
}
