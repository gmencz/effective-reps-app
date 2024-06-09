import { Session, createCookieSessionStorage, redirect } from '@remix-run/node';
import { env } from './env.server';

type SessionData = {
  userId: string;
};

export type SessionFlashData = {
  error: string;
  success: string;
};

export type TypedSession = Session<SessionData, SessionFlashData>;

const ONE_YEAR_IN_SECONDS = 31_536_000;

export const sessionStorage = createCookieSessionStorage<
  SessionData,
  SessionFlashData
>({
  cookie: {
    name: '__session',
    httpOnly: true,
    maxAge: ONE_YEAR_IN_SECONDS,
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

export async function requireUser(request: Request, redirectUrl = '/login') {
  const session = await getSession(request);
  const userId = session.get('userId');

  if (!userId) {
    const url = new URL(request.url);
    const { pathname } = url;
    throw redirect(`${redirectUrl}?to=${encodeURIComponent(pathname)}`);
  }

  return { userId, session };
}

export const commitSession = sessionStorage.commitSession;
