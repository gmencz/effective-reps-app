import { redirect } from '@remix-run/node';
import { and, eq } from 'drizzle-orm';
import { db } from '~/db/db';
import { mesocycles } from '~/db/schema/mesocycles';
import { mesocyclesDays } from '~/db/schema/mesocycles-days';
import { TypedSession } from '~/utils/sessions.server';

type NewMesocycleDay = {
  name: string;
  mesocycleId: number;
};

export async function createMesocycleDay(
  session: TypedSession,
  newMesocycleDay: NewMesocycleDay,
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
          eq(mesocycles.id, newMesocycleDay.mesocycleId),
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

    const lastMesocycleDay = existingMesocycleDays.at(-1);

    await db.insert(mesocyclesDays).values({
      name: newMesocycleDay.name,
      mesocycleId: newMesocycleDay.mesocycleId,
      number: (lastMesocycleDay?.number || 0) + 1,
    });

    return;
  }

  const existingMesocycles = session.get('mesocycles') || [];
  const existingMesocycle = existingMesocycles.find(
    (mesocycle) => mesocycle.id === newMesocycleDay.mesocycleId,
  );

  if (!existingMesocycle) {
    session.flash('error', 'Mesocycle not found');
    throw redirect('/mesocycles', {
      headers: {
        'Set-Cookie': await sessionStorage.commitSession(session),
      },
    });
  }

  const lastMesocycleDay = existingMesocycle.days.at(-1);

  existingMesocycle.days.push({
    id: (lastMesocycleDay?.id || 0) + 1,
    name: newMesocycleDay.name,
    number: (lastMesocycleDay?.number || 0) + 1,
    createdAt: new Date().toISOString(),
    notes: null,
    exercises: [],
  });

  session.set('mesocycles', existingMesocycles);
}
