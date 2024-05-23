import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json,
  redirect,
} from '@remix-run/node';
import { getSession, sessionStorage } from '~/utils/sessions.server';
import { z } from 'zod';
import { parseWithZod } from '@conform-to/zod';
import { getUser } from './get-user';
import { Form, useActionData } from '@remix-run/react';
import { useForm } from '@conform-to/react';
import { TbLogin2 } from 'react-icons/tb';
import { Input } from '~/components/input';
import { StyledLink } from '~/components/styled-link';

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request);
  if (session.get('userId')) {
    throw redirect('/app');
  }

  return null;
}

const schema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export async function action({ request }: ActionFunctionArgs) {
  const session = await getSession(request);
  if (session.get('userId')) {
    throw redirect('/app');
  }

  const formData = await request.formData();
  const submission = parseWithZod(formData, { schema });

  if (submission.status !== 'success') {
    return json(submission.reply());
  }

  const { email, password } = submission.value;
  const user = await getUser(email, password);
  if (user) {
    session.set('userId', user.id);
    return redirect('/app', {
      headers: {
        'Set-Cookie': await sessionStorage.commitSession(session),
      },
    });
  }

  return json(
    submission.reply({
      formErrors: ['Invalid email or password'],
    }),
  );
}

export default function Login() {
  const lastResult = useActionData<typeof action>();
  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema });
    },
    shouldValidate: 'onBlur',
  });

  return (
    <div className="p-8 w-full max-w-md mx-auto h-full flex flex-col sm:justify-center">
      <h1 className="text-white font-semibold text-3xl">Log in</h1>

      <Form method="post" id={form.id} onSubmit={form.onSubmit}>
        <Input
          id={fields.email.id}
          name={fields.email.name}
          label="Email"
          type="email"
          errors={fields.email.errors}
          errorId={fields.email.errorId}
          placeholder="Email"
          className="w-full mt-6"
        />

        <Input
          id={fields.password.id}
          name={fields.password.name}
          label="Password"
          type="password"
          errors={fields.password.errors}
          errorId={fields.password.errorId}
          className="mt-2 w-full"
          placeholder="Password"
        />

        <button className="mt-4 w-full flex items-center justify-center gap-x-3 bg-amber-600 text-white hover:bg-amber-500 rounded-xl font-semibold px-4 py-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600">
          <TbLogin2 className="-ml-3 h-7 w-7" />
          <span>Log in</span>
        </button>
      </Form>

      <div className="mt-6">
        <StyledLink to="/forgot-password">Forgot password</StyledLink>
      </div>

      {form.errors ? <p className="mt-6 text-red-600">{form.errors}</p> : null}
    </div>
  );
}
