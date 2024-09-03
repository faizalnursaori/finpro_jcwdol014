import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create or update categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'electronics' },
      update: {},
      create: { name: 'Electronics', slug: 'electronics' },
    }),
    prisma.category.upsert({
      where: { slug: 'clothing' },
      update: {},
      create: { name: 'Clothing', slug: 'clothing' },
    }),
    prisma.category.upsert({
      where: { slug: 'books' },
      update: {},
      create: { name: 'Books', slug: 'books' },
    }),
  ]);

  // Create products (only if they don't exist)
  const products = await Promise.all([
    prisma.product.upsert({
      where: { slug: 'smartphone-x' },
      update: {},
      create: {
        name: 'Smartphone X',
        slug: 'smartphone-x',
        description: 'Latest smartphone with advanced features',
        price: 799.99,
        category: { connect: { id: categories[0].id } },
        productImages: {
          create: [
            {
              name: 'smartphone-x-front.jpg',
              url: '/images/smartphone-x-front.jpg',
            },
            {
              name: 'smartphone-x-back.jpg',
              url: '/images/smartphone-x-back.jpg',
            },
          ],
        },
      },
    }),
    prisma.product.upsert({
      where: { slug: 'classic-t-shirt' },
      update: {},
      create: {
        name: 'Classic T-Shirt',
        slug: 'classic-t-shirt',
        description: 'Comfortable cotton t-shirt for everyday wear',
        price: 19.99,
        category: { connect: { id: categories[1].id } },
        productImages: {
          create: [
            {
              name: 'classic-t-shirt-front.jpg',
              url: '/images/classic-t-shirt-front.jpg',
            },
            {
              name: 'classic-t-shirt-back.jpg',
              url: '/images/classic-t-shirt-back.jpg',
            },
          ],
        },
      },
    }),
    prisma.product.upsert({
      where: { slug: 'the-great-novel' },
      update: {},
      create: {
        name: 'The Great Novel',
        slug: 'the-great-novel',
        description: 'Bestselling fiction novel of the year',
        price: 24.99,
        category: { connect: { id: categories[2].id } },
        productImages: {
          create: [
            {
              name: 'the-great-novel-cover.jpg',
              url: '/images/the-great-novel-cover.jpg',
            },
          ],
        },
      },
    }),
  ]);

  // Create or update mock users
  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: 'john@example.com' },
      update: {},
      create: {
        username: 'john_doe',
        email: 'john@example.com',
        password: 'hashed_password', // In real scenario, ensure this is properly hashed
        isVerified: true,
      },
    }),
    prisma.user.upsert({
      where: { email: 'jane@example.com' },
      update: {},
      create: {
        username: 'jane_smith',
        email: 'jane@example.com',
        password: 'hashed_password', // In real scenario, ensure this is properly hashed
        isVerified: true,
      },
    }),
  ]);

  // Create carts with items (this will create new carts each time the script runs)
  const carts = await Promise.all([
    prisma.cart.create({
      data: {
        userId: users[0].id,
        isActive: true,
        items: {
          create: [
            { quantity: 1, productId: products[0].id },
            { quantity: 2, productId: products[1].id },
          ],
        },
      },
    }),
    prisma.cart.create({
      data: {
        userId: users[1].id,
        isActive: true,
        items: {
          create: [{ quantity: 1, productId: products[2].id }],
        },
      },
    }),
  ]);

  console.log('Mockup data inserted or updated successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
