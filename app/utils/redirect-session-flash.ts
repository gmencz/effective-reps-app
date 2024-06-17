import { redirect } from '@remix-run/node';
import { SessionFlashData, commitSession, getSession } from './sessions.server';

export default async function redirectSessionFlash(
  request: Request,
  {
    url,
    sessionFlashKey,
    sessionFlashValue,
  }: {
    url: string;
    sessionFlashKey: keyof SessionFlashData;
    sessionFlashValue: string;
  },
) {
  const session = await getSession(request);

  session.flash(sessionFlashKey, sessionFlashValue);

  return redirect(url, {
    headers: {
      'Set-Cookie': await commitSession(session),
    },
  });
}
