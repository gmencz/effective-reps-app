import { format, parseISO } from 'date-fns';
import { desc, eq } from 'drizzle-orm';
import { db } from '~/db/db';
import { SelectExercise, exercises } from '~/db/schema/exercises';
import { TypedSession } from '~/utils/sessions.server';

export async function getUserExercises(
  session: TypedSession,
): Promise<Pick<SelectExercise, 'id' | 'name' | 'unilateral' | 'createdAt'>[]> {
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

    return userExercises.map(formatExerciseDates);
  }

  // Get user exercises from session (user hasn't logged in)
  const userExercises = session.get('exercises') || [];
  return userExercises
    .sort(
      (a, b) =>
        new Date(b.createdAt).valueOf() - new Date(a.createdAt).valueOf(),
    )
    .map(formatExerciseDates);
}

function formatExerciseDates(
  exercise: Pick<SelectExercise, 'id' | 'name' | 'unilateral' | 'createdAt'>,
): Pick<SelectExercise, 'id' | 'name' | 'unilateral' | 'createdAt'> {
  return {
    ...exercise,
    createdAt: format(parseISO(exercise.createdAt), 'MM/dd/yyyy'),
  };
}
