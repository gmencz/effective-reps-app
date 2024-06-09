import { commitSession, getSession } from './sessions.server';

export default async function loadSessionFlash(request: Request) {
  const session = await getSession(request);
  return {
    sessionFlash: {
      success: session.get('success') || null,
      error: session.get('error') || null,
    },
    headers: {
      // only necessary with cookieSessionStorage
      'Set-Cookie': await commitSession(session),
    },
  };
}
