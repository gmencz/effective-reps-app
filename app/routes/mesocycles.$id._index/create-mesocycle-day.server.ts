import { prisma } from '~/utils/prisma.server';

type NewMesocycleDay = {
  name: string;
  mesocycleId: number;
};

export async function createMesocycleDay(
  userId: number,
  newMesocycleDay: NewMesocycleDay,
) {
  const existingMesocycleDays = await prisma.mesocycleDay.findMany({
    where: {
      AND: [
        { mesocycle: { userId } },
        { mesocycleId: newMesocycleDay.mesocycleId },
      ],
    },
    select: {
      order: true,
    },
  });

  const order = existingMesocycleDays.at(-1)?.order || 1;

  await prisma.mesocycleDay.create({
    data: {
      name: newMesocycleDay.name,
      order,
      mesocycleId: newMesocycleDay.mesocycleId,
    },
  });
}
