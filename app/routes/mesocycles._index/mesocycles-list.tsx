import { SerializeFrom } from '@remix-run/node';
import { loader } from './route';
import { Link } from '@remix-run/react';

type Props = {
  mesocycles: SerializeFrom<typeof loader>['mesocycles'];
};

export function MesocyclesList({ mesocycles }: Props) {
  return (
    <ul>
      {mesocycles.map((mesocycle) => (
        <li key={mesocycle.id}>
          <Link to={`${mesocycle.id}`}>{mesocycle.name}</Link>
        </li>
      ))}
    </ul>
  );
}
