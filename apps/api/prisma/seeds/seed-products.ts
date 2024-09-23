import {
  PrismaClient,
  Role,
  PaymentStatus,
  DiscountType,
} from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  // Create a user
  const user = await prisma.user.create({
    data: {
      username: faker.internet.userName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      isVerified: true,
      role: Role.USER,
    },
  });

  // Create a province
  const province = await prisma.province.create({
    data: {
      id: faker.number.int({ min: 1, max: 100 }),
      name: faker.location.state(),
    },
  });

  // Create a city
  const city = await prisma.city.create({
    data: {
      name: faker.location.city(),
      provinceId: province.id,
    },
  });

  // Create a warehouse
  const warehouse = await prisma.warehouse.create({
    data: {
      name: faker.company.name(),
      address: faker.location.streetAddress(),
      provinceId: province.id,
      cityId: city.id,
      postalCode: faker.location.zipCode(),
      latitude: faker.location.latitude(),
      longitude: faker.location.longitude(),
      storeRadius: faker.number.float({ min: 1, max: 10 }),
      userId: user.id,
    },
  });

  // Create a category
  const category = await prisma.category.create({
    data: {
      slug: 'test-order-8',
      name: 'Test Order 08',
    },
  });

  // Create some products
  const products = await Promise.all(
    Array.from({ length: 5 }).map(() =>
      prisma.product.create({
        data: {
          slug: faker.helpers.slugify(faker.commerce.productName()),
          name: faker.commerce.productName(),
          description: faker.commerce.productDescription(),
          price: parseFloat(faker.commerce.price()),
          categoryId: category.id,
        },
      }),
    ),
  );

  // Create product stocks
  await Promise.all(
    products.map((product) =>
      prisma.productStock.create({
        data: {
          productId: product.id,
          warehouseId: warehouse.id,
          stock: faker.number.int({ min: 10, max: 100 }),
        },
      }),
    ),
  );

  // Create an address
  const address = await prisma.address.create({
    data: {
      name: faker.person.fullName(),
      address: faker.location.streetAddress(),
      provinceId: province.id,
      cityId: city.id,
      postalCode: faker.location.zipCode(),
      isPrimary: true,
      userId: user.id,
      latitude: faker.location.latitude(),
      longitude: faker.location.longitude(),
    },
  });

  // Create a cart
  const cart = await prisma.cart.create({
    data: {
      userId: user.id,
      isActive: true,
    },
  });

  // Add items to the cart
  await Promise.all(
    products.slice(0, 2).map((product) =>
      prisma.cartItem.create({
        data: {
          quantity: faker.number.int({ min: 1, max: 5 }),
          productId: product.id,
          cartId: cart.id,
        },
      }),
    ),
  );

  // Create a voucher
  const voucher = await prisma.voucher.create({
    data: {
      code: faker.string.alphanumeric(8).toUpperCase(),
      discountType: DiscountType.PERCENTAGE,
      discountValue: faker.number.int({ min: 5, max: 20 }),
      minPurchase: faker.number.float({ min: 50, max: 100 }),
      maxDiscount: faker.number.float({ min: 20, max: 50 }),
      expiryDate: faker.date.future(),
    },
  });

  console.log(`Database has been seeded. 🌱`);
  console.log(`Created user with id: ${user.id}`);
  console.log(`Created warehouse with id: ${warehouse.id}`);
  console.log(`Created ${products.length} products`);
  console.log(`Created address with id: ${address.id}`);
  console.log(`Created cart with id: ${cart.id}`);
  console.log(`Created voucher with id: ${voucher.id}`);

  console.log(
    '\nUse these IDs to test the handleCheckout function in Postman:',
  );
  console.log(`User ID: ${user.id}`);
  console.log(`Warehouse ID: ${warehouse.id}`);
  console.log(`Cart ID: ${cart.id}`);
  console.log(`Address ID: ${address.id}`);
  console.log(`Voucher ID: ${voucher.id}`);
  console.log('Product IDs:');
  products.forEach((product) => console.log(`- ${product.id}`));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
