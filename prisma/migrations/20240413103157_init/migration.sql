-- CreateTable
CREATE TABLE "mesocycles" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mesocycles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mesocycles_days" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "notes" TEXT NOT NULL,
    "mesocycle_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mesocycles_days_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mesocycles_days_exercises" (
    "id" SERIAL NOT NULL,
    "number" INTEGER NOT NULL,
    "notes" TEXT NOT NULL,
    "day_id" INTEGER NOT NULL,
    "exercise_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mesocycles_days_exercises_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mesocycles_days_exercises_sets" (
    "id" SERIAL NOT NULL,
    "number" INTEGER NOT NULL,
    "rep_range" TEXT NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "rir" INTEGER NOT NULL,
    "rest_seconds" INTEGER NOT NULL,
    "notes" TEXT NOT NULL,
    "exercise_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mesocycles_days_exercises_sets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exercises" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "unilateral" BOOLEAN NOT NULL DEFAULT false,
    "user_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "exercises_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "mesocycles_name_user_id_key" ON "mesocycles"("name", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "mesocycles_days_name_mesocycle_id_key" ON "mesocycles_days"("name", "mesocycle_id");

-- CreateIndex
CREATE UNIQUE INDEX "exercises_name_user_id_key" ON "exercises"("name", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "mesocycles" ADD CONSTRAINT "mesocycles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mesocycles_days" ADD CONSTRAINT "mesocycles_days_mesocycle_id_fkey" FOREIGN KEY ("mesocycle_id") REFERENCES "mesocycles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mesocycles_days_exercises" ADD CONSTRAINT "mesocycles_days_exercises_day_id_fkey" FOREIGN KEY ("day_id") REFERENCES "mesocycles_days"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mesocycles_days_exercises" ADD CONSTRAINT "mesocycles_days_exercises_exercise_id_fkey" FOREIGN KEY ("exercise_id") REFERENCES "exercises"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mesocycles_days_exercises_sets" ADD CONSTRAINT "mesocycles_days_exercises_sets_exercise_id_fkey" FOREIGN KEY ("exercise_id") REFERENCES "mesocycles_days_exercises"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exercises" ADD CONSTRAINT "exercises_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
