import { SignJWT, jwtVerify, JWTPayload } from 'jose';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

const secretKey = process.env.JWT_SECRET || 'fallback-secret-for-development-change-me';
const encodedKey = new TextEncoder().encode(secretKey);

export async function encrypt(payload: JWTPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1d') // Token expires in 1 day
    .sign(encodedKey);
}

export async function decrypt(token: string) {
  try {
    const { payload } = await jwtVerify(token, encodedKey, {
      algorithms: ['HS256'],
    });
    return payload;
  } catch {
    return null;
  }
}

export async function getSession() {
  const session = cookies().get('admin_token')?.value;
  if (!session) return null;
  return await decrypt(session);
}

export async function updateSession(request: NextRequest) {
  const session = request.cookies.get('admin_token')?.value;
  if (!session) return;

  const parsed = await decrypt(session);
  if (!parsed) return;

  // Extend token by issuing a new one (Optional rolling sessions)
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 1d
  const newToken = await encrypt(parsed);
  return { newToken, expires };
}
