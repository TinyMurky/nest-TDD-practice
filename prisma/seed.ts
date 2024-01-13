import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();
async function main() {
  const tiny = await prisma.user.upsert({
    where: { email: 'tiny@gmail.com' },
    update: {},
    create: {
      email: 'tiny@gmail.com',
      name: 'tiny',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10)),
      dewt: '12345678',
      role: 'ADMIN',
      createAt: new Date(),
      updateAt: new Date(),
    },
  });
  const murky = await prisma.user.upsert({
    where: { email: 'murky@gmail.com' },
    update: {},
    create: {
      email: 'murky@gmail.com',
      name: 'murky',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10)),
      dewt: '12345678',
      role: 'ENGINEER',
      createAt: new Date(),
      updateAt: new Date(),
    },
  });
  const kyaru = await prisma.user.upsert({
    where: { email: 'kyaru@gmail.com' },
    update: {},
    create: {
      email: 'kyaru@gmail.com',
      name: 'kyaru',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10)),
      dewt: '12345678',
      role: 'INTERN',
      createAt: new Date(),
      updateAt: new Date(),
    },
  });

  console.log(tiny, murky, kyaru);
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
