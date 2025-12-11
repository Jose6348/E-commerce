import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';
import { requireAuth } from '../../../lib/auth';
import { productSchema } from '../../../lib/validators';
import { Role } from '@prisma/client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const id = Number(req.query.id);
  if (Number.isNaN(id)) return res.status(400).json({ error: 'Invalid id' });

  if (req.method === 'GET') {
    const product = await prisma.product.findUnique({ where: { id }, include: { category: true } });
    if (!product) return res.status(404).json({ error: 'Not found' });
    return res.status(200).json(product);
  }

  const auth = await requireAuth(req, res, [Role.ADMIN]);
  if (!auth) return;

  if (req.method === 'PUT') {
    const parse = productSchema.partial().safeParse({
      ...req.body,
      price: req.body.price !== undefined ? Number(req.body.price) : undefined,
      stock: req.body.stock !== undefined ? Number(req.body.stock) : undefined,
      categoryId: req.body.categoryId !== undefined ? Number(req.body.categoryId) : undefined,
    });
    if (!parse.success) return res.status(400).json({ error: parse.error.flatten() });
    const product = await prisma.product.update({ where: { id }, data: parse.data });
    return res.status(200).json(product);
  }

  if (req.method === 'DELETE') {
    await prisma.product.delete({ where: { id } });
    return res.status(204).end();
  }

  res.status(405).end();
}
