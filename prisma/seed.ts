import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  await prisma.muscleGroup.createMany({
    data: [
      { name: 'Chest' },
      { name: 'Back' },
      { name: 'Shoulders' },
      { name: 'Biceps' },
      { name: 'Triceps' },
      { name: 'Forearms' },
      { name: 'Abs' },
      { name: 'Obliques' },
      { name: 'Quads' },
      { name: 'Hamstrings' },
      { name: 'Glutes' },
      { name: 'Calves' },
      { name: 'Trapezius' },
      { name: 'Lats' }, // Latissimus Dorsi
      { name: 'Hip Flexors' },
      { name: 'Adductors' },
      { name: 'Abductors' },
      { name: 'Lower Back' },
      { name: 'Serratus Anterior' },
    ],
  });
  const dev = await prisma.user.create({
    data: {
      email: 'dev@test.com',
      passwordHash: await bcrypt.hash('devpassword', 10),
      templates: {
        create: [
          { name: 'Chest/Back/Abs A' },
          { name: 'Arms/Delts A' },
          { name: 'Lower A' },
          { name: 'Chest/Back/Abs B' },
          { name: 'Arms/Delts B' },
          { name: 'Lower B' },
        ],
      },
      exercises: {
        create: [
          {
            name: 'Technogym High Incline Smith Press',
            exerciseTextSearch: 'Technogym High Incline Smith Press Chest',
            muscleGroup: {
              connect: { name: 'Chest' },
            },
          },
          {
            name: 'Technogym Low Incline Smith Press',
            exerciseTextSearch: 'Technogym Low Incline Smith Press Chest',
            muscleGroup: {
              connect: { name: 'Chest' },
            },
          },
          {
            name: 'Hammer Strength SA Pulldown',
            exerciseTextSearch: 'Hammer Strength SA Pulldown Biceps',
            muscleGroup: {
              connect: { name: 'Biceps' },
            },
          },
          {
            name: 'Pure Strength Stiff Legged Deadlift',
            exerciseTextSearch: 'Pure Strength Stiff Legged Deadlift Glutes',
            muscleGroup: {
              connect: { name: 'Glutes' },
            },
          },
          {
            name: 'Pure Strength Hack Squat',
            exerciseTextSearch: 'Pure Strength Hack Squat Quads',
            muscleGroup: {
              connect: { name: 'Quads' },
            },
          },
          {
            name: 'Barbell Row',
            exerciseTextSearch: 'Barbell Row Back',
            muscleGroup: {
              connect: { name: 'Back' },
            },
          },
          {
            name: 'Stabilized Dumbbell Curl',
            exerciseTextSearch: 'Stabilized Dumbbell Curl Biceps',
            muscleGroup: {
              connect: { name: 'Biceps' },
            },
          },
          {
            name: 'Push ups',
            exerciseTextSearch: 'Push ups Chest',
            muscleGroup: {
              connect: { name: 'Chest' },
            },
          },
          {
            name: 'Chin ups',
            exerciseTextSearch: 'Chin ups Back',
            muscleGroup: {
              connect: { name: 'Back' },
            },
          },
          {
            name: 'Pull ups',
            exerciseTextSearch: 'Pull ups Back',
            muscleGroup: {
              connect: { name: 'Back' },
            },
          },
        ],
      },
    },
  });

  console.log({ dev });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
