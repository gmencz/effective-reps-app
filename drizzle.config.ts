import type { Config } from 'drizzle-kit';
import { env } from '~/config/env';

export default {
  schema: './app/db/schema/schema.ts',
  out: './migrations',
  driver: 'turso',
  dbCredentials: {
    url: env.TURSO_CONNECTION_URL,
    authToken: env.TURSO_AUTH_TOKEN,
  },
} satisfies Config;
