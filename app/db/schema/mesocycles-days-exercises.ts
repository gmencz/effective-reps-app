import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
import { exercises } from './exercises';
import { mesocyclesDays } from './mesocycles-days';

export const mesocyclesDaysExercises = sqliteTable(
  'mesocycles_days_exercises',
  {
    id: integer('id').primaryKey(),
    number: integer('number').notNull(),
    notes: text('notes'),
    mesocycleDayId: integer('mesocycle_day_id')
      .notNull()
      .references(() => mesocyclesDays.id, { onDelete: 'cascade' }),
    exerciseId: integer('exercise_id')
      .notNull()
      .references(() => exercises.id, { onDelete: 'set null' }),
    createdAt: text('created_at')
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
);

export type InsertMesocycleDayExercise =
  typeof mesocyclesDaysExercises.$inferInsert;

export type SelectMesocycleDayExercise =
  typeof mesocyclesDaysExercises.$inferSelect;
