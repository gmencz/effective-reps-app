import { useLoaderData } from '@remix-run/react';
import { ActionIntent, loader } from './route';

type Props = {
  mesocycleDayId: number;
};

export function AddExerciseToMesocycleDayForm({ mesocycleDayId }: Props) {
  const { userMesocycle, userExercisesForSelect } =
    useLoaderData<typeof loader>();

  return (
    <form method="post" action={`/mesocycles/${userMesocycle.id}?index`}>
      <input
        type="hidden"
        name="_intent"
        value={ActionIntent.AddExerciseToMesocycleDay}
      />
      <input type="hidden" name="mesocycleDayId" value={mesocycleDayId} />

      <label htmlFor="exerciseId">Select exercise</label>
      <select name="exerciseId" id="exerciseId">
        {userExercisesForSelect.map((exercise) => (
          <option key={exercise.id} value={exercise.id}>
            {exercise.name}
          </option>
        ))}
      </select>
      <button type="submit">Add selected exercise</button>
    </form>
  );
}
