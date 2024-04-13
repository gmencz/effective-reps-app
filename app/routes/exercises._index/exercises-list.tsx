import { SerializeFrom } from '@remix-run/node';
import { loader } from './route';
import { Link } from '@remix-run/react';

type Props = {
  exercises: SerializeFrom<typeof loader>['exercises'];
};

export function ExercisesList({ exercises }: Props) {
  return (
    <ul>
      {exercises.map((exercise) => (
        <li key={exercise.id}>
          <Link to={`${exercise.id}`}>
            {exercise.name}- {exercise.unilateral}
          </Link>
        </li>
      ))}
    </ul>
  );
}
