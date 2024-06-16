import { prisma } from '~/utils/prisma.server';

export default async function getMuscleGroup(id: string) {
  return prisma.muscleGroup.findUnique({
    where: { id },
  });
}
