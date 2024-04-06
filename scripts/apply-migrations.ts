import { resolve } from 'node:path';
import { migrate } from 'drizzle-orm/libsql/migrator';
import { db } from '~/db/db';

(async () => {
  await migrate(db, { migrationsFolder: resolve('./migrations') });
  console.log('Migrations successfully applied');
})();
