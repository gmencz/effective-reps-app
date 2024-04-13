import { db } from '~/db/db';
import { exercises } from '~/db/schema/exercises';
import { TypedSession } from '~/utils/sessions.server';

export type NewExercise = {
  name: string;
};

export async function createExercise(
  session: TypedSession,
  newExercise: NewExercise,
) {
  const userId = session.get('userId');
  if (userId) {
    await db
      .insert(exercises)
      .values({ name: newExercise.name, unilateral: false, userId });
    return;
  }

  const userExercises = session.get('exercises') || [];

  userExercises.push({
    id:
      userExercises.length > 0
        ? userExercises[userExercises.length - 1].id + 1
        : 1,
    name: newExercise.name,
    unilateral: false,
    createdAt: new Date().toISOString(),
  });

  session.set('exercises', userExercises);
}
