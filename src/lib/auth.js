import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || 'kalyan-robotic-hospital-secret-key-2026'
);

export async function signToken(payload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(secret);
}

export async function verifyToken(input) {
  try {
    let token = input;
    
    // If input is a Request object, extract token from cookies
    if (typeof input === 'object' && input.cookies) {
      token = input.cookies.get('admin_session')?.value;
    } else if (typeof input === 'object' && typeof input.get === 'function') {
      // Handle cases where it might be a standard Request or similar
      const cookieHeader = input.headers.get('cookie');
      if (cookieHeader) {
        const cookies = Object.fromEntries(cookieHeader.split('; ').map(c => c.split('=')));
        token = cookies['admin_session'];
      }
    }

    if (!token) return null;
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (err) {
    return null;
  }
}

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_session')?.value;
  if (!token) return null;
  return await verifyToken(token);
}
