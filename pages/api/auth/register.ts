import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';
import { hashPassword, signToken, setAuthCookie } from '../../../lib/auth';
import { registerSchema } from '../../../lib/validators';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const parse = registerSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.flatten() });
  const { email, password, name } = parse.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return res.status(400).json({ error: 'Email already registered' });

  const hashed = await hashPassword(password);
  const user = await prisma.user.create({
    data: { email, password: hashed, name, cart: { create: {} } },
  });
  const token = signToken({ id: user.id, email: user.email, role: user.role, name: user.name });
  setAuthCookie(res, token);
  return res.status(201).json({ user: { id: user.id, email: user.email, role: user.role, name: user.name } });
}
