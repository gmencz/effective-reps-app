import { DialogTitle } from '@headlessui/react';
import {
  AnimatedDialog,
  AnimatedDialogProps,
} from '~/components/animated-dialog';
import { Form } from '@remix-run/react';
import { FaTrash } from 'react-icons/fa';

interface DeleteConfirmationDialogProps extends AnimatedDialogProps {
  action: string;
  name: string;
  closeParentDialog: () => void;
}

export function DeleteConfirmationDialog({
  isOpen,
  close,
  action,
  name,
  closeParentDialog,
}: DeleteConfirmationDialogProps) {
  return (
    <AnimatedDialog isOpen={isOpen} close={close}>
      <div className="text-center">
        <DialogTitle
          as="h3"
          className=" font-semibold flex flex-col text-white"
        >
          <span className="text-lg "> Are u sure u want to delete</span>
          <span className="text-base mt-2  text-red-100">{name}</span>
        </DialogTitle>
      </div>

      <Form
        method="DELETE"
        action={action}
        onSubmit={() => {
          close();
          closeParentDialog();
        }}
      >
        <input type="hidden" name="intent" value="delete" />
        <button
          type="submit"
          className=" mt-6 flex w-full items-center gap-x-3 bg-zinc-700 hover:bg-zinc-600 px-4 py-3 text-red-400 font-medium rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-400"
        >
          <FaTrash className="w-4 h-4" />
          <span>Delete</span>
        </button>
      </Form>
    </AnimatedDialog>
  );
}
