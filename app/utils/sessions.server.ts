import { createCookieSessionStorage, redirect } from '@remix-run/node';
import { env } from '~/config/env';

type SessionData = {
  userId: number;
};

type SessionFlashData = {
  error: string;
};

const ONE_YEAR = 60 * 60 * 24 * 365;

export const sessionStorage = createCookieSessionStorage<
  SessionData,
  SessionFlashData
>({
  cookie: {
    name: '__session',
    httpOnly: true,
    maxAge: ONE_YEAR,
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

export async function getUserId(request: Request) {
  const session = await sessionStorage.getSession(
    request.headers.get('Cookie'),
  );

  return session.get('userId');
}

export async function requireUserId(
  request: Request,
  redirectUrl = '/sign-in',
) {
  const userId = await getUserId(request);

  if (!userId) {
    const url = new URL(request.url);
    const { pathname } = url;
    throw redirect(`${redirectUrl}?to=${encodeURIComponent(pathname)}`);
  }

  return userId;
}
