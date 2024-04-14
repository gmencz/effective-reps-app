import { prisma } from '~/shared/prisma.server';

type NewSet = {
  repRange: string;
  rir: number;
  restSeconds: number | null;
  notes: string | null;
};

export async function addSet(
  userId: number,
  dayId: number,
  exerciseId: number,
  newSet: NewSet,
) {
  const lastSet = await prisma.mesocycleDayExerciseSet.findFirst({
    where: {
      AND: [
        { exercise: { day: { mesocycle: { userId } } } },
        { exercise: { dayId } },
        { exerciseId },
      ],
    },
    select: {
      number: true,
    },
    orderBy: {
      number: 'desc',
    },
  });

  const number = (lastSet?.number || 0) + 1;

  await prisma.mesocycleDayExerciseSet.create({
    data: {
      number,
      repRange: newSet.repRange,
      rir: newSet.rir,
      restSeconds: newSet.restSeconds,
      notes: newSet.notes,
      exerciseId,
    },
  });
}
