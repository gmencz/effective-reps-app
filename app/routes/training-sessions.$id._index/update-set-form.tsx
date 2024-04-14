import { useLoaderData } from '@remix-run/react';
import { ActionIntent, loader } from './route';
import { SerializeFrom } from '@remix-run/node';

type Props = {
  set: SerializeFrom<
    typeof loader
  >['trainingSession']['exercises'][number]['sets'][number];
  mesocycleDayExercise: SerializeFrom<
    typeof loader
  >['trainingSession']['exercises'][number]['mesocycleDayExercise'];
};

export function UpdateSetForm({ set, mesocycleDayExercise }: Props) {
  const { trainingSession } = useLoaderData<typeof loader>();
  const mesocycleDaySet = mesocycleDayExercise?.sets.find(
    (s) => s.number === set.number,
  );

  return (
    <form method="post" action={`/training-sessions/${trainingSession.id}`}>
      <input type="hidden" name="_intent" value={ActionIntent.UpdateSet} />
      <input type="hidden" name="setId" value={set.id} />

      <p>{mesocycleDaySet?.notes}</p>

      <label htmlFor="weight">Weight</label>
      <input
        type="number"
        name="weight"
        id="weight"
        defaultValue={set.weight?.toString()}
      />

      <label htmlFor="reps">Reps</label>
      <input
        type="number"
        name="reps"
        id="reps"
        placeholder={mesocycleDaySet?.repRange}
        defaultValue={set.reps?.toString()}
      />

      <label htmlFor="rir">RIR</label>
      <input
        type="number"
        name="rir"
        id="rir"
        placeholder={mesocycleDaySet?.rir.toString()}
        defaultValue={set.rir?.toString()}
      />

      <label htmlFor="restSeconds">Rest seconds</label>
      <input
        type="number"
        name="restSeconds"
        id="restSeconds"
        placeholder={mesocycleDaySet?.restSeconds?.toString()}
        defaultValue={set.restSeconds?.toString()}
      />

      <label htmlFor="notes">Notes (optional)</label>
      <textarea
        name="notes"
        id="notes"
        cols={30}
        rows={10}
        defaultValue={set.notes?.toString()}
      ></textarea>

      <button type="submit">Save changes</button>
    </form>
  );
}
