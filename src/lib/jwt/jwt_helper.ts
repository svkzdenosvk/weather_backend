import * as jwt from 'jsonwebtoken';

const SHORT_SECRET = process.env.JWT_SHORT_SECRET!;
const LONG_SECRET = process.env.JWT_LONG_SECRET!;
const SHORT_EXPIRES = '15m';
const LONG_EXPIRES = '7d';

export function signShortToken(
  id: string,
  username: string,
  role: string,
): string {
  return jwt.sign({ id, username, role }, SHORT_SECRET ?? '', {
    expiresIn: SHORT_EXPIRES,
  });
}

export function signLongToken(id: string): string {
  return jwt.sign({ id }, LONG_SECRET, { expiresIn: LONG_EXPIRES });
}

export function verifyShortToken(
  token: string,
): { id: string; username: string; role: string } | null {
  try {
    return jwt.verify(token, SHORT_SECRET) as {
      id: string;
      username: string;
      role: string;
    };
  } catch {
    return null;
  }
}

export function verifyLongToken(token: string): { id: string } | null {
  try {
    return jwt.verify(token, LONG_SECRET) as { id: string };
  } catch {
    return null;
  }
}
