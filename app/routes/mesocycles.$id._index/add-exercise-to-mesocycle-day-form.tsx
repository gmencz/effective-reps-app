import { useLoaderData } from '@remix-run/react';
import { ActionIntent, loader } from './route';

type Props = {
  mesocycleDayId: number;
};

export function AddExerciseToMesocycleDayForm({ mesocycleDayId }: Props) {
  const { mesocycle, exercisesForSelect } = useLoaderData<typeof loader>();

  return (
    <form method="post" action={`/mesocycles/${mesocycle.id}?index`}>
      <input
        type="hidden"
        name="_intent"
        value={ActionIntent.AddExerciseToMesocycleDay}
      />

      <input type="hidden" name="mesocycleDayId" value={mesocycleDayId} />

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
