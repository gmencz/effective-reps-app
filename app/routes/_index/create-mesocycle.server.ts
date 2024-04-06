import { db } from '~/db/db';
import { mesocycles } from '~/db/schema/mesocycles';
import { SessionType } from '~/utils/sessions.server';

export type NewMesocycle = {
  name: string;
};

export async function createMesocycle(
  session: SessionType,
  newMesocycle: NewMesocycle,
) {
  const userId = session.get('userId');
  if (userId) {
    await db.insert(mesocycles).values({ name: newMesocycle.name, userId });
    return;
  }

  const userMesocycles = session.get('mesocycles') || [];

  session.set('mesocycles', [
    ...userMesocycles,
    {
      id:
        userMesocycles.length > 0
          ? userMesocycles[userMesocycles.length - 1].id + 1
          : 1,
      name: newMesocycle.name,
      createdAt: new Date().toISOString(),
    },
  ]);
}
