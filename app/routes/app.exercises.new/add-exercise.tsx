import { prisma } from '~/utils/prisma.server';
import getMuscleGroup from '../app.exercises.$exerciseId/get-muscleGroup';

export interface addExerciseInput {
  userId: string;
  name: string;
  muscleGroupId: string;
}

export default async function AddExercise({
  userId,
  name,
  muscleGroupId,
}: addExerciseInput) {
  const muscleGroup = await getMuscleGroup(muscleGroupId);

  if (!muscleGroup) {
    throw new Error('the muscle group does not exist');
  }

  return prisma.exercise.create({
    data: {
      userId,
      exerciseTextSearch: `${name} ${muscleGroup?.name}`,
      name,
      muscleGroupId,
    },
  });
}
