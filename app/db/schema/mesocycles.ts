import { sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { users } from './users';

export const mesocycles = sqliteTable('mesocycles', {
  id: integer('id').primaryKey(),
  name: text('name').notNull(),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  createdAt: text('created_at')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export type InsertMesocycle = typeof mesocycles.$inferInsert;
export type SelectMesocycle = typeof mesocycles.$inferSelect;
