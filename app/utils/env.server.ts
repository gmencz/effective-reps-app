import { z } from 'zod';

const schema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']),
  SESSION_SECRET_1: z.string(),
  DATABASE_URL: z.string(),
});

export const env = schema.parse(process.env);
