import { format, parseISO } from 'date-fns';
import { desc, eq } from 'drizzle-orm';
import { db } from '~/db/db';
import { SelectExercise, exercises } from '~/db/schema/exercises';
import { SessionType } from '~/utils/sessions.server';

export async function getUserExercises(
  session: SessionType,
): Promise<Pick<SelectExercise, 'id' | 'name' | 'createdAt'>[]> {
  const userId = session.get('userId');
  if (userId) {
    // Fetch user exercises from database
    const userExercises = await db
      .select({
        id: exercises.id,
        name: exercises.name,
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
        new Date(a.createdAt).valueOf() - new Date(b.createdAt).valueOf(),
    )
    .map(formatExerciseDates);
}

function formatExerciseDates(
  mesocycle: Pick<SelectExercise, 'id' | 'name' | 'createdAt'>,
): Pick<SelectExercise, 'id' | 'name' | 'createdAt'> {
  return {
    ...mesocycle,
    createdAt: format(parseISO(mesocycle.createdAt), 'MM/dd/yyyy'),
  };
}
