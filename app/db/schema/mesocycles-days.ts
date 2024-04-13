import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { mesocycles } from './mesocycles';
import { sql } from 'drizzle-orm';

export const mesocyclesDays = sqliteTable('mesocycles_days', {
  id: integer('id').primaryKey(),
  name: text('name').notNull(),
  number: integer('number').notNull(),
  notes: text('notes'),
  mesocycleId: integer('mesocycle_id')
    .notNull()
    .references(() => mesocycles.id, { onDelete: 'cascade' }),
  createdAt: text('created_at')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export type InsertMesocycleDay = typeof mesocyclesDays.$inferInsert;
export type SelectMesocycleDay = typeof mesocyclesDays.$inferSelect;
