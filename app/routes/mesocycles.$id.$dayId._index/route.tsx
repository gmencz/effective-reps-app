import { ActionFunctionArgs, LoaderFunctionArgs, json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { redirect } from 'react-router';
import { requireUserId, sessionStorage } from '~/utils/sessions.server';
import { getDay } from './get-day';
import { getExercisesForSelect } from './get-exercises-for-select.server';
import { AddExerciseForm } from './add-exercise-form';
import { parseNumberParam } from '~/utils/requests.server';
import { addExercise } from './add-exercise.server';
import { ExercisesList } from './exercises-list';
import { StartSessionForm } from './start-session-form';
import { addSet } from './add-set.server';

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { userId } = await requireUserId(request);
  const id = parseNumberParam(params.dayId);
  if (!id) {
    throw redirect('/mesocycles');
  }

  const mesocycleId = parseNumberParam(params.id);
  if (!mesocycleId) {
    throw redirect('/mesocycles');
  }

  const day = await getDay(id, userId);
  if (!day) {
    throw redirect('/mesocycles');
  }

  const exercisesForSelect = await getExercisesForSelect(userId);

  return json({ day, mesocycleId, exercisesForSelect });
}

export enum ActionIntent {
  StartSession = 'startSession',
  AddExercise = 'addExercise',
  AddSet = 'addSet',
}

export async function action({ request, params }: ActionFunctionArgs) {
  const { userId, session } = await requireUserId(request);
  const id = parseNumberParam(params.dayId);
  if (!id) {
    throw redirect('/mesocycles');
  }

  const mesocycleId = parseNumberParam(params.id);
  if (!mesocycleId) {
    throw redirect('/mesocycles');
  }

  const formData = await request.formData();
  const intent = formData.get('_intent');

  switch (intent) {
    case ActionIntent.AddExercise: {
      const exerciseId = Number(formData.get('exerciseId'));
      if (Number.isNaN(exerciseId)) {
        session.flash('error', 'Exercise id is invalid');
        return redirect(`/mesocycles/${mesocycleId}/${id}`, {
          headers: {
            'Set-Cookie': await sessionStorage.commitSession(session),
          },
        });
      }

      try {
        await addExercise(userId, {
          id: exerciseId,
          dayId: id,
        });
      } catch (error) {
        console.error('addExercise() had an unexpected error', error);
        session.flash('error', 'Something went wrong adding the exercise');
        return redirect(`/mesocycles/${mesocycleId}/${id}`, {
          headers: {
            'Set-Cookie': await sessionStorage.commitSession(session),
          },
        });
      }

      return redirect(`/mesocycles/${mesocycleId}/${id}`, {
        headers: {
          'Set-Cookie': await sessionStorage.commitSession(session),
        },
      });
    }

    case ActionIntent.AddSet: {
      const exerciseId = Number(formData.get('exerciseId'));
      const repRange = formData.get('repRange');
      const weight = Number(formData.get('weight'));
      const rir = Number(formData.get('rir'));
      const restSeconds = Number(formData.get('restSeconds'));
      const notes = formData.get('notes');

      if (Number.isNaN(exerciseId)) {
        session.flash('error', 'Exercise id is invalid');
        return redirect(`/mesocycles/${mesocycleId}/${id}`, {
          headers: {
            'Set-Cookie': await sessionStorage.commitSession(session),
          },
        });
      }

      if (typeof repRange !== 'string') {
        session.flash('error', 'Rep range is required');
        return redirect(`/mesocycles/${mesocycleId}/${id}`, {
          headers: {
            'Set-Cookie': await sessionStorage.commitSession(session),
          },
        });
      }

      if (Number.isNaN(rir)) {
        session.flash('error', 'RIR is invalid');
        return redirect(`/mesocycles/${mesocycleId}/${id}`, {
          headers: {
            'Set-Cookie': await sessionStorage.commitSession(session),
          },
        });
      }

      try {
        await addSet(userId, id, exerciseId, {
          notes: notes as string | null,
          repRange: repRange,
          weight: Number.isNaN(weight) ? null : weight,
          restSeconds: Number.isNaN(restSeconds) ? null : restSeconds,
          rir: rir,
        });
      } catch (error) {
        console.error('addSet() had an unexpected error', error);
        session.flash('error', 'Something went wrong adding the set');
        return redirect(`/mesocycles/${mesocycleId}/${id}`, {
          headers: {
            'Set-Cookie': await sessionStorage.commitSession(session),
          },
        });
      }

      return redirect(`/mesocycles/${mesocycleId}/${id}`, {
        headers: {
          'Set-Cookie': await sessionStorage.commitSession(session),
        },
      });
    }

    case ActionIntent.StartSession: {
      // TODO

      return redirect(`/mesocycles/${mesocycleId}/${id}`, {
        headers: {
          'Set-Cookie': await sessionStorage.commitSession(session),
        },
      });
    }

    default:
      session.flash('error', 'Invalid or missing action intent');
      return redirect(`/mesocycles/${mesocycleId}/${id}`, {
        headers: {
          'Set-Cookie': await sessionStorage.commitSession(session),
        },
      });
  }
}

export default function MesocycleDay() {
  const { day } = useLoaderData<typeof loader>();

  return (
    <>
      <h1>{day.name}</h1>
      <p>{day.notes}</p>

      <StartSessionForm />
      <AddExerciseForm />
      <ExercisesList />
    </>
  );
}
