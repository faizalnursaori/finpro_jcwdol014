import {
  PrismaClient,
  Role,
  PaymentStatus,
  DiscountType,
} from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

const categories = [
  { name: 'Beras', slug: 'beras', id:1 },
  { name: 'Gula', slug: 'gula', id:2 },
  { name: 'Minyak Goreng', slug: 'minyak-goreng', id:3 },
  { name: 'Telur', slug: 'telur', id:4 },
  { name: 'Daging Ayam', slug: 'daging-ayam', id:5 },
  { name: 'Daging Sapi', slug: 'daging-sapi' },
  { name: 'Ikan', slug: 'ikan',id:6 },
  { name: 'Susu', slug: 'susu', id:7 },
  { name: 'Tepung Terigu', slug: 'tepung-terigu', id:8 },
  { name: 'Kacang-kacangan', slug: 'kacang-kacangan', id:9 },
  { name: 'Sayuran', slug: 'sayuran', id: 10 },
  { name: 'Buah-buahan', slug: 'buah-buahan', id:11 },
  { name: 'Garam', slug: 'garam', id:12 },
  { name: 'Bumbu Dapur', slug: 'bumbu-dapur', id:13 },
  { name: 'Mie Instan', slug: 'mie-instan', id:14 },
];

const products = [
  {
    name: 'Beras Pandan Wangi',
    slug: 'beras-pandan-wangi',
    description: 'Beras premium dengan aroma pandan',
    price: 15000,
    categoryId: 3,
    categorySlug: 'beras',
  },
  {
    name: 'Beras IR64',
    slug: 'beras-ir64',
    description: 'Beras pulen untuk konsumsi sehari-hari',
    price: 12000,
    categoryId: 3,
    categorySlug: 'beras',
  },
  {
    name: 'Beras Merah',
    slug: 'beras-merah',
    description: 'Beras merah kaya serat',
    price: 18000,
    categoryId: 3,
    categorySlug: 'beras',
  },

  // Gula
  {
    name: 'Gula Pasir',
    slug: 'gula-pasir',
    description: 'Gula pasir halus',
    price: 12500,
    categoryId: 7,
    categorySlug: 'gula'
  },
  {
    name: 'Gula Merah',
    slug: 'gula-merah',
    description: 'Gula merah alami',
    price: 15000,
    categoryId: 7,
    categorySlug: 'gula'
  },
  {
    name: 'Gula Diet',
    slug: 'gula-diet',
    description: 'Gula rendah kalori untuk diet',
    price: 20000,
    categoryId: 7,
    categorySlug: 'gula'
  },

  // Minyak Goreng
  {
    name: 'Minyak Goreng Sawit',
    slug: 'minyak-goreng-sawit',
    description: 'Minyak goreng dari kelapa sawit',
    price: 14000,
    categoryId: 4,
    categorySlug: 'minyak-goreng'
  },
  {
    name: 'Minyak Goreng Jagung',
    slug: 'minyak-goreng-jagung',
    description: 'Minyak goreng dari jagung',
    price: 18000,
    categoryId: 4,
    categorySlug: 'minyak-goreng'
  },
  {
    name: 'Minyak Zaitun',
    slug: 'minyak-zaitun',
    description: 'Minyak zaitun extra virgin',
    price: 50000,
    categoryId: 4,
    categorySlug: 'minyak-goreng'
  },

  // Telur
  {
    name: 'Telur Ayam',
    slug: 'telur-ayam',
    description: 'Telur ayam segar',
    price: 25000,
    categoryId: 5,
    categorySlug: 'telur'
  },
  {
    name: 'Telur Bebek',
    slug: 'telur-bebek',
    description: 'Telur bebek untuk masakan',
    price: 30000,
    categoryId: 5,
    categorySlug: 'telur'
  },
  {
    name: 'Telur Puyuh',
    slug: 'telur-puyuh',
    description: 'Telur puyuh segar',
    price: 15000,
    categoryId: 5,
    categorySlug: 'telur'
  },

];

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


  // Create categories
  // const createdCategories = await Promise.all(
  //   categories.map((category) =>
  //     prisma.category.create({
  //       data: {
  //         slug: category.slug,
  //         name: category.name,
  //       },
  //     })
  //   )
  // );

  // Create products
  const createdProducts = await Promise.all(
    products.map((product) =>
      prisma.product.create({
        data: {
          slug: product.slug,
          name: product.name,
          description: product.description,
          price: product.price,
          category: {
            connect: {
              slug: product.categorySlug,
            },
          },
        },
      })
    )
  );

  // Create product stocks
  await Promise.all(
    createdProducts.map((product) =>
      prisma.productStock.create({
        data: {
          productId: product.id,
          warehouseId: 1,
          stock: faker.number.int({ min: 10, max: 100 }),
        },
      })
    )
  );


  // Create a voucher
  // const voucher = await prisma.voucher.create({
  //   data: {
  //     code: faker.string.alphanumeric(8).toUpperCase(),
  //     discountType: DiscountType.PERCENTAGE,
  //     discountValue: faker.number.int({ min: 5, max: 20 }),
  //     minPurchase: faker.number.float({ min: 50, max: 100 }),
  //     maxDiscount: faker.number.float({ min: 20, max: 50 }),
  //     expiryDate: faker.date.future(),
  //   },
  // });

  console.log(`Database has been seeded. 🌱`);
  console.log(`Created user with id: ${user.id}`);


  console.log(`Created ${createdProducts.length} products`);

  console.log(
    '\nUse these IDs to test the handleCheckout function in Postman:'
  );
  console.log(`User ID: ${user.id}`);
  console.log('Product IDs:');
  createdProducts.forEach((product) => console.log(`- ${product.id}`));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
