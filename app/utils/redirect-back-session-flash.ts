import { redirectBack } from 'remix-utils/redirect-back';
import { SessionFlashData, commitSession, getSession } from './sessions.server';

export default async function redirectBackSessionFlash(
  request: Request,
  {
    fallback,
    sessionFlashKey,
    sessionFlashValue,
  }: {
    sessionFlashKey: keyof SessionFlashData;
    sessionFlashValue: string;
    fallback: string;
  },
) {
  const session = await getSession(request);

  session.flash(sessionFlashKey, sessionFlashValue);

  return redirectBack(request, {
    fallback,
    headers: {
      'Set-Cookie': await commitSession(session),
    },
  });
}
