import { useLoaderData } from '@remix-run/react';
import { ActionIntent, loader } from './route';

export function AddExerciseForm() {
  const { day, mesocycleId, exercisesForSelect } =
    useLoaderData<typeof loader>();

  return (
    <form method="post" action={`/mesocycles/${mesocycleId}/${day.id}?index`}>
      <input type="hidden" name="_intent" value={ActionIntent.AddExercise} />
      <label htmlFor="exerciseId">Select exercise</label>
      <select name="exerciseId" id="exerciseId">
        {exercisesForSelect.map((exercise) => (
          <option key={exercise.id} value={exercise.id}>
            {exercise.name} - {exercise.unilateral}
          </option>
        ))}
      </select>
      <button type="submit">Add selected exercise</button>
    </form>
  );
}
