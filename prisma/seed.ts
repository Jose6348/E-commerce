import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin',
      password,
      role: Role.ADMIN,
      cart: { create: {} },
    },
  });

  const categories = await prisma.category.createMany({
    data: [
      { name: 'Electronics', slug: 'electronics' },
      { name: 'Clothing', slug: 'clothing' },
      { name: 'Home', slug: 'home' },
    ],
    skipDuplicates: true,
  });

  const electronics = await prisma.category.findUnique({ where: { slug: 'electronics' } });
  const clothing = await prisma.category.findUnique({ where: { slug: 'clothing' } });

  if (electronics && clothing) {
    await prisma.product.createMany({
      data: [
        {
          name: 'Wireless Headphones',
          slug: 'wireless-headphones',
          description: 'Noise canceling over-ear headphones with 30h battery.',
          price: 199.99,
          stock: 25,
          imageUrl: 'https://via.placeholder.com/400x300',
          categoryId: electronics.id,
        },
        {
          name: 'Graphic T-Shirt',
          slug: 'graphic-t-shirt',
          description: 'Soft cotton tee with modern graphic.',
          price: 29.99,
          stock: 50,
          imageUrl: 'https://via.placeholder.com/400x300',
          categoryId: clothing.id,
        },
      ],
      skipDuplicates: true,
    });
  }

  console.log('Seed completed', { admin, categories });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => prisma.$disconnect());
