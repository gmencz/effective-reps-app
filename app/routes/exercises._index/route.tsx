import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
import { json, redirect, useLoaderData } from '@remix-run/react';
import { getSession, sessionStorage } from '~/utils/sessions.server';
import { getUserExercises } from './get-user-exercises.server';
import { createExercise } from './create-exercise.server';
import { CreateExerciseForm } from './create-exercise-form';
import { UserExercisesList } from './user-exercises-list';

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request);
  const userExercises = await getUserExercises(session);
  return json({ userExercises });
}

export async function action({ request }: ActionFunctionArgs) {
  const session = await getSession(request);
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
    await createExercise(session, { name: exerciseName });
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
  const { userExercises } = useLoaderData<typeof loader>();

  return (
    <>
      <h1>Exercises</h1>
      <CreateExerciseForm />
      <UserExercisesList userExercises={userExercises} />
    </>
  );
}
