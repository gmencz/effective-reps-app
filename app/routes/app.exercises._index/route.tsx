import { ActionFunctionArgs, json, redirect } from '@remix-run/node';
import { requireUser } from '~/utils/sessions.server';
import { getExercises } from './get-exercises.server';

export async function action({ request, params }: ActionFunctionArgs) {
  const { userId } = await requireUser(request);
  const { templateId } = params;
  if (!templateId) {
    throw redirect('/app/templates');
  }

  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');
  const exercises = await getExercises({ userId, query: query || undefined });

  if (!exercises) {
    throw redirect('/app/templates');
  }

  return json({ exercises });
}

export default function Exercise() {}
