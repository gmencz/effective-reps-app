import { BiFileBlank } from 'react-icons/bi';
import { FaPlay } from 'react-icons/fa';
import { Link, useLoaderData } from '@remix-run/react';
import { StyledLink } from '~/components/styled-link';
import {
  AnimatedDialog,
  AnimatedDialogProps,
} from '~/components/animated-dialog';
import { DialogTitle } from '@headlessui/react';
import { loader } from './route';
import clsx from 'clsx';

export function StartWorkoutDialog({ isOpen, close }: AnimatedDialogProps) {
  const { recentTemplates } = useLoaderData<typeof loader>();

  return (
    <AnimatedDialog isOpen={isOpen} close={close}>
      <div className="text-center">
        <DialogTitle as="h3" className="text-base font-semibold text-white">
          Start Workout
        </DialogTitle>
      </div>
      <div className="mt-6">
        <p className="text-white mb-3">Quick Start</p>
        <Link
          to="/app/workout"
          className="flex items-center justify-center gap-x-3 bg-amber-600 text-white hover:bg-amber-500 rounded-xl font-semibold px-4 py-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600"
        >
          <BiFileBlank className="-ml-3 h-6 w-6 " />
          <span>Empty Workout</span>
        </Link>

        <p className="text-white mt-6 mb-3">Recent Templates</p>
        {recentTemplates.length > 0 ? (
          <ol className="flex flex-col mb-6 divide-y divide-zinc-600 bg-zinc-700 rounded-xl">
            {recentTemplates.map((template, index) => (
              <li key={template.id}>
                <Link
                  className={clsx(
                    'flex items-center gap-x-3 bg-zinc-700 hover:bg-zinc-600 px-4 py-3 text-white font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-white',
                    index === 0
                      ? 'rounded-t-xl'
                      : index === recentTemplates.length - 1
                        ? 'rounded-b-xl'
                        : '',
                  )}
                  to={`/app/workout?templateId=${template.id}`}
                >
                  <FaPlay className="w-4 h-4" />
                  <span>{template.name}</span>
                </Link>
              </li>
            ))}
          </ol>
        ) : null}

        <StyledLink to="/app/templates">All Templates</StyledLink>
      </div>
    </AnimatedDialog>
  );
}
