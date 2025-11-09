module.exports = async function (fastify) {
  const { prisma } = fastify;

  fastify.get('/products', async () => {
    return prisma.product.findMany();
  });

  fastify.get('/products/:id', async (request, reply) => {
    const id = Number(request.params.id);
    if (Number.isNaN(id)) {
      return reply.code(400).send({ error: 'Invalid product id' });
    }
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) return reply.code(404).send({ error: 'Not found' });
    return product;
  });
};

