import { DialogTitle } from '@headlessui/react';
import {
  AnimatedDialog,
  AnimatedDialogProps,
} from '../../components/animated-dialog';
import { FaCheck, FaPlus } from 'react-icons/fa';
import { useState } from 'react';
import { action, loader } from './route';
import {
  Form,
  Link,
  useActionData,
  useLoaderData,
  useSearchParams,
} from '@remix-run/react';
import clsx from 'clsx';

import { getInputProps, useForm } from '@conform-to/react';
import { parseWithZod } from '@conform-to/zod';
import { z } from 'zod';
import { useDebounceSubmit } from 'remix-utils/use-debounce-submit';

interface AddExercisesDialogProps extends AnimatedDialogProps {}

const schema = z.object({
  query: z.string().optional(),
});

export function AddExercisesDialog({ isOpen, close }: AddExercisesDialogProps) {
  const { exercises } = useLoaderData<typeof loader>();
  const lastResult = useActionData<typeof action>();
  const [selectedIds, setSelectedIds] = useState(new Set<string>());
  const submit = useDebounceSubmit();
  const [searchParams] = useSearchParams();

  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema });
    },
    shouldValidate: 'onBlur',
    shouldRevalidate: 'onInput',
  });

  const isSelected = (id: string) => selectedIds.has(id);

  const addSelected = (id: string) => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev);

      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }

      return newSet;
    });
  };

  return (
    <AnimatedDialog
      isOpen={isOpen}
      close={() => {
        const formData = new FormData();
        formData.append('query', '');
        submit(formData, {
          debounceTimeout: 500,
          method: 'get',
          fetcherKey: 'exercises',
        });
        close();
      }}
    >
      <div className="flex flex-col max-h-screen">
        <div className="text-center">
          <DialogTitle as="h3" className="text-base font-semibold text-white">
            Add Exercises
          </DialogTitle>
        </div>
        <div>
          <Form
            method="get"
            id={form.id}
            onSubmit={form.onSubmit}
            onChange={(event) => {
              submit(event.currentTarget, {
                debounceTimeout: 350,
                fetcherKey: 'exercises',
              });
            }}
          >
            <input
              {...getInputProps(fields.query, {
                type: 'text',
              })}
              defaultValue={searchParams.get('query') || ''}
              placeholder="search ..."
              className="  border-t-0 border-x-0 border-b-zinc-600 pt-0 pb-2 border-b-2 bg-transparent text-white w-full text-xl font-semibold focus:outline-none focus:ring-0 focus:border-b-orange-500 px-2"
            />
          </Form>
        </div>
        <Link
          to="/app/exercises"
          className="mt-2 hover:text-orange-200 text-orange-500 text-lg text-center"
        >
          All exercises
        </Link>
        <ol className="mt-4 rounded-xl overflow-y-auto mb-6 bg-zinc-700  ">
          {exercises.map((exercise) => (
            <li key={exercise.id}>
              <button
                onClick={() => {
                  addSelected(exercise.id);
                }}
                className={clsx(
                  'w-full px-4 py-2.5 flex items-center gap-4',
                  isSelected(exercise.id)
                    ? 'bg-zinc-600'
                    : 'bg-zinc-700 hover:bg-zinc-600',
                )}
              >
                <span className="bg-zinc-600 text-zinc-400 px-4 py-1.5 rounded-xl text-2xl font-semibold">
                  {exercise.name.charAt(0)}
                </span>
                <div className="flex  flex-col ">
                  <span className=" text-left text-gray-400 text-sm">
                    {exercise.muscleGroup?.name}
                  </span>
                  <span className="text-left text-white">{exercise.name}</span>
                </div>

                <div className="ml-auto">
                  <FaCheck
                    className={clsx(
                      'h-4 w-4 text-orange-500',
                      isSelected(exercise.id) ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                </div>
              </button>
            </li>
          ))}
        </ol>

        <button
          type="button"
          className="sticky bottom-0 left-0 right-0 flex items-center justify-center gap-x-3 w-full bg-amber-600 text-white hover:bg-amber-500 rounded-xl font-semibold px-4 py-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600"
        >
          <FaPlus className="-ml-3 h-4 w-4" />
          <span>Add ({selectedIds.size})</span>
        </button>
      </div>
    </AnimatedDialog>
  );
}
