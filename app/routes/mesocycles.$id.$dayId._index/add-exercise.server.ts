import { prisma } from '~/utils/prisma.server';

type AddExercise = {
  id: number;
  dayId: number;
};

export async function addExercise(userId: number, addExercise: AddExercise) {
  const existingDayExercises = await prisma.mesocycleDayExercise.findMany({
    where: {
      AND: [{ day: { mesocycle: { userId } } }, { dayId: addExercise.dayId }],
    },
    select: {
      number: true,
    },
  });

  const number = existingDayExercises.at(-1)?.number || 1;

  await prisma.mesocycleDayExercise.create({
    data: {
      exerciseId: addExercise.id,
      dayId: addExercise.dayId,
      number,
    },
  });
}
