import { LoaderFunctionArgs, SerializeFrom, json } from '@remix-run/node';
import { Navigation } from '~/components/navigation';
import { requireUser } from '~/utils/sessions.server';
import { getTemplates } from './get-templates.server';
import { Link, useLoaderData } from '@remix-run/react';
import { FaPlus, FaEllipsisV } from 'react-icons/fa';
import { useState } from 'react';
import { TemplateDialog } from './template-dialog';
import clsx from 'clsx';

export async function loader({ request }: LoaderFunctionArgs) {
  const { userId } = await requireUser(request);
  const templates = await getTemplates({ userId });
  return json({ templates });
}

export default function Templates() {
  const { templates } = useLoaderData<typeof loader>();
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<
    SerializeFrom<typeof loader>['templates'][number]
  >(templates[0]);

  return (
    <>
      <h1 className="text-white text-xl font-semibold mb-4">
        All Templates ({templates.length})
      </h1>

      <Link
        to="create"
        className="flex items-center justify-center gap-x-3 w-full bg-amber-600 text-white hover:bg-amber-500 rounded-xl font-semibold px-4 py-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600"
      >
        <FaPlus className="-ml-3 h-4 w-4" />
        <span>Create Template</span>
      </Link>

      <ol className="rounded-xl mt-6 divide-y divide-zinc-700 bg-zinc-800">
        {templates.map((template, index) => (
          <li key={template.id}>
            <button
              onClick={() => {
                setSelectedTemplate(template);
                setIsTemplateDialogOpen(true);
              }}
              className={clsx(
                'bg-zinc-800 flex w-full items-center justify-between gap-x-3 px-4 py-3 text-white font-medium hover:bg-zinc-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white',
                index === 0
                  ? 'rounded-t-xl'
                  : index === templates.length - 1
                    ? 'rounded-b-xl'
                    : '',
              )}
            >
              <span>{template.name}</span>
              <FaEllipsisV />
            </button>
          </li>
        ))}
      </ol>

      <TemplateDialog
        template={selectedTemplate}
        isOpen={isTemplateDialogOpen}
        close={() => {
          setIsTemplateDialogOpen(false);
        }}
      />

      <Navigation />
    </>
  );
}
