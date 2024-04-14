import { prisma } from '~/shared/prisma.server';

export type NewMesocycle = {
  name: string;
};

export async function createMesocycle(
  userId: number,
  newMesocycle: NewMesocycle,
) {
  await prisma.mesocycle.create({
    data: {
      name: newMesocycle.name,
      userId,
    },
  });
}
