import { useLoaderData } from '@remix-run/react';
import { ActionIntent, loader } from './route';

export function CreateTrainingSessionForm() {
  const { day, mesocycleId } = useLoaderData<typeof loader>();

  return (
    <form method="post" action={`/mesocycles/${mesocycleId}/${day.id}?index`}>
      <input type="hidden" name="_intent" value={ActionIntent.StartSession} />
      <button type="submit">New training session</button>
    </form>
  );
}
