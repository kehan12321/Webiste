const fastify = require('fastify')({ logger: true });
const cors = require('@fastify/cors');
const jsonwebtoken = require('jsonwebtoken');
const path = require('path');
const fastifyStatic = require('@fastify/static');

// Register CORS
fastify.register(cors, {
  origin: true,
});

// JWT setup
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

// Prisma plugin
fastify.register(require('./plugins/prisma'));

// Routes
fastify.register(require('./routes/auth'), { prefix: '/api/auth' });
fastify.register(require('./routes/products'), { prefix: '/api' });
fastify.register(require('./routes/giftcards'), { prefix: '/api' });
fastify.register(require('./routes/promos'), { prefix: '/api' });
fastify.register(require('./routes/orders'), { prefix: '/api' });
fastify.register(require('./routes/payments'), { prefix: '/api' });
// Sellhub payments integration
fastify.register(require('./routes/sellhub'), { prefix: '/api' });

// Serve built frontend from dist
fastify.register(fastifyStatic, {
  root: path.join(__dirname, '../../dist'),
  prefix: '/',
});

// Health route
fastify.get('/api/health', async () => ({ status: 'ok' }));

// SPA fallback for non-API routes
fastify.setNotFoundHandler((req, reply) => {
  if (req.raw.url && req.raw.url.startsWith('/api')) {
    reply.code(404).send({ error: 'Not Found' });
  } else {
    reply.sendFile('index.html');
  }
});

const start = async () => {
  try {
    const PORT = process.env.PORT || 3000;
    await fastify.listen({ port: PORT, host: '0.0.0.0' });
    fastify.log.info(`Backend server running on http://localhost:${PORT}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
