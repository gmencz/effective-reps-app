import { useLoaderData } from '@remix-run/react';
import { ActionIntent, loader } from './route';

type Props = {
  exerciseId: number;
};

export function AddSetForm({ exerciseId }: Props) {
  const { day, mesocycleId } = useLoaderData<typeof loader>();

  return (
    <form method="post" action={`/mesocycles/${mesocycleId}/${day.id}?index`}>
      <input type="hidden" name="_intent" value={ActionIntent.AddSet} />
      <input type="hidden" name="exerciseId" value={exerciseId} />

      <label htmlFor="repRange">Rep range</label>
      <input
        type="text"
        required
        name="repRange"
        id="repRange"
        placeholder="4-8"
      />

      <label htmlFor="rir">RIR</label>
      <input type="number" required name="rir" id="rir" placeholder="1" />

      <label htmlFor="restSeconds">Rest seconds (optional)</label>
      <input type="number" name="restSeconds" id="restSeconds" />

      <label htmlFor="notes">Notes (optional)</label>
      <textarea name="notes" id="notes" cols={30} rows={10}></textarea>

      <button type="submit">Add set</button>
    </form>
  );
}
