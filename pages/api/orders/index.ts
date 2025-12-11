import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';
import { requireAuth } from '../../../lib/auth';
import { Role, OrderStatus } from '@prisma/client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const auth = await requireAuth(req, res, req.method === 'GET' ? undefined : [Role.ADMIN]);
  if (!auth) return;

  if (req.method === 'GET') {
    const filters: any = {};
    if (auth.role !== Role.ADMIN) filters.userId = auth.id;
    if (req.query.status) filters.status = req.query.status as OrderStatus;
    const orders = await prisma.order.findMany({
      where: filters,
      include: { items: { include: { product: true } }, address: true, user: true },
      orderBy: { createdAt: 'desc' },
    });
    return res.status(200).json(orders);
  }

  if (req.method === 'POST') {
    const { orderId, status } = req.body;
    const order = await prisma.order.update({
      where: { id: Number(orderId) },
      data: { status },
      include: { items: { include: { product: true } }, address: true, user: true },
    });
    return res.status(200).json(order);
  }

  res.status(405).end();
}
