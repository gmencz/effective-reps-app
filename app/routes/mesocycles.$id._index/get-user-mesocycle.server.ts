import { and, asc, eq } from 'drizzle-orm';
import { db } from '~/db/db';
import { SelectMesocycle, mesocycles } from '~/db/schema/mesocycles';
import {
  SelectMesocycleDay,
  mesocyclesDays,
} from '~/db/schema/mesocycles-days';
import {
  SelectMesocycleDayExercise,
  mesocyclesDaysExercises,
} from '~/db/schema/mesocycles-days-exercises';
import {
  SelectMesocycleDayExerciseSet,
  mesocyclesDaysExercisesSets,
} from '~/db/schema/mesocycles-days-exercises-sets';
import { TypedSession } from '~/utils/sessions.server';

type GetUserMesocycleDTO = Pick<SelectMesocycle, 'id' | 'name'> & {
  days: (Pick<SelectMesocycleDay, 'id' | 'name' | 'number' | 'notes'> & {
    exercises: (Pick<SelectMesocycleDayExercise, 'id' | 'number' | 'notes'> & {
      name: string;
      sets: Pick<
        SelectMesocycleDayExerciseSet,
        'id' | 'number' | 'repRange' | 'workingWeight' | 'rir' | 'restSeconds'
      >[];
    })[];
  })[];
};

export async function getUserMesocycle(
  id: number,
  session: TypedSession,
): Promise<GetUserMesocycleDTO | null> {
  const userId = session.get('userId');
  if (userId) {
    // Fetch user mesocycle from database
    const rows = await db
      .select({
        mesocycle: {
          id: mesocycles.id,
          name: mesocycles.name,
        },
        day: {
          id: mesocyclesDays.id,
          name: mesocyclesDays.name,
          number: mesocyclesDays.number,
          notes: mesocyclesDays.notes,
        },
        dayExercise: {
          id: mesocyclesDaysExercises.id,
          number: mesocyclesDaysExercises.number,
          notes: mesocyclesDaysExercises.notes,
          dayId: mesocyclesDaysExercises.mesocycleDayId,
        },
        dayExerciseSet: {
          id: mesocyclesDaysExercisesSets.id,
          number: mesocyclesDaysExercisesSets.number,
          repRange: mesocyclesDaysExercisesSets.repRange,
          workingWeight: mesocyclesDaysExercisesSets.workingWeight,
          rir: mesocyclesDaysExercisesSets.rir,
          restSeconds: mesocyclesDaysExercisesSets.restSeconds,
          dayExerciseId: mesocyclesDaysExercisesSets.mesocycleDayExerciseId,
        },
      })
      .from(mesocycles)
      .where(and(eq(mesocycles.id, id), eq(mesocycles.userId, userId)))
      .leftJoin(mesocyclesDays, eq(mesocycles.id, mesocyclesDays.mesocycleId))
      .leftJoin(
        mesocyclesDaysExercises,
        eq(mesocyclesDays.id, mesocyclesDaysExercises.mesocycleDayId),
      )
      .leftJoin(
        mesocyclesDaysExercisesSets,
        eq(
          mesocyclesDaysExercises.id,
          mesocyclesDaysExercisesSets.mesocycleDayExerciseId,
        ),
      )
      .orderBy(
        asc(mesocycles.id),
        asc(mesocyclesDays.number),
        asc(mesocyclesDaysExercises.number),
        asc(mesocyclesDaysExercisesSets.number),
      )
      .all();

    if (rows.length === 0) {
      return null;
    }

    const userMesocycle = rows.reduce<GetUserMesocycleDTO>((acc, row) => {
      const mesocycle = row.mesocycle;
      const day = row.day;
      const dayExercise = row.dayExercise;
      const dayExerciseSet = row.dayExerciseSet;

      if (!acc.id) {
        acc = { ...mesocycle, days: [] };
      }

      if (day) {
        acc.days.push({ ...day, exercises: [] });
      }

      if (dayExercise) {
        const foundDayIndex = acc.days.findIndex(
          (day) => day.id === dayExercise.dayId,
        );

        if (foundDayIndex !== -1) {
          acc.days[foundDayIndex].exercises.push({
            id: dayExercise.id,
            notes: dayExercise.notes,
            number: dayExercise.number,
            name: 'Deleted exercise',
            sets: [],
          });
        }
      }

      if (dayExerciseSet) {
        const foundDayIndex = acc.days.findIndex((day) =>
          day.exercises.some(
            (exercise) => exercise.id === dayExerciseSet.dayExerciseId,
          ),
        );

        if (foundDayIndex !== -1) {
          acc.days[foundDayIndex].exercises = acc.days[
            foundDayIndex
          ].exercises.map((exercise) => {
            if (exercise.id === dayExerciseSet.dayExerciseId) {
              exercise.sets.push({
                id: dayExerciseSet.id,
                number: dayExerciseSet.number,
                repRange: dayExerciseSet.repRange,
                workingWeight: dayExerciseSet.workingWeight,
                rir: dayExerciseSet.rir,
                restSeconds: dayExerciseSet.restSeconds,
              });
            }

            return exercise;
          });
        }
      }

      return acc;
    }, {} as GetUserMesocycleDTO);

    return userMesocycle;
  }

  // Get user mesocycles from session (user hasn't logged in)
  const userMesocycles = session.get('mesocycles') || [];
  if (userMesocycles.length === 0) {
    return null;
  }

  const userMesocycle = userMesocycles.find((mesocycle) => mesocycle.id === id);

  if (!userMesocycle) {
    return null;
  }

  const userExercises = session.get('exercises') || [];

  return {
    id: userMesocycle.id,
    name: userMesocycle.name,
    days: userMesocycle.days.map((day) => ({
      id: day.id,
      name: day.name,
      number: day.number,
      notes: day.notes,
      exercises: day.exercises.map((exercise) => ({
        id: exercise.id,
        notes: exercise.notes,
        number: exercise.number,
        name:
          userExercises.find(
            (userExercise) => userExercise.id === exercise.exerciseId,
          )?.name || 'Deleted exercise',
        sets: exercise.sets.map((set) => ({
          id: set.id,
          number: set.number,
          repRange: set.repRange,
          workingWeight: set.workingWeight,
          rir: set.rir,
          restSeconds: set.restSeconds,
        })),
      })),
    })),
  };
}
