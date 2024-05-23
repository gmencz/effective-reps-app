import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
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
          { name: 'Technogym High Incline Smith Press' },
          { name: 'Technogym Low Incline Smith Press' },
          { name: 'Hammer Strength SA Pulldown' },
          { name: 'Pure Strength Stiff Legged Deadlift' },
          { name: 'Pure Strength Hack Squat' },
          { name: 'Barbell Row' },
          { name: 'Stabilized Dumbbell Curl' },
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
