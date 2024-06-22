-- CreateTable
CREATE TABLE "_secondaryMuscleGroups" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_secondaryMuscleGroups_AB_unique" ON "_secondaryMuscleGroups"("A", "B");

-- CreateIndex
CREATE INDEX "_secondaryMuscleGroups_B_index" ON "_secondaryMuscleGroups"("B");

-- AddForeignKey
ALTER TABLE "_secondaryMuscleGroups" ADD CONSTRAINT "_secondaryMuscleGroups_A_fkey" FOREIGN KEY ("A") REFERENCES "exercises"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_secondaryMuscleGroups" ADD CONSTRAINT "_secondaryMuscleGroups_B_fkey" FOREIGN KEY ("B") REFERENCES "muscle_groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;
