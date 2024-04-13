import { redirect } from '@remix-run/node';
import { and, eq } from 'drizzle-orm';
import { db } from '~/db/db';
import { mesocycles } from '~/db/schema/mesocycles';
import { mesocyclesDays } from '~/db/schema/mesocycles-days';
import { mesocyclesDaysExercises } from '~/db/schema/mesocycles-days-exercises';
import { TypedSession } from '~/utils/sessions.server';

type AddExercise = {
  id: number;
  mesocycleId: number;
  mesocycleDayId: number;
};

export async function addExerciseToMesocycleDay(
  session: TypedSession,
  addExercise: AddExercise,
) {
  const userId = session.get('userId');
  if (userId) {
    const existingMesocycleRows = await db
      .select({
        day: { number: mesocyclesDays.number },
      })
      .from(mesocycles)
      .where(
        and(
          eq(mesocycles.id, addExercise.mesocycleId),
          eq(mesocycles.userId, userId),
        ),
      )
      .leftJoin(mesocyclesDays, eq(mesocycles.id, mesocyclesDays.mesocycleId));

    if (existingMesocycleRows.length === 0) {
      session.flash('error', 'Mesocycle not found');
      throw redirect('/mesocycles', {
        headers: {
          'Set-Cookie': await sessionStorage.commitSession(session),
        },
      });
    }

    const existingMesocycleDays = existingMesocycleRows.reduce<
      { number: number }[]
    >((acc, row) => {
      const day = row.day;
      if (day) {
        acc.push(day);
      }

      return acc;
    }, []);

    const existingMesocycleDayExercises = await db
      .select({ number: mesocyclesDays.number })
      .from(mesocyclesDaysExercises)
      .where(eq(mesocyclesDays.mesocycleId, newMesocycleDay.mesocycleId))
      .orderBy(mesocyclesDays.number)
      .limit(1);

    const lastMesocycleDay = existingMesocycleDays.at(-1);

    await db.insert(mesocyclesDays).values({
      name: newMesocycleDay.name,
      mesocycleId: newMesocycleDay.mesocycleId,
      number: (lastMesocycleDay?.number || 0) + 1,
    });

    return;
  }
}
