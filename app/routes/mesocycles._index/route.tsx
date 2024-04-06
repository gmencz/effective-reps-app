import { json, redirect, useLoaderData } from '@remix-run/react';
import { CreateMesocycleForm } from './create-mesocycle-form';
import { UserMesocyclesList } from './user-mesocycles-list';
import { createMesocycle } from './create-mesocycle.server';
import { getSession, sessionStorage } from '~/utils/sessions.server';
import { getUserMesocycles } from './get-user-mesocycles.server';
import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request);
  const userMesocycles = await getUserMesocycles(session);
  return json({ userMesocycles });
}

export async function action({ request }: ActionFunctionArgs) {
  const session = await getSession(request);
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
    await createMesocycle(session, { name: mesocycleName });
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
  const { userMesocycles } = useLoaderData<typeof loader>();

  return (
    <>
      <h1>Mesocycles</h1>
      <CreateMesocycleForm />
      <UserMesocyclesList userMesocycles={userMesocycles} />
    </>
  );
}
