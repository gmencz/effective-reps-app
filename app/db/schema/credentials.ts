import { integer, sqliteTable } from 'drizzle-orm/sqlite-core';
import { users } from './users';

export const credentials = sqliteTable('credentials', {
  id: integer('id').primaryKey(),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
});

export type InsertCredential = typeof credentials.$inferInsert;
export type SelectCredential = typeof credentials.$inferSelect;
