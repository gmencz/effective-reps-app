import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json,
  redirect,
} from '@remix-run/node';
import { requireUserId, sessionStorage } from '~/utils/sessions.server';
import { getMesocycle } from './get-mesocycle.server';
import { Params, useLoaderData } from '@remix-run/react';
import { getExercisesForSelect } from './get-exercises-for-select.server';
import { MesocycleDaysList } from './mesocycle-days-list';
import { CreateMesocycleDayForm } from './create-mesocycle-day-form';
import { addExerciseToMesocycleDay } from './add-exercise-to-mesocycle-day.server';
import { createMesocycleDay } from './create-mesocycle-day.server';

function getIdFromParams(params: Params<string>) {
  const { id } = params;
  if (!id) {
    throw redirect('/mesocycles');
  }

  const idNumber = Number(id);
  if (Number.isNaN(idNumber)) {
    throw redirect('/mesocycles');
  }

  return idNumber;
}

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { userId } = await requireUserId(request);
  const id = getIdFromParams(params);
  const mesocycle = await getMesocycle(id, userId);
  if (!mesocycle) {
    return redirect('/mesocycles');
  }

  const exercisesForSelect = await getExercisesForSelect(userId);
  return json({ mesocycle, exercisesForSelect });
}

export enum ActionIntent {
  CreateMesocycleDay = 'createMesocycleDay',
  AddExerciseToMesocycleDay = 'addExerciseToMesocycleDay',
}

export async function action({ request, params }: ActionFunctionArgs) {
  const { userId, session } = await requireUserId(request);
  const id = getIdFromParams(params);
  const formData = await request.formData();
  const intent = formData.get('_intent');

  switch (intent) {
    case ActionIntent.CreateMesocycleDay: {
      const mesocycleDayName = formData.get('mesocycleDayName');
      if (typeof mesocycleDayName !== 'string') {
        session.flash('error', 'Mesocycle day name is required');
        return redirect(`/mesocycles/${id}`, {
          headers: {
            'Set-Cookie': await sessionStorage.commitSession(session),
          },
        });
      }

      try {
        await createMesocycleDay(userId, {
          name: mesocycleDayName,
          mesocycleId: id,
        });
      } catch (error) {
        console.error('createMesocycleDay() had an unexpected error', error);
        session.flash(
          'error',
          'Something went wrong creating the mesocycle day',
        );
        return redirect(`/mesocycles/${id}`, {
          headers: {
            'Set-Cookie': await sessionStorage.commitSession(session),
          },
        });
      }

      return redirect(`/mesocycles/${id}`, {
        headers: {
          'Set-Cookie': await sessionStorage.commitSession(session),
        },
      });
    }

    case ActionIntent.AddExerciseToMesocycleDay: {
      const mesocycleDayId = Number(formData.get('mesocycleDayId'));
      if (!mesocycleDayId || Number.isNaN(mesocycleDayId)) {
        session.flash('error', 'Mesocycle day id is invalid');
        return redirect(`/mesocycles/${id}`, {
          headers: {
            'Set-Cookie': await sessionStorage.commitSession(session),
          },
        });
      }

      const exerciseId = Number(formData.get('exerciseId'));
      if (!exerciseId || Number.isNaN(exerciseId)) {
        session.flash('error', 'Exercise id is invalid');
        return redirect(`/mesocycles/${id}`, {
          headers: {
            'Set-Cookie': await sessionStorage.commitSession(session),
          },
        });
      }

      try {
        await addExerciseToMesocycleDay(userId, {
          id: exerciseId,
          mesocycleDayId,
        });
      } catch (error) {
        console.error(
          'addExerciseToMesocycleDay() had an unexpected error',
          error,
        );
        session.flash('error', 'Something went wrong adding the exercise');
        return redirect(`/mesocycles/${id}`, {
          headers: {
            'Set-Cookie': await sessionStorage.commitSession(session),
          },
        });
      }

      return redirect(`/mesocycles/${id}`, {
        headers: {
          'Set-Cookie': await sessionStorage.commitSession(session),
        },
      });
    }

    default:
      session.flash('error', 'Invalid or missing action intent');
      return redirect(`/mesocycles/${id}`, {
        headers: {
          'Set-Cookie': await sessionStorage.commitSession(session),
        },
      });
  }
}

export default function Mesocycle() {
  const { mesocycle } = useLoaderData<typeof loader>();

  return (
    <>
      <h1>{mesocycle.name}</h1>
      <CreateMesocycleDayForm />
      <MesocycleDaysList />
    </>
  );
}
