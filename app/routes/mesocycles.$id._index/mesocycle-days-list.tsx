import { Link, useLoaderData } from '@remix-run/react';
import { loader } from './route';
import { AddExerciseToMesocycleDayForm } from './add-exercise-to-mesocycle-day-form';

export function MesocycleDaysList() {
  const { mesocycle } = useLoaderData<typeof loader>();

  return (
    <>
      <ol>
        {mesocycle.days.map((day) => (
          <li key={day.id}>
            <h2>
              <Link to={`${day.id}`}>{day.name}</Link>
            </h2>
            <p>{day.notes}</p>

            <AddExerciseToMesocycleDayForm mesocycleDayId={day.id} />

            <ol>
              {day.exercises.map((exercise) => (
                <li key={exercise.id}>
                  <h3>{exercise.exercise.name}</h3>

                  <ol>
                    {exercise.sets.map((set) => (
                      <li key={set.id}>{set.repRange}</li>
                    ))}
                  </ol>
                </li>
              ))}
            </ol>
          </li>
        ))}
      </ol>
    </>
  );
}
