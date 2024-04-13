import { useLoaderData } from '@remix-run/react';
import { ActionIntent, loader } from './route';

export function StartSessionForm() {
  const { day, mesocycleId } = useLoaderData<typeof loader>();

  return (
    <form method="post" action={`/mesocycles/${mesocycleId}/${day.id}?index`}>
      <input type="hidden" name="_intent" value={ActionIntent.StartSession} />
      <button type="submit">Start session</button>
    </form>
  );
}
