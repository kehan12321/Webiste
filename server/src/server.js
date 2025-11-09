const path = require('path');
const fastifyStatic = require('@fastify/static');
const { buildApp } = require('./app');

const fastify = buildApp();

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
