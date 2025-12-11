import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';
import { requireAuth } from '../../../lib/auth';
import { Role } from '@prisma/client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const auth = await requireAuth(req, res, [Role.ADMIN]);
  if (!auth) return;
  const revenueAgg = await prisma.order.aggregate({ _sum: { total: true } });
  const totalOrders = await prisma.order.count();
  const totalCustomers = await prisma.user.count({ where: { role: Role.CUSTOMER } });
  const bestSelling = await prisma.orderItem.groupBy({
    by: ['productId'],
    _sum: { quantity: true },
    orderBy: { _sum: { quantity: 'desc' } },
    take: 5,
  });
  const productIds = bestSelling.map((b) => b.productId);
  const products = await prisma.product.findMany({ where: { id: { in: productIds } } });
  const bestProducts = bestSelling.map((b) => ({
    product: products.find((p) => p.id === b.productId),
    quantity: b._sum.quantity,
  }));

  return res.status(200).json({
    revenue: revenueAgg._sum.total ?? 0,
    totalOrders,
    totalCustomers,
    bestProducts,
  });
}
