const crypto = require('crypto');

module.exports = async function (fastify) {
  const { prisma } = fastify;

  const SELLHUB_CHECKOUT_BASE = process.env.SELLHUB_CHECKOUT_BASE || 'https://sellhub.example';
  const SELLHUB_WEBHOOK_SECRET = process.env.SELLHUB_WEBHOOK_SECRET || '';
  const SELLHUB_PRODUCTS = {
    'valorant-private': process.env.SELLHUB_PRODUCT_ID_VALO || '',
    'spoofer-permanent': process.env.SELLHUB_PRODUCT_ID_SPOOFER || '',
  };

  // Create hosted checkout link for Sellhub
  fastify.post('/payments/sellhub/checkout', async (request, reply) => {
    const { orderId, productId, planLabel, email } = request.body || {};

    if (!orderId || !productId) {
      return reply.code(400).send({ error: 'orderId and productId required' });
    }

    const externalProductId = SELLHUB_PRODUCTS[productId];
    if (!externalProductId) {
      return reply.code(400).send({ error: 'Unknown product mapping' });
    }

    // Mark order pending while user is at checkout
    await prisma.order.update({ where: { id: Number(orderId) }, data: { status: 'PENDING' } }).catch(() => {});

    // Build a checkout URL. Replace with Sellhub's actual format if different.
    const params = new URLSearchParams({
      product_id: externalProductId,
      custom_order_id: String(orderId),
      plan: planLabel || '',
      email: email || '',
    });

    const checkoutUrl = `${SELLHUB_CHECKOUT_BASE}/checkout?${params.toString()}`;
    return { checkoutUrl };
  });

  // Webhook to confirm payment and fulfill order
  fastify.post('/payments/sellhub/webhook', async (request, reply) => {
    try {
      const payload = request.body || {};
      const signatureHeader = request.headers['x-sellhub-signature'] || request.headers['x-signature'];

      if (!SELLHUB_WEBHOOK_SECRET) {
        return reply.code(500).send({ error: 'Webhook secret not configured' });
      }

      // Compute HMAC SHA256 over raw JSON body
      const computed = crypto
        .createHmac('sha256', SELLHUB_WEBHOOK_SECRET)
        .update(JSON.stringify(payload))
        .digest('hex');

      if (!signatureHeader || signatureHeader !== computed) {
        return reply.code(401).send({ error: 'Invalid signature' });
      }

      const { custom_order_id, status, license_key } = payload;
      if (!custom_order_id) {
        return reply.code(400).send({ error: 'custom_order_id missing' });
      }

      const isPaid = String(status).toUpperCase() === 'PAID' || String(status).toUpperCase() === 'COMPLETED';

      const order = await prisma.order.update({
        where: { id: Number(custom_order_id) },
        data: { status: isPaid ? 'PAID' : 'PENDING' },
      });

      // TODO: Persist license_key in a License table or new column.

      return { ok: true, orderId: order.id, license_key: license_key || null };
    } catch (err) {
      fastify.log.error(err);
      return reply.code(500).send({ error: 'Webhook processing failed' });
    }
  });
};

