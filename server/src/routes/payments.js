module.exports = async function (fastify) {
  const { prisma } = fastify;

  fastify.post('/payments/checkout', async (request) => {
    const { orderId } = request.body || {};
    return { clientSecret: 'stub_client_secret', orderId };
  });

  fastify.post('/payments/webhook', async (request, reply) => {
    const { orderId } = request.body || {};
    if (!orderId) return reply.code(400).send({ error: 'orderId required' });
    const order = await prisma.order.update({ where: { id: orderId }, data: { status: 'PAID' } });
    return { ok: true, order };
  });
};

