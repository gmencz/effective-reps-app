import { DialogTitle } from '@headlessui/react';
import { SerializeFrom } from '@remix-run/node';
import {
  AnimatedDialog,
  AnimatedDialogProps,
} from '~/components/animated-dialog';
import { loader } from './route';
import { Form, Link } from '@remix-run/react';
import { FaTrash, FaPenAlt, FaPlay } from 'react-icons/fa';
import { FaCopy } from 'react-icons/fa6';

interface TemplateDialogProps extends AnimatedDialogProps {
  template: SerializeFrom<typeof loader>['templates'][number];
}

export function TemplateDialog({
  isOpen,
  close,
  template,
}: TemplateDialogProps) {
  return (
    <AnimatedDialog isOpen={isOpen} close={close}>
      <div className="text-center">
        <DialogTitle as="h3" className="text-base font-semibold text-white">
          {template.name}
        </DialogTitle>
      </div>
      <ul className="mt-6 rounded-xl divide-y divide-zinc-600 bg-zinc-700">
        <li>
          <Link
            className="flex items-center gap-x-3 bg-zinc-700 hover:bg-zinc-600 px-4 py-3 text-orange-400 font-medium rounded-t-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange-400"
            to={template.id}
          >
            <FaPlay className="w-4 h-4" />
            <span>Start Workout</span>
          </Link>
        </li>
        <li>
          <Link
            className="flex items-center gap-x-3 bg-zinc-700 hover:bg-zinc-600 px-4 py-3 text-white font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
            to={template.id}
          >
            <FaPenAlt className="w-4 h-4" />
            <span>Edit</span>
          </Link>
        </li>
        <li>
          <Form method="post" action={template.id}>
            <button
              type="submit"
              className="flex w-full items-center gap-x-3 bg-zinc-700 hover:bg-zinc-600 px-4 py-3 text-white font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
            >
              <FaCopy className="w-4 h-4" />
              <span>Duplicate</span>
            </button>
          </Form>
        </li>
        <li>
          <Form method="delete" action={template.id}>
            <button
              type="submit"
              className="flex w-full items-center gap-x-3 bg-zinc-700 hover:bg-zinc-600 px-4 py-3 text-red-400 font-medium rounded-b-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-400"
            >
              <FaTrash className="w-4 h-4" />
              <span>Delete</span>
            </button>
          </Form>
        </li>
      </ul>
    </AnimatedDialog>
  );
}
