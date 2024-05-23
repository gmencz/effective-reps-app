import { prisma } from '~/utils/prisma.server';

export interface GetTemplatesInput {
  userId: string;
}

export function getTemplates(input: GetTemplatesInput) {
  return prisma.template.findMany({
    select: {
      id: true,
      name: true,
    },
    where: { userId: input.userId },
    orderBy: [{ lastUsedAt: 'desc' }, { createdAt: 'desc' }],
  });
}
