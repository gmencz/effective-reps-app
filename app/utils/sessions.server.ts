import { Session, createCookieSessionStorage, redirect } from '@remix-run/node';
import { env } from '~/config/env';
import { SelectExercise } from '~/db/schema/exercises';
import { SelectMesocycle } from '~/db/schema/mesocycles';
import { SelectMesocycleDay } from '~/db/schema/mesocycles-days';
import { SelectMesocycleDayExercise } from '~/db/schema/mesocycles-days-exercises';
import { SelectMesocycleDayExerciseSet } from '~/db/schema/mesocycles-days-exercises-sets';

type SessionData = {
  userId: number;
  mesocycles: (Omit<SelectMesocycle, 'userId'> & {
    days: (Omit<SelectMesocycleDay, 'mesocycleId'> & {
      exercises: (Omit<SelectMesocycleDayExercise, 'mesocycleDayId'> & {
        name: string;
        sets: Omit<SelectMesocycleDayExerciseSet, 'mesocycleDayExerciseId'>[];
      })[];
    })[];
  })[];
  exercises: Omit<SelectExercise, 'userId'>[];
};

type SessionFlashData = {
  error: string;
};

export type TypedSession = Session<SessionData, SessionFlashData>;

const TEN_YEARS_IN_SECONDS = 315_532_800;

export const sessionStorage = createCookieSessionStorage<
  SessionData,
  SessionFlashData
>({
  cookie: {
    name: '__session',
    httpOnly: true,
    maxAge: TEN_YEARS_IN_SECONDS,
    path: '/',
    sameSite: 'strict',
    secrets: [env.SESSION_SECRET_1],
    secure: env.NODE_ENV === 'production',
  },
});

export async function getSession(request: Request) {
  const session = await sessionStorage.getSession(
    request.headers.get('Cookie'),
  );

  return session;
}

export async function requireUserId(
  request: Request,
  redirectUrl = '/sign-in',
) {
  const session = await getSession(request);
  const userId = session.get('userId');

  if (!userId) {
    const url = new URL(request.url);
    const { pathname } = url;
    throw redirect(`${redirectUrl}?to=${encodeURIComponent(pathname)}`);
  }

  return userId;
}
