import { sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { users } from './users';

export const exercises = sqliteTable('exercises', {
  id: integer('id').primaryKey(),
  name: text('name').notNull(),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  createdAt: text('created_at')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export type InsertExercise = typeof exercises.$inferInsert;
export type SelectExercise = typeof exercises.$inferSelect;
