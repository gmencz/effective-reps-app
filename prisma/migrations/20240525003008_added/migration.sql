/*
  Warnings:

  - You are about to drop the column `muscle_group_name` on the `exercises` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "exercises" DROP CONSTRAINT "exercises_muscle_group_name_fkey";

-- DropIndex
DROP INDEX "exercise_text_search";

-- AlterTable
ALTER TABLE "exercises" DROP COLUMN "muscle_group_name",
ADD COLUMN     "exercise_text_search" TEXT,
ADD COLUMN     "muscle_group_id" TEXT;

-- AddForeignKey
ALTER TABLE "exercises" ADD CONSTRAINT "exercises_muscle_group_id_fkey" FOREIGN KEY ("muscle_group_id") REFERENCES "muscle_groups"("id") ON DELETE SET NULL ON UPDATE CASCADE;
