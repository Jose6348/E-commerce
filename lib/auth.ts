import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { Role, User } from '@prisma/client';
import { prisma } from './prisma';
import { serialize } from 'cookie';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';
const COOKIE_NAME = 'ecom_token';

export interface AuthPayload {
  id: number;
  email: string;
  role: Role;
  name: string;
}

export function signToken(payload: AuthPayload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token?: string): AuthPayload | null {
  if (!token) return null;
  try {
    return jwt.verify(token, JWT_SECRET) as AuthPayload;
  } catch (e) {
    return null;
  }
}

export function setAuthCookie(res: NextApiResponse, token: string) {
  res.setHeader(
    'Set-Cookie',
    serialize(COOKIE_NAME, token, {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    })
  );
}

export function clearAuthCookie(res: NextApiResponse) {
  res.setHeader(
    'Set-Cookie',
    serialize(COOKIE_NAME, '', {
      httpOnly: true,
      path: '/',
      expires: new Date(0),
    })
  );
}

export function getTokenFromReq(req: NextApiRequest) {
  const bearer = req.headers.authorization?.replace('Bearer ', '');
  const cookieToken = req.cookies[COOKIE_NAME];
  return bearer || cookieToken;
}

export async function requireAuth(req: NextApiRequest, res: NextApiResponse, roles?: Role[]) {
  const token = getTokenFromReq(req);
  const payload = verifyToken(token);
  if (!payload) {
    res.status(401).json({ error: 'Unauthorized' });
    return null;
  }
  if (roles && !roles.includes(payload.role)) {
    res.status(403).json({ error: 'Forbidden' });
    return null;
  }
  return payload;
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function comparePassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export async function getUserWithCart(userId: number) {
  return prisma.user.findUnique({
    where: { id: userId },
    include: {
      cart: { include: { items: { include: { product: true } } } },
    },
  });
}
