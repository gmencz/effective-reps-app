import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from '@headlessui/react';
import { PropsWithChildren } from 'react';
import { Fragment } from 'react/jsx-runtime';

export interface AnimatedDialogProps {
  isOpen: boolean;
  close: () => void;
}

export function AnimatedDialog({
  isOpen,
  close,
  children,
}: PropsWithChildren<AnimatedDialogProps>) {
  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog className="relative z-10" onClose={close}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-zinc-900 bg-opacity-75 transition-opacity" />
        </TransitionChild>

        <div className="fixed inset-0 z-10 w-screen">
          <div className="flex min-h-full items-end justify-center text-center sm:items-center">
            <TransitionChild
              as={Fragment}
              enter="ease-in-out duration-500 sm:duration-300"
              enterFrom="translate-y-full sm:opacity-0 sm:translate-y-0 sm:scale-95"
              enterTo="translate-y-0"
              leave="ease-in-out duration-500 sm:duration-200"
              leaveFrom="translate-y-0 sm:scale-100"
              leaveTo="translate-y-full sm:opacity-0 sm:translate-y-0 sm:scale-95"
            >
              <DialogPanel className="relative transform rounded-t-[2rem] sm:rounded-t-xl sm:rounded-xl overflow-hidden max-h-screen bg-zinc-800 px-4 py-5 text-left shadow-xl transition-all sm:my-8 w-full sm:max-w-md sm:p-6">
                {children}
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
