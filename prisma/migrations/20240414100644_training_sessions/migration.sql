/*
  Warnings:

  - You are about to drop the `mesocycles_days_exercises_sets` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "mesocycles_days_exercises_sets" DROP CONSTRAINT "mesocycles_days_exercises_sets_exercise_id_fkey";

-- DropTable
DROP TABLE "mesocycles_days_exercises_sets";

-- CreateTable
CREATE TABLE "mesocycles_days_exercises_prescribed_sets" (
    "id" SERIAL NOT NULL,
    "number" INTEGER NOT NULL,
    "rep_range" TEXT NOT NULL,
    "rir" INTEGER NOT NULL,
    "rest_seconds" INTEGER,
    "notes" TEXT,
    "exercise_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mesocycles_days_exercises_prescribed_sets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "training_sessions" (
    "id" SERIAL NOT NULL,
    "notes" TEXT,
    "mesocycle_day_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" INTEGER NOT NULL,
    "current_user_id" INTEGER,

    CONSTRAINT "training_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_MesocycleDayExerciseToTrainingSession" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "training_sessions_current_user_id_key" ON "training_sessions"("current_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "_MesocycleDayExerciseToTrainingSession_AB_unique" ON "_MesocycleDayExerciseToTrainingSession"("A", "B");

-- CreateIndex
CREATE INDEX "_MesocycleDayExerciseToTrainingSession_B_index" ON "_MesocycleDayExerciseToTrainingSession"("B");

-- AddForeignKey
ALTER TABLE "mesocycles_days_exercises_prescribed_sets" ADD CONSTRAINT "mesocycles_days_exercises_prescribed_sets_exercise_id_fkey" FOREIGN KEY ("exercise_id") REFERENCES "mesocycles_days_exercises"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training_sessions" ADD CONSTRAINT "training_sessions_mesocycle_day_id_fkey" FOREIGN KEY ("mesocycle_day_id") REFERENCES "mesocycles_days"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training_sessions" ADD CONSTRAINT "training_sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training_sessions" ADD CONSTRAINT "training_sessions_current_user_id_fkey" FOREIGN KEY ("current_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MesocycleDayExerciseToTrainingSession" ADD CONSTRAINT "_MesocycleDayExerciseToTrainingSession_A_fkey" FOREIGN KEY ("A") REFERENCES "mesocycles_days_exercises"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MesocycleDayExerciseToTrainingSession" ADD CONSTRAINT "_MesocycleDayExerciseToTrainingSession_B_fkey" FOREIGN KEY ("B") REFERENCES "training_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
