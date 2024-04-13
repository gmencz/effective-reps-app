import { LoaderFunctionArgs, json } from '@remix-run/node';
import {
  Link,
  Outlet,
  Params,
  redirect,
  useLoaderData,
} from '@remix-run/react';
import { requireUserId } from '~/utils/sessions.server';
import { getMesocycle } from './get-mesocycle.server';

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

  return json({ mesocycle });
}

export default function MesocycleLayout() {
  const { mesocycle } = useLoaderData<typeof loader>();

  return (
    <>
      <h1>
        <Link to={`/mesocycles/${mesocycle.id}`}>{mesocycle.name}</Link>
      </h1>
      <Outlet />
    </>
  );
}
