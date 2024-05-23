import { prisma } from '~/utils/prisma.server';

export interface GetRecentTemplatesInput {
  userId: string;
}

export function getRecentTemplates(input: GetRecentTemplatesInput) {
  return prisma.template.findMany({
    where: { userId: input.userId },
    orderBy: [{ lastUsedAt: 'desc' }, { createdAt: 'desc' }],
    take: 10,
  });
}
