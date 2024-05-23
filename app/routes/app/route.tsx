import { Outlet } from '@remix-run/react';

export default function AppLayout() {
  return (
    <div className="p-8 w-full max-w-lg mx-auto">
      <Outlet />
    </div>
  );
}
