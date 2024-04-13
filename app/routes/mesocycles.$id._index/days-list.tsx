import { Link, useRouteLoaderData } from '@remix-run/react';
import { loader } from '../mesocycles.$id/route';
import { SerializeFrom } from '@remix-run/node';

export function DaysList() {
  const { mesocycle } = useRouteLoaderData<SerializeFrom<typeof loader>>(
    'routes/mesocycles.$id',
  )!;

  return (
    <>
      <ol>
        {mesocycle.days.map((day) => (
          <li key={day.id}>
            <h2>
              <Link to={`${day.id}`}>{day.name}</Link>
            </h2>
          </li>
        ))}
      </ol>
    </>
  );
}
