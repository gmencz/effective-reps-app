-- DropForeignKey
ALTER TABLE "exercises" DROP CONSTRAINT "exercises_muscle_group_id_fkey";

-- AlterTable
ALTER TABLE "exercises" ALTER COLUMN "muscle_group_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "exercises" ADD CONSTRAINT "exercises_muscle_group_id_fkey" FOREIGN KEY ("muscle_group_id") REFERENCES "muscle_groups"("id") ON DELETE SET NULL ON UPDATE CASCADE;
