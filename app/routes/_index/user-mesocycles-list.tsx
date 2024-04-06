import { SerializeFrom } from '@remix-run/node';
import { loader } from './route';
import { Link } from '@remix-run/react';

type Props = {
  userMesocycles: SerializeFrom<typeof loader>['userMesocycles'];
};

export function UserMesocyclesList({ userMesocycles }: Props) {
  return (
    <ul>
      {userMesocycles.map((mesocycle) => (
        <li key={mesocycle.id}>
          <Link to={`/mesocycles/${mesocycle.id}`}>
            {mesocycle.name} - {mesocycle.createdAt}
          </Link>
        </li>
      ))}
    </ul>
  );
}
