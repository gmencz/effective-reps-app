import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json,
  redirect,
} from '@remix-run/node';

import { requireUser } from '~/utils/sessions.server';

import { Form, Link, useActionData, useLoaderData } from '@remix-run/react';
import getExercise from './get-exercise.server';
import { z } from 'zod';
import { useForm } from '@conform-to/react';
import { parseWithZod } from '@conform-to/zod';
import { Input } from '~/components/input';
import getMuscleGroups from './get-muscle-groups.server';
import SelectInput from '../../components/select-input';
import updateExercise from './update-exercise.server';

import SelectMultipleInput from '~/components/select-multiple-input';
import redirectSessionFlash from '~/utils/redirect-session-flash';

const schema = z.object({
  muscleGroupId: z.string().min(3),
  name: z.string().min(3),
  secondaryMuscleGroupsIds: z.array(z.string().min(3)),
});

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { userId } = await requireUser(request);

  const { exerciseId } = params;

  if (!exerciseId) {
    return redirect('/app/exercises');
  }

  const [exercise, muscleGroups] = await Promise.all([
    getExercise({ userId, id: exerciseId, includeMuscleGroup: true }),
    getMuscleGroups(),
  ]);

  if (!exercise || !muscleGroups) {
    return redirect('/app/exercises');
  }

  return json({ exercise, muscleGroups });
}

export async function action({ request, params }: ActionFunctionArgs) {
  const { userId } = await requireUser(request);

  const { exerciseId } = params;

  if (!exerciseId) {
    return redirect('/app/exercises');
  }

  const formData = await request.formData();

  const submission = parseWithZod(formData, { schema });

  if (submission.status !== 'success') {
    return json(submission.reply());
  }

  const { name, muscleGroupId, secondaryMuscleGroupsIds } = submission.value;

  const exercisePrevToUpdate = await getExercise({
    userId,
    name,
    includeMuscleGroup: true,
  });

  if (exercisePrevToUpdate && exercisePrevToUpdate.id !== exerciseId) {
    return json({
      ...submission.reply(),
      status: 'error' as 'error' | 'success',
      error: { name: ['The exercise name is not unique'] } as Record<
        string,
        string[] | null
      >,
    });
  }

  const updatedExercise = await updateExercise({
    userId,
    id: exerciseId,
    name,
    muscleGroupId,
    secondaryMuscleGroupsIds,
    secondaryMuscleGroupsPrevToUpdate:
      exercisePrevToUpdate?.secondaryMuscleGroups,
  });

  if (!updatedExercise) {
    return redirectSessionFlash(request, {
      url: '/app/exercises',
      sessionFlashKey: 'error',
      sessionFlashValue: `There was an unexpected problem with the update`,
    });
  }
  return redirectSessionFlash(request, {
    url: '/app/exercises',
    sessionFlashKey: 'success',
    sessionFlashValue: `The exercise ${updateExercise.name} was successfully updated`,
  });
}

export default function Exercise() {
  const { exercise, muscleGroups } = useLoaderData<typeof loader>();

  const lastResult = useActionData<typeof action>();

  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema });
    },
    shouldValidate: 'onBlur',
    shouldRevalidate: 'onInput',
    defaultValue: {
      secondaryMuscleGroupsIds: exercise.secondaryMuscleGroups.map(
        (secondaryMuscleGroup) => secondaryMuscleGroup.id,
      ),
    },
  });

  const secondaryMuscleGroupsIdsFieldList =
    fields.secondaryMuscleGroupsIds.getFieldList();

  return (
    <div>
      <h1 className="text-white text-xl font-semibold mb-4">Edit Exercise</h1>

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
            defaultValue={exercise.name}
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
            defaultValue={exercise.muscleGroupId || ''}
            options={muscleGroups}
            errors={fields.muscleGroupId.errors}
            errorId={fields.muscleGroupId.errorId}
          />
        </div>
        <div className=" border-none mt-3">
          <label
            className=" font-medium text-xl text-amber-600  mb-3"
            htmlFor={fields.muscleGroupId.id}
          >
            Secondary Muscle Groups
          </label>

          <SelectMultipleInput
            inputFieldList={secondaryMuscleGroupsIdsFieldList}
            form={form}
            inputField={fields.secondaryMuscleGroupsIds}
            options={muscleGroups}
            errors={fields.secondaryMuscleGroupsIds.errors}
            errorId={fields.secondaryMuscleGroupsIds.errorId}
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
