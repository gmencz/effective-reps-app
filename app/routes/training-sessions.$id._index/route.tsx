import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json,
  redirect,
} from '@remix-run/node';
import { requireUser } from '~/shared/sessions.server';
import { getTrainingSession } from './get-training-session.server';
import { useLoaderData } from '@remix-run/react';
import { parseNumberParam } from '~/shared/requests.server';
import { ExercisesList } from './exercises-list';
import { updateSet } from './update-set.server';

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { userId } = await requireUser(request);
  const id = parseNumberParam(params.id);
  if (!id) {
    throw redirect('/');
  }

  const trainingSession = await getTrainingSession(id, userId);
  if (!trainingSession) {
    throw redirect('/');
  }

  return json({ trainingSession });
}

export enum ActionIntent {
  UpdateSet = 'updateSet',
}

export async function action({ request, params }: ActionFunctionArgs) {
  const { userId, session } = await requireUser(request);
  const id = parseNumberParam(params.id);
  if (!id) {
    throw redirect('/');
  }

  const formData = await request.formData();
  const intent = formData.get('_intent');

  switch (intent) {
    case ActionIntent.UpdateSet: {
      const setId = Number(formData.get('setId'));
      if (Number.isNaN(setId)) {
        session.flash('error', 'Set id is invalid');
        return redirect(`/training-sessions/${id}`, {
          headers: {
            'Set-Cookie': await sessionStorage.commitSession(session),
          },
        });
      }

      const weight = formData.get('weight');
      const reps = formData.get('reps');
      const rir = formData.get('rir');
      const restSeconds = formData.get('restSeconds');
      const notes = formData.get('notes');

      try {
        await updateSet(setId, id, userId, {
          weight: weight ? Number(weight) : null,
          reps: reps ? Number(reps) : null,
          rir: rir ? Number(rir) : null,
          restSeconds: restSeconds ? Number(restSeconds) : null,
          notes: notes ? notes.toString() : null,
        });
      } catch (error) {
        console.error('updateSet() had an unexpected error', error);
        session.flash('error', 'Something went wrong saving the set changes');
        return redirect(`/training-sessions/${id}`, {
          headers: {
            'Set-Cookie': await sessionStorage.commitSession(session),
          },
        });
      }

      return redirect(`/training-sessions/${id}`);
    }

    default:
      session.flash('error', 'Invalid or missing action intent');
      return redirect(`/training-sessions/${id}`, {
        headers: {
          'Set-Cookie': await sessionStorage.commitSession(session),
        },
      });
  }
}

export default function TrainingSession() {
  const { trainingSession } = useLoaderData<typeof loader>();

  console.log({ trainingSession });

  return (
    <>
      <h1>{trainingSession.mesocycleDay.name}</h1>
      <p>
        <span>{trainingSession.mesocycleDay.notes}</span>
        <br />
        <span>{trainingSession.notes}</span>
      </p>

      <ExercisesList />
    </>
  );
}
