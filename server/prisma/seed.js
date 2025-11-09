const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Products
  const products = [
    { title: 'Aurora Hoodie', description: 'Soft cotton hoodie', price: 59.99, imageUrl: '/images/hoodie.jpg' },
    { title: 'Nebula Tee', description: 'Graphic tee', price: 24.99, imageUrl: '/images/tee.jpg' },
    { title: 'Cosmos Cap', description: 'Adjustable cap', price: 19.99, imageUrl: '/images/cap.jpg' },
  ];
  for (const p of products) {
    await prisma.product.upsert({ where: { title: p.title }, update: {}, create: p });
  }

  // Gift Cards
  await prisma.giftCard.upsert({
    where: { code: 'GFT-DEMO100' },
    update: { balance: 100, active: true },
    create: { code: 'GFT-DEMO100', initialAmount: 100, balance: 100, active: true },
  });
  await prisma.giftCard.upsert({
    where: { code: 'GFT-START50' },
    update: { balance: 50, active: true },
    create: { code: 'GFT-START50', initialAmount: 50, balance: 50, active: true },
  });

  // Promos
  await prisma.promo.upsert({
    where: { code: 'WELCOME10' },
    update: { active: true },
    create: { code: 'WELCOME10', type: 'PERCENT', amount: 10, active: true },
  });
  await prisma.promo.upsert({
    where: { code: 'FLAT5' },
    update: { active: true },
    create: { code: 'FLAT5', type: 'FLAT', amount: 5, active: true },
  });

  console.log('Seed completed');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});

