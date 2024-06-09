import {
  LoaderFunctionArgs,
  SerializeFrom,
  json,
  redirect,
} from '@remix-run/node';
import { requireUser } from '~/utils/sessions.server';
import { getExercises } from './get-exercises.server';
import { Form, Link, useLoaderData, useSearchParams } from '@remix-run/react';
import clsx from 'clsx';
import { getInputProps, useForm } from '@conform-to/react';
import { parseWithZod } from '@conform-to/zod';
import { z } from 'zod';
import { useDebounceSubmit } from 'remix-utils/use-debounce-submit';
import { FaEllipsisV } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { ExerciseDialog } from './exercises-dialog';
import loadSessionFlash from '~/utils/loadSessionFLash';
import toast from 'react-hot-toast';

const schema = z.object({
  query: z.string().optional(),
});

export async function loader({ request }: LoaderFunctionArgs) {
  const { userId } = await requireUser(request);
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');
  const exercises = await getExercises({ userId, query: query || undefined });

  if (!exercises) {
    throw redirect('/app/templates');
  }
  const { sessionFlash, headers } = await loadSessionFlash(request);
  return json({ exercises, sessionFlash }, { headers });
}

export default function Exercises() {
  const {
    exercises,
    sessionFlash: { success, error },
  } = useLoaderData<typeof loader>();
  const submit = useDebounceSubmit();
  const [searchParams] = useSearchParams();

  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<
    SerializeFrom<typeof loader>['exercises'][number]
  >(exercises[0]);

  const [form, fields] = useForm({
    onValidate({ formData }) {
      return parseWithZod(formData, { schema });
    },
    shouldValidate: 'onBlur',
    shouldRevalidate: 'onInput',
  });

  useEffect(() => {
    if (success) {
      toast.success(success);
    }
  }, [success, exercises]);
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error, exercises]);

  return (
    <div>
      <div className=" flex flex-row justify-between mb-4   ">
        <h1 className="text-white text-xl font-semibold ">Exercises</h1>
        <Link
          to="new"
          className=" hover:text-orange-200 text-orange-500 text-xl font-semibold text-center  "
        >
          Add New
        </Link>
      </div>
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

      <ol className=" rounded-xl   flex-1  mt-4 divide-y divide-zinc-700 bg-zinc-800">
        {exercises.map((exercise, index) => {
          return (
            <li key={exercise.id}>
              <button
                onClick={() => {
                  setSelectedExercise(exercise);
                  setIsTemplateDialogOpen(true);
                }}
                className={clsx(
                  'bg-zinc-800 flex w-full items-center justify-between gap-x-3 px-4 py-3 text-white font-medium hover:bg-zinc-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white',
                  index === 0
                    ? 'rounded-t-xl'
                    : index === exercises.length - 1
                      ? 'rounded-b-xl'
                      : '',
                )}
              >
                <div className="flex-col   text-left  ">
                  <p>{exercise.name}</p>
                  <p className="ml-1 text-base text-gray-300 ">
                    {exercise.muscleGroup?.name}
                  </p>
                </div>

                <div className="ml-auto">
                  <FaEllipsisV />
                </div>
              </button>
            </li>
          );
        })}
      </ol>

      <ExerciseDialog
        isOpen={isTemplateDialogOpen}
        exercise={selectedExercise}
        close={() => {
          setIsTemplateDialogOpen(false);
        }}
      ></ExerciseDialog>
    </div>
  );
}
