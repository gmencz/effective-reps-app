import { prisma } from '~/utils/prisma.server';

type NewDay = {
  name: string;
  mesocycleId: number;
};

export async function addDay(userId: number, newDay: NewDay) {
  const existingDays = await prisma.mesocycleDay.findMany({
    where: {
      AND: [{ mesocycle: { userId } }, { mesocycleId: newDay.mesocycleId }],
    },
    select: {
      order: true,
    },
  });

  const order = existingDays.at(-1)?.order || 1;

  await prisma.mesocycleDay.create({
    data: {
      name: newDay.name,
      order,
      mesocycleId: newDay.mesocycleId,
    },
  });
}
