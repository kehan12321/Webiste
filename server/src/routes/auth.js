const bcrypt = require('bcryptjs');
const jsonwebtoken = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const JWT_SECRET = process.env.JWT_SECRET || 'dev_super_secret_change_me';

const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = Number(process.env.SMTP_PORT || 587);
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const SMTP_FROM = process.env.SMTP_FROM || 'no-reply@localhost';

function createTransporter() {
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) return null;
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
}

module.exports = async function (fastify) {
  const { prisma } = fastify;

  const ALLOWED_EMAIL_DOMAINS = (process.env.ALLOWED_EMAIL_DOMAINS || '')
    .split(',')
    .map(s => s.trim().toLowerCase())
    .filter(Boolean);

  const isValidEmail = (email) => {
    if (typeof email !== 'string') return false;
    const ok = /[^\s@]+@[^\s@]+\.[^\s@]+/.test(email);
    if (!ok) return false;
    if (ALLOWED_EMAIL_DOMAINS.length) {
      const domain = email.split('@')[1]?.toLowerCase();
      return ALLOWED_EMAIL_DOMAINS.includes(domain);
    }
    return true;
  };

  fastify.post('/register', async (request, reply) => {
    const { email, password, name } = request.body || {};
    if (!email || !password) {
      return reply.code(400).send({ error: 'Email and password required' });
    }
    if (!isValidEmail(email)) {
      return reply.code(400).send({ error: 'Enter a valid email (e.g., name@gmail.com)' });
    }
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return reply.code(400).send({ error: 'Email already registered' });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({ data: { email, name: name || '', passwordHash } });
    const token = jsonwebtoken.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
    return { token, user: { id: user.id, email: user.email, name: user.name } };
  });

  fastify.post('/login', async (request, reply) => {
    const { email, password } = request.body || {};
    if (!email || !password) {
      return reply.code(400).send({ error: 'Email and password required' });
    }
    if (!isValidEmail(email)) {
      return reply.code(400).send({ error: 'Enter a valid email (e.g., name@outlook.com)' });
    }
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return reply.code(401).send({ error: 'Invalid credentials' });
    }
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      return reply.code(401).send({ error: 'Invalid credentials' });
    }
    const token = jsonwebtoken.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
    return { token, user: { id: user.id, email: user.email, name: user.name } };
  });

  fastify.get('/me', { preValidation: [fastify.authenticate] }, async (request) => {
    const userId = request.user.userId;
    const user = await prisma.user.findUnique({ where: { id: userId } });
    const hasPaidOrder = !!(await prisma.order.findFirst({ where: { userId, status: 'PAID' } }));
    return { id: user.id, email: user.email, name: user.name, hasPaidOrder };
  });

  // Email OTP: start
  fastify.post('/email/start', async (request, reply) => {
    const { email } = request.body || {};
    if (!isValidEmail(email)) return reply.code(400).send({ error: 'Valid email required' });

    const code = String(Math.floor(100000 + Math.random() * 900000));
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await prisma.loginCode.create({ data: { email, code, expiresAt } });

    const transporter = createTransporter();
    if (transporter) {
      try {
        await transporter.sendMail({
          from: SMTP_FROM,
          to: email,
          subject: 'Your Zaliant verification code',
          text: `Your verification code is ${code}. It expires in 10 minutes.`,
          html: `<p>Your verification code is <strong>${code}</strong>.</p><p>It expires in 10 minutes.</p>`,
        });
        return reply.send({ ok: true });
      } catch (err) {
        fastify.log.error({ err }, 'Failed to send email');
        // Fall through to dev mode response
      }
    }
    // Dev fallback if SMTP not configured: return code for testing
    return reply.send({ ok: true, devCode: code });
  });

  // Email OTP: verify
  fastify.post('/email/verify', async (request, reply) => {
    const { email, code } = request.body || {};
    if (!email || !code) return reply.code(400).send({ error: 'Email and code required' });
    if (!isValidEmail(email)) return reply.code(400).send({ error: 'Valid email required' });

    const now = new Date();
    const match = await prisma.loginCode.findFirst({ where: { email, code, used: false, expiresAt: { gt: now } }, orderBy: { createdAt: 'desc' } });
    if (!match) return reply.code(400).send({ error: 'Invalid or expired code' });

    // mark used
    await prisma.loginCode.update({ where: { id: match.id }, data: { used: true } });

    // ensure user exists
    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      user = await prisma.user.create({ data: { email, name: '', passwordHash: '' } });
    }

    const token = jsonwebtoken.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
    const hasPaidOrder = !!(await prisma.order.findFirst({ where: { userId: user.id, status: 'PAID' } }));
    return { token, user: { id: user.id, email: user.email, name: user.name }, hasPaidOrder };
  });
};
