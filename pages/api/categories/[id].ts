import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';
import { categorySchema } from '../../../lib/validators';
import { requireAuth } from '../../../lib/auth';
import { Role } from '@prisma/client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const id = Number(req.query.id);
  if (Number.isNaN(id)) return res.status(400).json({ error: 'Invalid id' });

  if (req.method === 'PUT') {
    const auth = await requireAuth(req, res, [Role.ADMIN]);
    if (!auth) return;
    const parse = categorySchema.safeParse(req.body);
    if (!parse.success) return res.status(400).json({ error: parse.error.flatten() });
    const category = await prisma.category.update({ where: { id }, data: parse.data });
    return res.status(200).json(category);
  }

  if (req.method === 'DELETE') {
    const auth = await requireAuth(req, res, [Role.ADMIN]);
    if (!auth) return;
    await prisma.category.delete({ where: { id } });
    return res.status(204).end();
  }

  res.status(405).end();
}
