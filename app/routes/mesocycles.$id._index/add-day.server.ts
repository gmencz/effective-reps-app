import { prisma } from '~/shared/prisma.server';

type NewDay = {
  name: string;
  mesocycleId: number;
};

export async function addDay(userId: number, newDay: NewDay) {
  const lastDay = await prisma.mesocycleDay.findFirst({
    where: {
      AND: [{ mesocycle: { userId } }, { mesocycleId: newDay.mesocycleId }],
    },
    select: {
      order: true,
    },
    orderBy: {
      order: 'desc',
    },
  });

  const order = (lastDay?.order || 0) + 1;

  await prisma.mesocycleDay.create({
    data: {
      name: newDay.name,
      order,
      mesocycleId: newDay.mesocycleId,
    },
  });
}
