import { format, parseISO } from 'date-fns';
import { desc, eq } from 'drizzle-orm';
import { db } from '~/db/db';
import { SelectMesocycle, mesocycles } from '~/db/schema/mesocycles';
import { getSession } from '~/utils/sessions.server';

export async function getUserMesocycles(
  request: Request,
): Promise<Pick<SelectMesocycle, 'id' | 'name' | 'createdAt'>[]> {
  const session = await getSession(request);
  const userId = session.get('userId');
  if (userId) {
    // Fetch user mesocycles from database
    const userMesocycles = await db
      .select({
        id: mesocycles.id,
        name: mesocycles.name,
        createdAt: mesocycles.createdAt,
      })
      .from(mesocycles)
      .where(eq(mesocycles.userId, userId))
      .orderBy(desc(mesocycles.createdAt));

    return userMesocycles.map(formatMesocycleDates);
  }

  // Get user mesocycles from session (user hasn't logged in)
  const userMesocycles = session.get('mesocycles') || [
    {
      id: 1,
      name: 'Test Meso 1',
      createdAt: new Date().toISOString(),
    },
    {
      id: 2,
      name: 'Test Meso 2',
      createdAt: new Date().toISOString(),
    },
  ];

  return userMesocycles.map(formatMesocycleDates);
}

function formatMesocycleDates(
  mesocycle: Pick<SelectMesocycle, 'id' | 'name' | 'createdAt'>,
): Pick<SelectMesocycle, 'id' | 'name' | 'createdAt'> {
  return {
    ...mesocycle,
    createdAt: format(parseISO(mesocycle.createdAt), 'MM/dd/yyyy'),
  };
}
