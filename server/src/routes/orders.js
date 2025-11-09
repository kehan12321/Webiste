module.exports = async function (fastify) {
  const { prisma } = fastify;

  fastify.post('/orders', async (request, reply) => {
    const { items, subtotal, giftCardCode, promoCode, userId } = request.body || {};
    const sub = Number(subtotal || 0);
    if (!Array.isArray(items) || items.length === 0) return reply.code(400).send({ error: 'Items required' });

    // Gift card handling
    let giftApplied = 0;
    let giftCard = null;
    if (giftCardCode) {
      giftCard = await prisma.giftCard.findFirst({ where: { code: { equals: giftCardCode, mode: 'insensitive' }, active: true } });
      if (giftCard) {
        giftApplied = Math.min(sub, giftCard.balance);
      }
    }

    // Promo handling
    let discount = 0;
    if (promoCode) {
      const promo = await prisma.promo.findFirst({ where: { code: { equals: promoCode, mode: 'insensitive' }, active: true } });
      if (promo) {
        if (promo.type === 'PERCENT') discount = (promo.amount / 100) * sub;
        if (promo.type === 'FLAT') discount = promo.amount;
      }
    }

    const total = Math.max(0, sub - giftApplied - discount);

    const order = await prisma.order.create({
      data: {
        userId: userId || null,
        status: 'PENDING',
        subtotal: sub,
        giftApplied,
        discount,
        total,
        items: {
          create: items.map((it) => ({ productId: it.productId, quantity: it.quantity, price: it.price })),
        },
      },
      include: { items: true },
    });

    // Deduct gift card balance
    if (giftCard && giftApplied > 0) {
      await prisma.giftCard.update({ where: { id: giftCard.id }, data: { balance: giftCard.balance - giftApplied } });
    }

    return order;
  });

  fastify.get('/orders', { preValidation: [fastify.authenticate] }, async (request) => {
    const userId = request.user.userId;
    return prisma.order.findMany({ where: { userId }, include: { items: true } });
  });
};

