module.exports = async function (fastify) {
  const { prisma } = fastify;

  fastify.post('/giftcards/purchase', async (request, reply) => {
    const { amount, email } = request.body || {};
    const amt = Number(amount || 0);
    if (!amt || amt <= 0) return reply.code(400).send({ error: 'Amount required' });
    // Generate simple code
    const code = 'GFT-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    const gift = await prisma.giftCard.create({
      data: { code, initialAmount: amt, balance: amt, active: true, recipientEmail: email || null },
    });
    return gift;
  });

  fastify.post('/giftcards/apply', async (request, reply) => {
    const { code } = request.body || {};
    if (!code) return reply.code(400).send({ error: 'Code required' });
    const gift = await prisma.giftCard.findFirst({
      where: { code: { equals: code, mode: 'insensitive' }, active: true },
    });
    if (!gift) return reply.code(404).send({ error: 'Invalid or inactive gift card' });
    return { code: gift.code, balance: gift.balance };
  });

  fastify.get('/giftcards/:code', async (request, reply) => {
    const { code } = request.params;
    const gift = await prisma.giftCard.findFirst({
      where: { code: { equals: code, mode: 'insensitive' } },
    });
    if (!gift) return reply.code(404).send({ error: 'Not found' });
    return gift;
  });
};

