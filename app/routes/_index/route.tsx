import { LoaderFunctionArgs, type MetaFunction } from '@remix-run/node';
import { Link } from '@remix-run/react';
import { requireUser } from '~/shared/sessions.server';

export const meta: MetaFunction = () => {
  return [
    { title: 'Training Log' },
    { name: 'description', content: 'Welcome to Training Log!' },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const { userId } = await requireUser(request);
  return { userId };
}

const navigation = [
  { label: 'Mesocycles', to: '/mesocycles' },
  { label: 'Exercises', to: '/exercises' },
];

export default function Index() {
  return (
    <>
      <h1>Training Log</h1>

      <ul>
        {navigation.map((link) => (
          <li key={link.to}>
            <Link to={link.to}>{link.label}</Link>
          </li>
        ))}
      </ul>
    </>
  );
}
