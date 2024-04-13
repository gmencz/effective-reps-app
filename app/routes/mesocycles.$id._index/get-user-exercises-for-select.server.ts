import { desc, eq } from 'drizzle-orm';
import { db } from '~/db/db';
import { SelectExercise, exercises } from '~/db/schema/exercises';
import { TypedSession } from '~/utils/sessions.server';

export async function getUserExercisesForSelect(
  session: TypedSession,
): Promise<Pick<SelectExercise, 'id' | 'name' | 'unilateral'>[]> {
  const userId = session.get('userId');
  if (userId) {
    // Fetch user exercises from database
    const userExercises = await db
      .select({
        id: exercises.id,
        name: exercises.name,
        unilateral: exercises.unilateral,
        createdAt: exercises.createdAt,
      })
      .from(exercises)
      .where(eq(exercises.userId, userId))
      .orderBy(desc(exercises.createdAt));

    return userExercises.map(mapExercise);
  }

  // Get user exercises from session (user hasn't logged in)
  const userExercises = session.get('exercises') || [];
  return userExercises
    .sort(
      (a, b) =>
        new Date(b.createdAt).valueOf() - new Date(a.createdAt).valueOf(),
    )
    .map(mapExercise);
}

function mapExercise(
  exercise: Pick<SelectExercise, 'id' | 'name' | 'unilateral' | 'createdAt'>,
): Pick<SelectExercise, 'id' | 'name' | 'unilateral'> {
  return {
    id: exercise.id,
    name: exercise.name,
    unilateral: exercise.unilateral,
  };
}
