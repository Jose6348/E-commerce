import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';
import { requireAuth } from '../../../lib/auth';
import { Role } from '@prisma/client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const id = Number(req.query.id);
  if (Number.isNaN(id)) return res.status(400).json({ error: 'Invalid id' });
  const auth = await requireAuth(req, res);
  if (!auth) return;

  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: { include: { product: true } }, address: true, user: true },
  });
  if (!order) return res.status(404).json({ error: 'Not found' });
  if (auth.role !== Role.ADMIN && order.userId !== auth.id) return res.status(403).json({ error: 'Forbidden' });
  return res.status(200).json(order);
}
