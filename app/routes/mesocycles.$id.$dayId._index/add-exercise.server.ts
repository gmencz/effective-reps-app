import { prisma } from '~/shared/prisma.server';

type AddExercise = {
  id: number;
  dayId: number;
};

export async function addExercise(userId: number, addExercise: AddExercise) {
  const lastExercise = await prisma.mesocycleDayExercise.findFirst({
    where: {
      AND: [{ day: { mesocycle: { userId } } }, { dayId: addExercise.dayId }],
    },
    select: {
      number: true,
    },
    orderBy: {
      number: 'desc',
    },
  });

  const number = (lastExercise?.number || 0) + 1;

  await prisma.mesocycleDayExercise.create({
    data: {
      exerciseId: addExercise.id,
      dayId: addExercise.dayId,
      number,
    },
  });
}
