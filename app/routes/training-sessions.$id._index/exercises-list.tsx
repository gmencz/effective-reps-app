import { useLoaderData } from '@remix-run/react';
import { loader } from './route';
import { UpdateSetForm } from './update-set-form';

export function ExercisesList() {
  const { trainingSession } = useLoaderData<typeof loader>();

  return (
    <ol>
      {trainingSession.exercises.map((exercise) => (
        <li key={exercise.id}>
          <h2>{exercise.exercise.name}</h2>
          <p>{exercise.notes}</p>
          <ol>
            {exercise.sets.map((set) => (
              <li key={set.id}>
                <UpdateSetForm
                  set={set}
                  mesocycleDayExercise={exercise.mesocycleDayExercise}
                />
              </li>
            ))}
          </ol>
        </li>
      ))}
    </ol>
  );
}
