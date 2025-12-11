import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';
import { comparePassword, signToken, setAuthCookie, clearAuthCookie } from '../../../lib/auth';
import { loginSchema } from '../../../lib/validators';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const parse = loginSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.flatten() });
  const { email, password } = parse.data;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(400).json({ error: 'Invalid credentials' });
  const valid = await comparePassword(password, user.password);
  if (!valid) return res.status(400).json({ error: 'Invalid credentials' });

  const token = signToken({ id: user.id, email: user.email, role: user.role, name: user.name });
  setAuthCookie(res, token);
  return res.status(200).json({ user: { id: user.id, email: user.email, role: user.role, name: user.name } });
}
