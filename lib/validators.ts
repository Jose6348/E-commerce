import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const productSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().min(5),
  price: z.number().positive(),
  stock: z.number().int().nonnegative(),
  categoryId: z.number().int(),
  imageUrl: z.string().url(),
  active: z.boolean().optional(),
});

export const categorySchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
});

export const addressSchema = z.object({
  street: z.string().min(3),
  city: z.string().min(2),
  state: z.string().min(2),
  postal: z.string().min(3),
  country: z.string().min(2),
});
