import { useRouteLoaderData } from '@remix-run/react';
import { ActionIntent } from './route';
import { SerializeFrom } from '@remix-run/node';
import { loader } from '../mesocycles.$id/route';

export function AddDayForm() {
  const { mesocycle } = useRouteLoaderData<SerializeFrom<typeof loader>>(
    'routes/mesocycles.$id',
  )!;

  return (
    <form method="post" action={`/mesocycles/${mesocycle.id}?index`}>
      <input type="hidden" name="_intent" value={ActionIntent.AddDay} />
      <label htmlFor="dayName">Day name</label>
      <input type="text" id="dayName" name="dayName" />
      <button type="submit">Add day</button>
    </form>
  );
}
