import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
 
export async function POST() {
  cookies().set('rational-religion-profile-complete', 'true', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 365, // 1 year
    path: '/',
  });
 
  return NextResponse.json({ success: true });
}
