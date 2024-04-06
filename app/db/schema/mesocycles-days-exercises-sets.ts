import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
import { mesocyclesDaysExercises } from './mesocycles-days-exercises';

export const mesocyclesDaysExercisesSets = sqliteTable(
  'mesocycles_days_exercises_sets',
  {
    id: integer('id').primaryKey(),
    number: integer('number').notNull(),
    repRange: text('rep_range'),
    workingWeight: integer('working_weight'), // In case the user wants to add a working weight for when they don't have any existing data for this exercise
    rir: integer('rir'),
    restSeconds: integer('rest_seconds'),
    mesocycleDayExerciseId: integer('mesocycle_day_exercise_id')
      .notNull()
      .references(() => mesocyclesDaysExercises.id, { onDelete: 'cascade' }),
    createdAt: text('created_at')
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
);

export type InsertMesocycleDayExerciseSet =
  typeof mesocyclesDaysExercisesSets.$inferInsert;

export type SelectMesocycleDayExerciseSet =
  typeof mesocyclesDaysExercisesSets.$inferSelect;
