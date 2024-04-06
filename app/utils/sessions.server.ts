import { createCookieSessionStorage, redirect } from '@remix-run/node';
import { env } from '~/config/env';
import { SelectMesocycle } from '~/db/schema/mesocycles';

type SessionData = {
  userId: number;
  mesocycles: Pick<SelectMesocycle, 'id' | 'name' | 'createdAt'>[];
};

type SessionFlashData = {
  error: string;
};

const TEN_YEARS = 60 * 60 * 24 * 365 * 10;

export const sessionStorage = createCookieSessionStorage<
  SessionData,
  SessionFlashData
>({
  cookie: {
    name: '__session',
    httpOnly: true,
    maxAge: TEN_YEARS,
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
