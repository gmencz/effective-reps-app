-- AlterTable
ALTER TABLE "mesocycles_days" ALTER COLUMN "notes" DROP NOT NULL;

-- AlterTable
ALTER TABLE "mesocycles_days_exercises" ALTER COLUMN "notes" DROP NOT NULL;

-- AlterTable
ALTER TABLE "mesocycles_days_exercises_sets" ALTER COLUMN "weight" DROP NOT NULL,
ALTER COLUMN "notes" DROP NOT NULL;
