import { ActionFunctionArgs, redirect } from '@remix-run/node';
import { requireUserId, sessionStorage } from '~/utils/sessions.server';
import { Params } from '@remix-run/react';
import { DaysList } from './days-list';
import { addDay } from './add-day.server';
import { AddDayForm } from './add-day-form';

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

export enum ActionIntent {
  AddDay = 'addDay',
}

export async function action({ request, params }: ActionFunctionArgs) {
  const { userId, session } = await requireUserId(request);
  const id = getIdFromParams(params);
  const formData = await request.formData();
  const intent = formData.get('_intent');

  switch (intent) {
    case ActionIntent.AddDay: {
      const dayName = formData.get('dayName');
      if (typeof dayName !== 'string') {
        session.flash('error', 'Day name is required');
        return redirect(`/mesocycles/${id}`, {
          headers: {
            'Set-Cookie': await sessionStorage.commitSession(session),
          },
        });
      }

      try {
        await addDay(userId, {
          name: dayName,
          mesocycleId: id,
        });
      } catch (error) {
        console.error('addDay() had an unexpected error', error);
        session.flash('error', 'Something went wrong adding the day');
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
  return (
    <>
      <AddDayForm />
      <DaysList />
    </>
  );
}
