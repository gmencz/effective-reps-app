import { prisma } from '~/utils/prisma.server';

type AddExercise = {
  id: number;
  mesocycleDayId: number;
};

export async function addExerciseToMesocycleDay(
  userId: number,
  addExercise: AddExercise,
) {
  const existingDayExercises = await prisma.mesocycleDayExercise.findMany({
    where: {
      AND: [
        { day: { mesocycle: { userId } } },
        { dayId: addExercise.mesocycleDayId },
      ],
    },
    select: {
      number: true,
    },
  });

  const number = existingDayExercises.at(-1)?.number || 1;

  await prisma.mesocycleDayExercise.create({
    data: {
      exerciseId: addExercise.id,
      dayId: addExercise.mesocycleDayId,
      number,
    },
  });
}
