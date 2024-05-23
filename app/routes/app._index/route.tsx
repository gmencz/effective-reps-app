import { LoaderFunctionArgs } from '@remix-run/node';
import { requireUser } from '~/utils/sessions.server';
import { useLoaderData } from '@remix-run/react';
import { getWorkouts } from './get-workouts.server';
import { FaPlus } from 'react-icons/fa';
import { getRecentPRs } from './get-recent-prs.server';
import { StartWorkoutDialog } from './start-workout-dialog';
import { useState } from 'react';
import { getRecentTemplates } from './get-recent-templates.server';
import { Navigation } from '~/components/navigation';

export async function loader({ request }: LoaderFunctionArgs) {
  const { userId } = await requireUser(request);
  const [workouts, recentPRs, recentTemplates] = await Promise.all([
    getWorkouts({ userId }),
    getRecentPRs({ userId }),
    getRecentTemplates({ userId }),
  ]);

  return { workouts, recentPRs, recentTemplates };
}

export default function Index() {
  const { workouts, recentPRs } = useLoaderData<typeof loader>();
  const [isStartWorkoutDialogOpen, setIsStartWorkoutDialogOpen] =
    useState(false);

  return (
    <>
      <button
        onClick={() => {
          setIsStartWorkoutDialogOpen(true);
        }}
        className="flex items-center justify-center gap-x-3 w-full bg-amber-600 text-white hover:bg-amber-500 rounded-xl font-semibold px-4 py-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600"
      >
        <FaPlus className="-ml-3 h-4 w-4" />
        <span>Start Workout</span>
      </button>

      <StartWorkoutDialog
        isOpen={isStartWorkoutDialogOpen}
        close={() => {
          setIsStartWorkoutDialogOpen(false);
        }}
      />

      <h2 className="mt-6 text-white text-xl font-semibold">Recent PRs</h2>
      <ol className="mt-2">
        <li>Technogym Hip Adduction: 100x6</li>
        <li>Hammer Strength Incline Press: 90x8</li>
        <li>Hammer Strength Pulldown: 50x7</li>
      </ol>

      <h2 className="mt-8 text-white text-xl font-semibold">Workouts</h2>

      <Navigation />
    </>
  );
}
