import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';
import { requireAuth } from '../../../lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const auth = await requireAuth(req, res);
  if (!auth) return;

  if (req.method === 'GET') {
    const cart = await prisma.cart.findUnique({
      where: { userId: auth.id },
      include: { items: { include: { product: true } } },
    });
    return res.status(200).json(cart);
  }

  if (req.method === 'POST') {
    const { productId, quantity } = req.body;
    const pid = Number(productId);
    const qty = Number(quantity) || 1;
    const product = await prisma.product.findUnique({ where: { id: pid } });
    if (!product) return res.status(404).json({ error: 'Product not found' });

    const cart = await prisma.cart.upsert({
      where: { userId: auth.id },
      update: {},
      create: { userId: auth.id },
    });

    const item = await prisma.cartItem.upsert({
      where: { cartId_productId: { cartId: cart.id, productId: pid } },
      update: { quantity: { increment: qty } },
      create: { cartId: cart.id, productId: pid, quantity: qty },
    });
    const updated = await prisma.cart.findUnique({
      where: { id: cart.id },
      include: { items: { include: { product: true } } },
    });
    return res.status(200).json(updated);
  }

  if (req.method === 'PUT') {
    const { productId, quantity } = req.body;
    const pid = Number(productId);
    const qty = Number(quantity);
    if (qty <= 0) return res.status(400).json({ error: 'Quantity must be positive' });
    const cart = await prisma.cart.findUnique({ where: { userId: auth.id } });
    if (!cart) return res.status(404).json({ error: 'Cart not found' });

    await prisma.cartItem.update({
      where: { cartId_productId: { cartId: cart.id, productId: pid } },
      data: { quantity: qty },
    });
    const updated = await prisma.cart.findUnique({
      where: { id: cart.id },
      include: { items: { include: { product: true } } },
    });
    return res.status(200).json(updated);
  }

  if (req.method === 'DELETE') {
    const { productId } = req.body;
    const pid = Number(productId);
    const cart = await prisma.cart.findUnique({ where: { userId: auth.id } });
    if (!cart) return res.status(404).json({ error: 'Cart not found' });
    await prisma.cartItem.delete({ where: { cartId_productId: { cartId: cart.id, productId: pid } } });
    const updated = await prisma.cart.findUnique({
      where: { id: cart.id },
      include: { items: { include: { product: true } } },
    });
    return res.status(200).json(updated);
  }

  res.status(405).end();
}
