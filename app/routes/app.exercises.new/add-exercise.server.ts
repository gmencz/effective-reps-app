import { prisma } from '~/utils/prisma.server';
import getMuscleGroup from '../app.exercises.$exerciseId/get-muscleGroup.server';

export interface AddExerciseInput {
  userId: string;
  name: string;
  muscleGroupId: string;
  secondaryMuscleGroupsIds: string[] | undefined;
}

export default async function addExercise({
  userId,
  name,
  muscleGroupId,
  secondaryMuscleGroupsIds,
}: AddExerciseInput) {
  const muscleGroup = await getMuscleGroup(muscleGroupId);

  if (!muscleGroup) {
    throw new Error('the muscle group does not exist');
  }
  const secondaryMuscleGroups = secondaryMuscleGroupsIds
    ? {
        secondaryMuscleGroups: {
          connect:
            secondaryMuscleGroupsIds?.map((secondaryMuscleGroupId) => {
              return { id: secondaryMuscleGroupId };
            }) || [],
        },
      }
    : {};

  return prisma.exercise.create({
    data: {
      userId,
      exerciseTextSearch: `${name} ${muscleGroup?.name}`,
      name,
      muscleGroupId,
      ...secondaryMuscleGroups,
    },
  });
}
