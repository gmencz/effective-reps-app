/*
  Warnings:

  - You are about to drop the `mesocycles_days_exercises_prescribed_sets` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "mesocycles_days_exercises_prescribed_sets" DROP CONSTRAINT "mesocycles_days_exercises_prescribed_sets_exercise_id_fkey";

-- DropTable
DROP TABLE "mesocycles_days_exercises_prescribed_sets";

-- CreateTable
CREATE TABLE "mesocycles_days_exercises_sets" (
    "id" SERIAL NOT NULL,
    "number" INTEGER NOT NULL,
    "rep_range" TEXT NOT NULL,
    "rir" INTEGER NOT NULL,
    "rest_seconds" INTEGER,
    "notes" TEXT,
    "exercise_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mesocycles_days_exercises_sets_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "mesocycles_days_exercises_sets" ADD CONSTRAINT "mesocycles_days_exercises_sets_exercise_id_fkey" FOREIGN KEY ("exercise_id") REFERENCES "mesocycles_days_exercises"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
