import { prisma } from '~/utils/prisma.server';
import getMuscleGroup from './get-muscleGroup';

export interface updateExerciseInput {
  userId: string;
  id: string;
  name: string;
  muscleGroupId: string;
}
export default async function updateExercise({
  userId,
  id,
  name,
  muscleGroupId,
}: updateExerciseInput) {
  const muscleGroup = await getMuscleGroup(muscleGroupId);

  if (!muscleGroup) {
    throw new Error('the muscle group does not exist');
  }

  return await prisma.exercise.update({
    where: { id_userId: { id, userId } },
    data: {
      name,
      muscleGroupId,
      exerciseTextSearch: `${name} ${muscleGroup?.name}`,
    },
  });
}
