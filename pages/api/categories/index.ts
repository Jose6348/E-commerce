import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';
import { categorySchema } from '../../../lib/validators';
import { requireAuth } from '../../../lib/auth';
import { Role } from '@prisma/client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } });
    return res.status(200).json(categories);
  }

  const auth = await requireAuth(req, res, [Role.ADMIN]);
  if (!auth) return;

  if (req.method === 'POST') {
    const parse = categorySchema.safeParse(req.body);
    if (!parse.success) return res.status(400).json({ error: parse.error.flatten() });
    const category = await prisma.category.create({ data: parse.data });
    return res.status(201).json(category);
  }

  res.status(405).end();
}
