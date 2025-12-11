import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';
import { requireAuth } from '../../../lib/auth';
import { addressSchema } from '../../../lib/validators';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  const auth = await requireAuth(req, res);
  if (!auth) return;

  const parse = addressSchema.safeParse(req.body.address);
  if (!parse.success) return res.status(400).json({ error: parse.error.flatten() });
  const address = parse.data;

  const cart = await prisma.cart.findUnique({
    where: { userId: auth.id },
    include: { items: { include: { product: true } } },
  });
  if (!cart || cart.items.length === 0) return res.status(400).json({ error: 'Cart is empty' });

  const createdAddress = await prisma.address.create({ data: { ...address, userId: auth.id } });
  const total = cart.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const order = await prisma.order.create({
    data: {
      userId: auth.id,
      addressId: createdAddress.id,
      total,
      items: {
        create: cart.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.product.price,
        })),
      },
    },
    include: { items: { include: { product: true } }, address: true },
  });

  await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
  return res.status(201).json(order);
}
