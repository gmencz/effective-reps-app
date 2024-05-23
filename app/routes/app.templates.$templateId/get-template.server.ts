import { prisma } from '~/utils/prisma.server';

export interface GetTemplateInput {
  templateId: string;
  userId: string;
}

export function getTemplate(input: GetTemplateInput) {
  return prisma.template.findFirst({
    select: {
      name: true,
      exercises: {
        select: {
          id: true,
          sets: true,
          reps: true,
          repRangeStart: true,
          repRangeEnd: true,
          exercise: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
    where: {
      AND: [{ id: input.templateId }, { userId: input.userId }],
    },
  });
}
