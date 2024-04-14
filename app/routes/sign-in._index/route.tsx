import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  redirect,
} from '@remix-run/node';
import { getSession, sessionStorage } from '~/shared/sessions.server';
import { checkCredentials } from './check-credentials.server';

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request);
  if (session.get('userId')) {
    throw redirect('/');
  }

  return null;
}

export async function action({ request }: ActionFunctionArgs) {
  const session = await getSession(request);
  if (session.get('userId')) {
    throw redirect('/');
  }

  const formData = await request.formData();
  const email = formData.get('email');
  const password = formData.get('password');

  if (typeof email !== 'string') {
    session.flash('error', 'Email is required');
    return redirect('/sign-in', {
      headers: {
        'Set-Cookie': await sessionStorage.commitSession(session),
      },
    });
  }

  if (typeof password !== 'string') {
    session.flash('error', 'Password is required');
    return redirect('/sign-in', {
      headers: {
        'Set-Cookie': await sessionStorage.commitSession(session),
      },
    });
  }

  const user = await checkCredentials(email, password);
  if (user) {
    session.set('userId', user.id);
    return redirect('/', {
      headers: {
        'Set-Cookie': await sessionStorage.commitSession(session),
      },
    });
  }

  session.flash('error', 'Invalid email or password');
  return redirect('/sign-in', {
    headers: {
      'Set-Cookie': await sessionStorage.commitSession(session),
    },
  });
}

export default function SignIn() {
  return (
    <>
      <form method="post" action="/sign-in?index">
        <label htmlFor="email">Email</label>
        <input type="email" id="email" name="email" />
        <label htmlFor="password">Password</label>
        <input type="password" id="password" name="password" />
        <button type="submit">Sign in</button>
      </form>
    </>
  );
}
