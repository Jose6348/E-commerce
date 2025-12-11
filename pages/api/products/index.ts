import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';
import { requireAuth } from '../../../lib/auth';
import { productSchema } from '../../../lib/validators';
import { Role } from '@prisma/client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { search, category } = req.query;
    const products = await prisma.product.findMany({
      where: {
        active: true,
        name: search ? { contains: String(search), mode: 'insensitive' } : undefined,
        category: category ? { slug: String(category) } : undefined,
      },
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    });
    return res.status(200).json(products);
  }

  if (req.method === 'POST') {
    const auth = await requireAuth(req, res, [Role.ADMIN]);
    if (!auth) return;
    const parse = productSchema.safeParse({
      ...req.body,
      price: Number(req.body.price),
      stock: Number(req.body.stock),
      categoryId: Number(req.body.categoryId),
      active: req.body.active ?? true,
    });
    if (!parse.success) return res.status(400).json({ error: parse.error.flatten() });
    const product = await prisma.product.create({ data: parse.data });
    return res.status(201).json(product);
  }

  res.status(405).end();
}
