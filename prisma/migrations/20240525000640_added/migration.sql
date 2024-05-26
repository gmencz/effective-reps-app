/*
  Warnings:

  - You are about to drop the column `muscle_group_id` on the `exercises` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "exercises" DROP CONSTRAINT "exercises_muscle_group_id_fkey";

-- AlterTable
ALTER TABLE "exercises" DROP COLUMN "muscle_group_id",
ADD COLUMN     "muscle_group_name" TEXT;

-- CreateIndex
CREATE INDEX "exercise_text_search" ON "exercises"("name", "muscle_group_name");

-- AddForeignKey
ALTER TABLE "exercises" ADD CONSTRAINT "exercises_muscle_group_name_fkey" FOREIGN KEY ("muscle_group_name") REFERENCES "muscle_groups"("id") ON DELETE SET NULL ON UPDATE CASCADE;
