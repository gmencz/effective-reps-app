/*
  Warnings:

  - A unique constraint covering the columns `[id,user_id]` on the table `exercises` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "exercises_id_user_id_key" ON "exercises"("id", "user_id");
