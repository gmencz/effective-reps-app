import { format, parseISO } from 'date-fns';
import { desc, eq } from 'drizzle-orm';
import { db } from '~/db/db';
import { SelectMesocycle, mesocycles } from '~/db/schema/mesocycles';
import { TypedSession } from '~/utils/sessions.server';

export type GetUserMesocyclesDTO = Pick<
  SelectMesocycle,
  'id' | 'name' | 'createdAt'
>;

export async function getUserMesocycles(
  session: TypedSession,
): Promise<GetUserMesocyclesDTO[]> {
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

    return userMesocycles.map(mapMesocycle);
  }

  // Get user mesocycles from session (user hasn't logged in)
  const userMesocycles = session.get('mesocycles') || [];
  return userMesocycles
    .slice() // Create copy so we don't mutate original array
    .sort(
      (a, b) =>
        new Date(b.createdAt).valueOf() - new Date(a.createdAt).valueOf(),
    )
    .map(mapMesocycle);
}

function mapMesocycle(mesocycle: GetUserMesocyclesDTO): GetUserMesocyclesDTO {
  return {
    id: mesocycle.id,
    name: mesocycle.name,
    createdAt: format(parseISO(mesocycle.createdAt), 'MM/dd/yyyy'),
  };
}
