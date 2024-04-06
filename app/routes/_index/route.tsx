import { type MetaFunction } from '@remix-run/node';
import { Link } from '@remix-run/react';

export const meta: MetaFunction = () => {
  return [
    { title: 'Training Log' },
    { name: 'description', content: 'Welcome to Training Log!' },
  ];
};

const navigation = [
  { label: 'Mesocycles', to: '/mesocycles' },
  { label: 'Exercises', to: '/exercises' },
  { label: 'History', to: '/history' },
  { label: 'Analytics', to: '/analytics' },
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
