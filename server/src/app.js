const fastifyFactory = require('fastify');
const cors = require('@fastify/cors');
const jsonwebtoken = require('jsonwebtoken');

function buildApp() {
  const fastify = fastifyFactory({ logger: true });

  // CORS
  fastify.register(cors, { origin: true });

  // JWT helper
  const JWT_SECRET = process.env.JWT_SECRET || 'dev_super_secret_change_me';
  fastify.decorate('authenticate', async function (request, reply) {
    try {
      const auth = request.headers['authorization'] || '';
      const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
      if (!token) throw new Error('No token');
      const decoded = jsonwebtoken.verify(token, JWT_SECRET);
      request.user = { userId: decoded.userId };
    } catch (err) {
      reply.code(401).send({ error: 'Unauthorized' });
    }
  });

  // Plugins & routes
  fastify.register(require('./plugins/prisma'));
  fastify.register(require('./routes/auth'), { prefix: '/api/auth' });
  fastify.register(require('./routes/products'), { prefix: '/api' });
  fastify.register(require('./routes/giftcards'), { prefix: '/api' });
  fastify.register(require('./routes/promos'), { prefix: '/api' });
  fastify.register(require('./routes/orders'), { prefix: '/api' });
  fastify.register(require('./routes/payments'), { prefix: '/api' });
  fastify.register(require('./routes/sellhub'), { prefix: '/api' });

  // Health
  fastify.get('/api/health', async () => ({ status: 'ok' }));

  // Not found handling (API only in serverless)
  fastify.setNotFoundHandler((req, reply) => {
    if (req.raw.url && req.raw.url.startsWith('/api')) {
      reply.code(404).send({ error: 'Not Found' });
    } else {
      reply.code(404).send({ error: 'Not Found' });
    }
  });

  return fastify;
}

module.exports = { buildApp };

