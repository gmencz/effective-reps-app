import { NavLink } from '@remix-run/react';
import { IconType } from 'react-icons';
import { FaUser } from 'react-icons/fa';
import { TiChartArea } from 'react-icons/ti';
import { FaDumbbell } from 'react-icons/fa6';

interface NavigationItem {
  to: string;
  label: string;
  icon: IconType;
  iconClassName: string;
}

const navigation: NavigationItem[] = [
  {
    to: '/app',
    label: 'Workouts',
    icon: FaDumbbell,
    iconClassName: 'h-9 w-9',
  },
  {
    to: '/app/charts',
    label: 'Charts',
    icon: TiChartArea,
    iconClassName: 'h-11 w-11',
  },
  {
    to: '/app/profile',
    label: 'Profile',
    icon: FaUser,
    iconClassName: 'h-9 w-9',
  },
];

export function Navigation() {
  return (
    <ul className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-xs flex justify-between items-center p-6">
      {navigation.map((item) => (
        <li key={item.to}>
          <NavLink
            className={({ isActive }) =>
              isActive ? 'text-white' : 'text-zinc-700'
            }
            to={item.to}
            end
          >
            <span className="sr-only">{item.label}</span>
            <item.icon className={item.iconClassName} />
          </NavLink>
        </li>
      ))}
    </ul>
  );
}
