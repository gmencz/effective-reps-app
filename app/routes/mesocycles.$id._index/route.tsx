import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json,
  redirect,
} from '@remix-run/node';
import { getSession, sessionStorage } from '~/utils/sessions.server';
import { getUserMesocycle } from './get-user-mesocycle.server';
import { Params, useLoaderData } from '@remix-run/react';
import { getUserExercisesForSelect } from './get-user-exercises-for-select.server';
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
  const id = getIdFromParams(params);
  const session = await getSession(request);
  const userMesocycle = await getUserMesocycle(id, session);
  if (!userMesocycle) {
    return redirect('/mesocycles');
  }

  const userExercisesForSelect = await getUserExercisesForSelect(session);
  return json({ userMesocycle, userExercisesForSelect });
}

export enum ActionIntent {
  CreateMesocycleDay = 'createMesocycleDay',
  AddExerciseToMesocycleDay = 'addExerciseToMesocycleDay',
}

export async function action({ request, params }: ActionFunctionArgs) {
  const id = getIdFromParams(params);
  const session = await getSession(request);
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

      await createMesocycleDay(session, {
        name: mesocycleDayName,
        mesocycleId: id,
      });

      return redirect(`/mesocycles/${id}`, {
        headers: {
          'Set-Cookie': await sessionStorage.commitSession(session),
        },
      });
    }

    case ActionIntent.AddExerciseToMesocycleDay: {
      await addExerciseToMesocycleDay(session);
      break;
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
  const { userMesocycle } = useLoaderData<typeof loader>();

  return (
    <>
      <h1>{userMesocycle.name}</h1>

      <CreateMesocycleDayForm />
      <MesocycleDaysList />
    </>
  );
}
