import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
import { exercises } from './exercises';

export const mesocyclesDaysExercises = sqliteTable(
  'mesocycles_days_exercises',
  {
    id: integer('id').primaryKey(),
    notes: text('notes'),
    exerciseId: integer('exercise_id')
      .notNull()
      .references(() => exercises.id, { onDelete: 'cascade' }),
    createdAt: text('created_at')
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
);

export type InsertMesocycleDayExercise =
  typeof mesocyclesDaysExercises.$inferInsert;

export type SelectMesocycleDayExercise =
  typeof mesocyclesDaysExercises.$inferSelect;
