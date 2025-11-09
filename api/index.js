// Vercel Serverless Function handler that proxies requests to Fastify
const { buildApp } = require('../server/src/app');
const app = buildApp();

module.exports = async (req, res) => {
  try {
    await app.ready();
    app.server.emit('request', req, res);
  } catch (err) {
    try {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'Serverless handler error', details: String(err && err.message || err) }));
    } catch {}
  }
};

