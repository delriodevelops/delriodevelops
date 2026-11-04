import { NextResponse } from 'next/server';
import { createRemoteJWKSet, jwtVerify } from 'jose';
import { listChats } from '../../../../lib/chat-log';

export const dynamic = 'force-dynamic';

const PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
// Same account AuthContext lets into /admin
const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'iamdelrioo@gmail.com';
const FIREBASE_KEYS = createRemoteJWKSet(
  new URL('https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com')
);

/** True when the request carries the admin's Firebase ID token. */
async function isAdmin(req) {
  const token = req.headers.get('authorization')?.replace(/^Bearer /, '');
  if (!token || !PROJECT_ID) return false;
  try {
    const { payload } = await jwtVerify(token, FIREBASE_KEYS, {
      issuer: `https://securetoken.google.com/${PROJECT_ID}`,
      audience: PROJECT_ID,
    });
    return payload.email === ADMIN_EMAIL && payload.email_verified === true;
  } catch {
    return false;
  }
}

/** The assistant's question log, newest first, for the admin dashboard. */
export async function GET(req) {
  if (!(await isAdmin(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { searchParams } = new URL(req.url);
  const before = Number(searchParams.get('before')) || undefined;
  const chats = await listChats({ limit: 50, before });
  return NextResponse.json({ chats });
}
