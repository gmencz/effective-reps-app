import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json,
  redirect,
} from '@remix-run/node';

import { requireUser } from '~/utils/sessions.server';

import { Form, Link, useActionData, useLoaderData } from '@remix-run/react';

import { z } from 'zod';
import { useForm } from '@conform-to/react';
import { parseWithZod } from '@conform-to/zod';
import { Input } from '~/components/input';

import SelectInput from '../../components/selectInput';

import redirectSessionFlash from '~/utils/redirectSessionFLash';
import getMuscleGroups from '../app.exercises.$exerciseId/get-muscleGroups.server';
import updateExercise from '../app.exercises.$exerciseId/update-exercise.server';

import getExercise from '../app.exercises.$exerciseId/get-exercise.server';
import AddExercise from './add-exercise';

const schema = z.object({
  muscleGroupId: z.string().min(3),
  name: z.string().min(3),
});

export async function loader({ request }: LoaderFunctionArgs) {
  await requireUser(request);

  const muscleGroups = await getMuscleGroups();

  if (!muscleGroups) {
    return redirect('/app/exercises');
  }

  return json({ muscleGroups });
}

export async function action({ request }: ActionFunctionArgs) {
  const { userId } = await requireUser(request);

  const formData = await request.formData();

  const submission = parseWithZod(formData, { schema });

  if (submission.status !== 'success') {
    return json(submission.reply());
  }
  const { muscleGroupId, name } = submission.value;

  const exerciseNameExists = await getExercise({
    userId,
    name,
    includeMuscleGroup: false,
  });

  if (exerciseNameExists) {
    return json({
      ...submission.reply(),
      status: 'error' as 'error' | 'success',
      error: { name: ['The exercise name is not unique'] } as Record<
        string,
        string[] | null
      >,
    });
  }

  const newExercise = await AddExercise({
    name,
    muscleGroupId,
    userId,
  });

  if (!newExercise) {
    return redirectSessionFlash(request, {
      url: '/app/exercises',
      sessionFlashKey: 'error',
      sessionFlashValue: `There was an unexpected problem with the exercise `,
    });
  }
  return redirectSessionFlash(request, {
    url: '/app/exercises',
    sessionFlashKey: 'success',
    sessionFlashValue: `The exercise ${updateExercise.name} was successfully created`,
  });
}

export default function Exercise() {
  const { muscleGroups } = useLoaderData<typeof loader>();

  const lastResult = useActionData<typeof action>();

  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema });
    },
    shouldValidate: 'onBlur',
    shouldRevalidate: 'onInput',
  });

  return (
    <div>
      <h1 className="text-white text-xl font-semibold mb-4">New Exercise</h1>

      <Form
        className='rounded-xl   flex-1  mt-6 divide-y divide-zinc-700 bg-zinc-800"'
        method="post"
        id={form.id}
        onSubmit={form.onSubmit}
      >
        <div className=" border-none mt-3">
          <label
            className=" font-medium text-xl text-amber-600  mb-3"
            htmlFor={fields.name.id}
          >
            name
          </label>
          <Input
            id={fields.name.id}
            name={fields.name.name}
            errorId={fields.name.errorId}
            type="text"
            errors={fields.name.errors}
            className="mt-2 w-full "
          />
        </div>
        <div className=" border-none mt-3">
          <label
            className=" font-medium text-xl text-amber-600  mb-3"
            htmlFor={fields.muscleGroupId.id}
          >
            Muscle Group
          </label>

          <SelectInput
            inputField={fields.muscleGroupId}
            options={muscleGroups}
            errors={fields.muscleGroupId.errors}
            errorId={fields.muscleGroupId.errorId}
            defaultValue={muscleGroups[0].id}
          />
        </div>

        <button className="mt-4 w-full flex items-center justify-center gap-x-3 bg-amber-600 text-white hover:bg-amber-500 rounded-xl font-semibold px-4 py-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600">
          <span>Edit</span>
        </button>
      </Form>
      <div className="mt-4">
        <Link
          to="/app/exercises"
          className=" hover:text-orange-200 text-orange-500 text-lg text-center "
        >
          Go Back
        </Link>
      </div>
    </div>
  );
}
