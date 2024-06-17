import { ActionFunctionArgs } from '@remix-run/node';
import { prisma } from '~/utils/prisma.server';
import redirectBackSessionFlash from '~/utils/redirect-back-session-flash';

import { requireUser } from '~/utils/sessions.server';

export async function action({ request, params }: ActionFunctionArgs) {
  const { userId } = await requireUser(request);

  const exerciseId = params.exerciseId;

  if (!exerciseId) {
    return redirectBackSessionFlash(request, {
      fallback: '/app/exercises',
      sessionFlashKey: 'error',
      sessionFlashValue: `The exercise id couldnt be found in the request`,
    });
  }

  const deletedExercise = await prisma.exercise.delete({
    where: {
      id_userId: { id: exerciseId, userId },
    },
  });

  if (!deletedExercise) {
    return redirectBackSessionFlash(request, {
      fallback: '/app/exercises',
      sessionFlashKey: 'error',
      sessionFlashValue: `There was an unexpected problem`,
    });
  }

  return redirectBackSessionFlash(request, {
    fallback: '/app/exercises',
    sessionFlashKey: 'success',
    sessionFlashValue: `The exercise ${deletedExercise.name} was deleted`,
  });
}
