import { prisma } from '~/utils/prisma.server';

export interface getExerciseInputWithId {
  id: string;
  userId: string;
  name?: undefined;
  includeMuscleGroup: boolean;
}
export interface getExerciseInputWithName {
  id?: undefined;
  userId: string;
  name: string;
  includeMuscleGroup: boolean;
}
export default async function getExercise({
  id,
  userId,
  name,
  includeMuscleGroup,
}: getExerciseInputWithId | getExerciseInputWithName) {
  const include = includeMuscleGroup
    ? {
        muscleGroup: {
          select: { name: true },
        },
      }
    : {};

  const where = id
    ? {
        id_userId: { id, userId },
      }
    : {
        name_userId: {
          name: name as string,
          userId,
        },
      };

  return prisma.exercise.findUnique({
    where,
    include: {
      ...include,
    },
  });
}
