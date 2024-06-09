import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json,
  redirect,
} from '@remix-run/node';
import { getTemplate } from './get-template.server';
import { requireUser } from '~/utils/sessions.server';
import { Form, useActionData, useLoaderData } from '@remix-run/react';
import { LuDot } from 'react-icons/lu';
import { FaPlus, FaCheck, FaEllipsisV } from 'react-icons/fa';
import { useState } from 'react';
import { z } from 'zod';
import { parseWithZod } from '@conform-to/zod';
import { getInputProps, useForm } from '@conform-to/react';
import { AddExercisesDialog } from './add-exercises-dialog';
import { getExercises } from '../app.exercises._index/get-exercises.server';

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { userId } = await requireUser(request);
  const { templateId } = params;
  if (!templateId) {
    throw redirect('/app/templates');
  }

  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');
  const [template, exercises] = await Promise.all([
    getTemplate({
      templateId,
      userId,
    }),
    getExercises({ userId, query: query || undefined }),
  ]);
  if (!template) {
    throw redirect('/app/templates');
  }
  return json({ template, exercises });
}

const schema = z.object({
  name: z
    .string()
    .max(255, 'Template name is too long. Must be 255 characters or fewer.'),
});

export async function action({ request }: ActionFunctionArgs) {
  await requireUser(request);

  const formData = await request.formData();
  const submission = parseWithZod(formData, { schema });

  if (submission.status !== 'success') {
    return json(submission.reply());
  }

  return redirect('/app/templates');
}

export default function Template() {
  const { template } = useLoaderData<typeof loader>();
  const lastResult = useActionData<typeof action>();
  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema });
    },
    shouldValidate: 'onBlur',
    defaultValue: {
      name: template.name,
    },
  });

  const exercisesCount = template.exercises.length;

  const setsCount = template.exercises.reduce(
    (count, exercise) => count + exercise.sets,
    0,
  );

  const [openDialogs, setOpenDialogs] = useState({
    addExercise: false,
    templateOptions: false,
  });

  return (
    <>
      <Form method="post" id={form.id} onSubmit={form.onSubmit}>
        <div className="flex items-center gap-6">
          <input
            {...getInputProps(fields.name, { type: 'text' })}
            className="border-t-0 border-x-0 border-b-zinc-600 pt-0 pb-2 border-b-2 bg-transparent text-white w-full text-xl font-semibold focus:outline-none focus:ring-0 focus:border-b-orange-500 px-0"
          />

          <button
            type="button"
            onClick={() => {
              setOpenDialogs({
                addExercise: false,
                templateOptions: true,
              });
            }}
            className="text-white bg-zinc-700 hover:bg-zinc-600 rounded-xl p-3"
          >
            <span className="sr-only">Template options</span>
            <FaEllipsisV className="h-4 w-4" />
          </button>
        </div>

        {exercisesCount > 0 && setsCount > 0 ? (
          <div className="mt-4 text-zinc-400 flex items-center gap-1">
            <span>{exercisesCount} exercises</span>
            <LuDot className="w-4 h-4" />
            <span>{setsCount} sets</span>
          </div>
        ) : null}

        <button
          type="button"
          onClick={() => {
            setOpenDialogs({
              addExercise: true,
              templateOptions: false,
            });
          }}
          className="mt-6 flex items-center justify-center gap-x-3 bg-amber-600 text-white hover:bg-amber-500 rounded-xl font-semibold px-4 py-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600"
        >
          <FaPlus className="h-4 w-4" />
          <span>Add Exercises</span>
        </button>

        <div className="fixed left-1/2 -translate-x-1/2 bottom-5 w-full max-w-lg px-8">
          <button
            type="submit"
            className="flex items-center justify-center gap-x-3 w-full bg-amber-600 text-white hover:bg-amber-500 rounded-xl font-semibold px-4 py-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600"
          >
            <FaCheck className="-ml-3 h-4 w-4" />
            <span>Save</span>
          </button>
        </div>
      </Form>

      <AddExercisesDialog
        isOpen={openDialogs.addExercise}
        close={() => {
          setOpenDialogs((prev) => ({ ...prev, addExercise: false }));
        }}
      />
    </>
  );
}
