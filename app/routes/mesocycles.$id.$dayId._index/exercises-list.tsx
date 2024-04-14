import { useLoaderData } from '@remix-run/react';
import { loader } from './route';
import { AddSetForm } from './add-set-form';

export function ExercisesList() {
  const { day } = useLoaderData<typeof loader>();

  return (
    <ol>
      {day.exercises.map((exercise) => (
        <li key={exercise.id}>
          <h3>{exercise.exercise.name}</h3>
          <p>{exercise.notes}</p>

          <AddSetForm exerciseId={exercise.id} />

          <table>
            <thead>
              <tr>
                <th>Set</th>
                <th>Rep range</th>
                <th>RIR</th>
                <th>Rest seconds</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {exercise.sets.map((set) => (
                <tr key={set.id}>
                  <td>{set.number}</td>
                  <td>{set.repRange}</td>
                  <td>{set.rir}</td>
                  <td>{set.restSeconds}</td>
                  <td>{set.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </li>
      ))}
    </ol>
  );
}
