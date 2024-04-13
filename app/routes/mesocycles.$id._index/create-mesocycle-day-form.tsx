import { useLoaderData } from '@remix-run/react';
import { ActionIntent, loader } from './route';

export function CreateMesocycleDayForm() {
  const { mesocycle } = useLoaderData<typeof loader>();

  return (
    <form method="post" action={`/mesocycles/${mesocycle.id}?index`}>
      <input
        type="hidden"
        name="_intent"
        value={ActionIntent.CreateMesocycleDay}
      />

      <label htmlFor="mesocycleDayName">Mesocycle day name</label>
      <input type="text" id="mesocycleDayName" name="mesocycleDayName" />
      <button type="submit">Create mesocycle day</button>
    </form>
  );
}
