import {
  json,
  type LoaderFunctionArgs,
  type MetaFunction,
} from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { getUserMesocycles } from './get-user-mesocycles.server';
import { CreateMesocycleForm } from './create-mesocycle-form';
import { UserMesocyclesList } from './user-mesocycles-list';

export const meta: MetaFunction = () => {
  return [
    { title: 'Training Log' },
    { name: 'description', content: 'Welcome to Training Log!' },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const userMesocycles = await getUserMesocycles(request);
  return json({ userMesocycles });
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
