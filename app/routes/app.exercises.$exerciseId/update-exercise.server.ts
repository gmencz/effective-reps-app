import { prisma } from '~/utils/prisma.server';
import getMuscleGroup from './get-muscleGroup.server';

export interface updateExerciseInput {
  userId: string;
  id: string;
  name: string;
  muscleGroupId: string;
  secondaryMuscleGroupsIds: string[];
  secondaryMuscleGroupsPrevToUpdate: { id: string; name: string }[] | undefined;
}
export default async function updateExercise({
  userId,
  id,
  name,
  muscleGroupId,
  secondaryMuscleGroupsIds,
  secondaryMuscleGroupsPrevToUpdate,
}: updateExerciseInput) {
  const muscleGroup = await getMuscleGroup(muscleGroupId);

  if (!muscleGroup) {
    throw new Error('the muscle group does not exist');
  }

  const secondaryMuscleGroupsToDisconnect = secondaryMuscleGroupsPrevToUpdate
    ? secondaryMuscleGroupsPrevToUpdate
        .filter(
          (prevSecondaryMuscleGroup) =>
            secondaryMuscleGroupsIds.findIndex(
              (secondaryMuscleGroup) =>
                prevSecondaryMuscleGroup.id === secondaryMuscleGroup,
            ) === -1,
        )
        .map((value) => value.id)
    : [];

  const secondaryMuscleGroupsToConnect = secondaryMuscleGroupsPrevToUpdate
    ? secondaryMuscleGroupsIds.filter(
        (secondaryMuscleGroup) =>
          secondaryMuscleGroupsPrevToUpdate.findIndex(
            (prevSecondaryMuscleGroup) =>
              secondaryMuscleGroup === prevSecondaryMuscleGroup.id,
          ) === -1,
      )
    : [];

  return await prisma.exercise.update({
    where: { id_userId: { id, userId } },
    data: {
      name,
      muscleGroupId,
      exerciseTextSearch: `${name} ${muscleGroup?.name}`,
      secondaryMuscleGroups: {
        connect: secondaryMuscleGroupsToConnect.map((val) => ({ id: val })),
        disconnect: secondaryMuscleGroupsToDisconnect.map((val) => ({
          id: val,
        })),
      },
    },
  });
}
