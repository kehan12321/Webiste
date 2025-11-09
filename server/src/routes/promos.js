module.exports = async function (fastify) {
  const { prisma } = fastify;

  fastify.post('/promos/apply', async (request, reply) => {
    const { code, subtotal } = request.body || {};
    if (!code) return reply.code(400).send({ error: 'Code required' });
    const promo = await prisma.promo.findFirst({ where: { code: { equals: code, mode: 'insensitive' }, active: true } });
    if (!promo) return reply.code(404).send({ error: 'Invalid or inactive promo' });
    const sub = Number(subtotal || 0);
    let discount = 0;
    if (promo.type === 'PERCENT') discount = (promo.amount / 100) * sub;
    if (promo.type === 'FLAT') discount = promo.amount;
    return { code: promo.code, type: promo.type, amount: promo.amount, discount };
  });
};

