import { prisma } from '~/utils/prisma.server';

export default async function getMuscleGroups() {
  return prisma.muscleGroup.findMany();
}
