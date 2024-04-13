import { useLoaderData } from '@remix-run/react';
import { loader } from './route';
import { AddExerciseToMesocycleDayForm } from './add-exercise-to-mesocycle-day-form';

export function MesocycleDaysList() {
  const { userMesocycle } = useLoaderData<typeof loader>();

  return (
    <>
      <ol>
        {userMesocycle.days.map((day) => (
          <li key={day.id}>
            <h2>{day.name}</h2>
            <p>{day.notes}</p>

            <AddExerciseToMesocycleDayForm mesocycleDayId={day.id} />

            <ol>
              {day.exercises.map((exercise) => (
                <li key={exercise.id}>
                  <h3>{exercise.name}</h3>
                  <p>{exercise.notes}</p>

                  <table>
                    <thead>
                      <tr>
                        <th>Set</th>
                        <th>Rep range</th>
                        <th>Working weight</th>
                        <th>RIR</th>
                        <th>Rest</th>
                      </tr>
                    </thead>
                    <tbody>
                      {exercise.sets.map((set) => (
                        <tr key={set.id}>
                          <td>{set.number}</td>
                          <td>{set.repRange}</td>
                          <td>{set.workingWeight}</td>
                          <td>{set.rir}</td>
                          <td>{set.restSeconds}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </li>
              ))}
            </ol>
          </li>
        ))}
      </ol>
    </>
  );
}
