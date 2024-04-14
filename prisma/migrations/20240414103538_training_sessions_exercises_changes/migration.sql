/*
  Warnings:

  - You are about to drop the `_MesocycleDayExerciseToTrainingSession` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `training_session_id` to the `training_sessions_exercises` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_MesocycleDayExerciseToTrainingSession" DROP CONSTRAINT "_MesocycleDayExerciseToTrainingSession_A_fkey";

-- DropForeignKey
ALTER TABLE "_MesocycleDayExerciseToTrainingSession" DROP CONSTRAINT "_MesocycleDayExerciseToTrainingSession_B_fkey";

-- AlterTable
ALTER TABLE "training_sessions_exercises" ADD COLUMN     "training_session_id" INTEGER NOT NULL;

-- DropTable
DROP TABLE "_MesocycleDayExerciseToTrainingSession";

-- AddForeignKey
ALTER TABLE "training_sessions_exercises" ADD CONSTRAINT "training_sessions_exercises_training_session_id_fkey" FOREIGN KEY ("training_session_id") REFERENCES "training_sessions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
