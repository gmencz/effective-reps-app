import { Link, useLoaderData } from '@remix-run/react';
import { loader } from './route';
import { CreateTrainingSessionForm } from './create-training-session-form';

export function TrainingSessionsList() {
  const { day } = useLoaderData<typeof loader>();

  return (
    <>
      <h2>Training sessions:</h2>
      <ol>
        {day.trainingSessions.map((trainingSession) => (
          <li key={trainingSession.id}>
            <Link to={`/training-sessions/${trainingSession.id}`}>
              {trainingSession.createdAt}
            </Link>
          </li>
        ))}
      </ol>
      <CreateTrainingSessionForm />
    </>
  );
}
