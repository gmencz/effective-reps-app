import { SerializeFrom } from '@remix-run/node';
import { loader } from './route';
import { Link } from '@remix-run/react';

type Props = {
  userExercises: SerializeFrom<typeof loader>['userExercises'];
};

export function UserExercisesList({ userExercises }: Props) {
  return (
    <ul>
      {userExercises.map((exercise) => (
        <li key={exercise.id}>
          <Link to={`/exercises/${exercise.id}`}>
            {exercise.name} - {exercise.createdAt}
          </Link>
        </li>
      ))}
    </ul>
  );
}
