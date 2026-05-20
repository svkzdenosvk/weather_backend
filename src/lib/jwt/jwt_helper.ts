import * as jwt from 'jsonwebtoken';

// const SHORT_SECRET = process.env.JWT_SHORT_SECRET!;
// const LONG_SECRET = process.env.JWT_LONG_SECRET!;
// const SHORT_EXPIRES = '15m';
// const LONG_EXPIRES = '7d';


export function signShortToken(id: string, username: string): string {
  const secret = process.env.JWT_SHORT_SECRET;
  if (!secret) throw new Error('JWT_SHORT_SECRET not set');
  return jwt.sign({ id, username }, secret, { expiresIn: '15m' });
}

export function signLongToken(id: string): string {
  const secret = process.env.JWT_LONG_SECRET;
  if (!secret) throw new Error('JWT_LONG_SECRET not set');
  return jwt.sign({ id }, secret, { expiresIn: '7d' });
}

export function verifyShortToken(token: string): { id: string; username: string } | null {
  try {
    const secret = process.env.JWT_SHORT_SECRET;
    if (!secret) return null;
    return jwt.verify(token, secret) as { id: string; username: string };
  } catch {
    return null;
  }
}

export function verifyLongToken(token: string): { id: string } | null {
  try {
    const secret = process.env.JWT_LONG_SECRET;
    if (!secret) return null;
    return jwt.verify(token, secret) as { id: string };
  } catch {
    return null;
  }
}