import {
  ActionFunctionArgs,
  json,
  redirect,
  type LoaderFunctionArgs,
  type MetaFunction,
} from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { getUserMesocycles } from './get-user-mesocycles.server';
import { CreateMesocycleForm } from './create-mesocycle-form';
import { UserMesocyclesList } from './user-mesocycles-list';
import { createMesocycle } from './create-mesocycle.server';
import { getSession, sessionStorage } from '~/utils/sessions.server';

export const meta: MetaFunction = () => {
  return [
    { title: 'Training Log' },
    { name: 'description', content: 'Welcome to Training Log!' },
  ];
};

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
    return redirect('/', {
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
    return redirect('/', {
      headers: {
        'Set-Cookie': await sessionStorage.commitSession(session),
      },
    });
  }

  return redirect('/', {
    headers: {
      'Set-Cookie': await sessionStorage.commitSession(session),
    },
  });
}

export default function Index() {
  const { userMesocycles } = useLoaderData<typeof loader>();

  return (
    <>
      <CreateMesocycleForm />
      <UserMesocyclesList userMesocycles={userMesocycles} />
    </>
  );
}
