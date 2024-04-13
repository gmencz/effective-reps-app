import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const dev = await prisma.user.upsert({
    where: { email: 'dev@test.com' },
    update: {},
    create: {
      email: 'dev@test.com',
      passwordHash: await bcrypt.hash('devpassword', 10),
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
