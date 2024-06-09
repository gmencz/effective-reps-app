import { DialogTitle } from '@headlessui/react';
import { SerializeFrom } from '@remix-run/node';
import {
  AnimatedDialog,
  AnimatedDialogProps,
} from '~/components/animated-dialog';
import { loader } from './route';
import { Link } from '@remix-run/react';
import { FaTrash, FaPenAlt } from 'react-icons/fa';
import { useState } from 'react';
import { DeleteConfirmationDialog } from './delete-confirmation-dialog';

interface ExerciseDialogProps extends AnimatedDialogProps {
  exercise: SerializeFrom<typeof loader>['exercises'][number];
}

export function ExerciseDialog({
  isOpen,
  close,
  exercise,
}: ExerciseDialogProps) {
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);

  return (
    <AnimatedDialog
      isOpen={isOpen}
      close={() => {
        setOpenConfirmDelete(false);
        close();
      }}
    >
      <div className="text-center">
        <DialogTitle as="h3" className="text-base font-semibold text-white">
          {exercise.name}
        </DialogTitle>
      </div>
      <ul className="my-6 rounded-xl divide-y divide-zinc-600 bg-zinc-700">
        <li>
          <Link
            className="flex w-full items-center gap-x-3 bg-zinc-700 hover:bg-zinc-600 px-4 py-3 text-orange-400 font-medium rounded-t-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange-400"
            to={exercise.id}
          >
            <FaPenAlt className="w-4 h-4" />
            <span>Edit</span>
          </Link>
        </li>

        <li>
          <button
            type="submit"
            className="flex w-full items-center gap-x-3 bg-zinc-700 hover:bg-zinc-600 px-4 py-3 text-red-400 font-medium rounded-b-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-400"
            onClick={() => {
              setOpenConfirmDelete(true);
            }}
          >
            <FaTrash className="w-4 h-4" />
            <span>Delete</span>
          </button>
        </li>
      </ul>
      <DeleteConfirmationDialog
        isOpen={openConfirmDelete}
        name={exercise.name}
        action={`${exercise.id}/delete`}
        close={() => {
          setOpenConfirmDelete(false);
        }}
        closeParentDialog={close}
      />
    </AnimatedDialog>
  );
}
