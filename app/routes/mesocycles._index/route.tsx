import { json, redirect, useLoaderData } from '@remix-run/react';
import { CreateMesocycleForm } from './create-mesocycle-form';
import { createMesocycle } from './create-mesocycle.server';
import { requireUserId, sessionStorage } from '~/utils/sessions.server';
import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
import { getMesocycles } from './get-mesocycles.server';
import { MesocyclesList } from './mesocycles-list';

export async function loader({ request }: LoaderFunctionArgs) {
  const { userId } = await requireUserId(request);
  const mesocycles = await getMesocycles(userId);
  return json({ mesocycles });
}

export async function action({ request }: ActionFunctionArgs) {
  const { session, userId } = await requireUserId(request);
  const formData = await request.formData();
  const mesocycleName = formData.get('mesocycleName');
  if (typeof mesocycleName !== 'string') {
    session.flash('error', 'Mesocycle name is required');
    return redirect('/mesocycles', {
      headers: {
        'Set-Cookie': await sessionStorage.commitSession(session),
      },
    });
  }

  try {
    await createMesocycle(userId, { name: mesocycleName });
  } catch (error) {
    console.error('createMesocycle() had an unexpected error', error);
    session.flash('error', 'Something went wrong creating the mesocycle');
    return redirect('/mesocycles', {
      headers: {
        'Set-Cookie': await sessionStorage.commitSession(session),
      },
    });
  }

  return redirect('/mesocycles', {
    headers: {
      'Set-Cookie': await sessionStorage.commitSession(session),
    },
  });
}

export default function Mesocycles() {
  const { mesocycles } = useLoaderData<typeof loader>();

  return (
    <>
      <h1>Mesocycles</h1>
      <CreateMesocycleForm />
      <MesocyclesList mesocycles={mesocycles} />
    </>
  );
}
