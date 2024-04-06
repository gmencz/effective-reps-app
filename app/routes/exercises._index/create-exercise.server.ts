import { db } from '~/db/db';
import { exercises } from '~/db/schema/exercises';
import { SessionType } from '~/utils/sessions.server';

export type NewExercise = {
  name: string;
};

export async function createExercise(
  session: SessionType,
  newExercise: NewExercise,
) {
  const userId = session.get('userId');
  if (userId) {
    await db.insert(exercises).values({ name: newExercise.name, userId });
    return;
  }

  const userExercises = session.get('exercises') || [];

  session.set('exercises', [
    ...userExercises,
    {
      id:
        userExercises.length > 0
          ? userExercises[userExercises.length - 1].id + 1
          : 1,
      name: newExercise.name,
      createdAt: new Date().toISOString(),
    },
  ]);
}
