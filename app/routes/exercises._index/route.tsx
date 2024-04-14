import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
import { json, redirect, useLoaderData } from '@remix-run/react';
import { requireUser, sessionStorage } from '~/shared/sessions.server';
import { getExercises } from './get-exercises.server';
import { createExercise } from './create-exercise.server';
import { CreateExerciseForm } from './create-exercise-form';
import { ExercisesList } from './exercises-list';

export async function loader({ request }: LoaderFunctionArgs) {
  const { userId } = await requireUser(request);
  const exercises = await getExercises(userId);
  return json({ exercises });
}

export async function action({ request }: ActionFunctionArgs) {
  const { userId, session } = await requireUser(request);
  const formData = await request.formData();
  const exerciseName = formData.get('exerciseName');
  if (typeof exerciseName !== 'string') {
    session.flash('error', 'Exercise name is required');
    return redirect('/exercises', {
      headers: {
        'Set-Cookie': await sessionStorage.commitSession(session),
      },
    });
  }

  try {
    await createExercise(userId, { name: exerciseName });
  } catch (error) {
    console.error('createExercise() had an unexpected error', error);
    session.flash('error', 'Something went wrong creating the exercise');
    return redirect('/exercises', {
      headers: {
        'Set-Cookie': await sessionStorage.commitSession(session),
      },
    });
  }

  return redirect('/exercises', {
    headers: {
      'Set-Cookie': await sessionStorage.commitSession(session),
    },
  });
}

export default function Exercises() {
  const { exercises } = useLoaderData<typeof loader>();

  return (
    <>
      <h1>Exercises</h1>
      <CreateExerciseForm />
      <ExercisesList exercises={exercises} />
    </>
  );
}
