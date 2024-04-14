-- CreateTable
CREATE TABLE "training_sessions_exercises" (
    "id" SERIAL NOT NULL,
    "number" INTEGER NOT NULL,
    "notes" TEXT,
    "exercise_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "training_sessions_exercises_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "training_sessions_exercises_sets" (
    "id" SERIAL NOT NULL,
    "number" INTEGER NOT NULL,
    "reps" INTEGER NOT NULL,
    "rir" INTEGER NOT NULL,
    "rest_seconds" INTEGER,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "exercise_id" INTEGER,

    CONSTRAINT "training_sessions_exercises_sets_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "training_sessions_exercises" ADD CONSTRAINT "training_sessions_exercises_exercise_id_fkey" FOREIGN KEY ("exercise_id") REFERENCES "exercises"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training_sessions_exercises_sets" ADD CONSTRAINT "training_sessions_exercises_sets_exercise_id_fkey" FOREIGN KEY ("exercise_id") REFERENCES "training_sessions_exercises"("id") ON DELETE SET NULL ON UPDATE CASCADE;
