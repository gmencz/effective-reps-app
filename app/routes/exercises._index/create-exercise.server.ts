import { prisma } from '~/utils/prisma.server';

export type NewExercise = {
  name: string;
};

export async function createExercise(userId: number, newExercise: NewExercise) {
  await prisma.exercise.create({
    data: { name: newExercise.name, unilateral: false, userId },
  });
}
