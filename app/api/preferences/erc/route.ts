import { setPreferredErc } from '@/lib/cookies';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { erc } = await request.json();

  if (!erc || typeof erc !== 'string' || erc.length !== 4) {
    return NextResponse.json({ error: 'Invalid ERC' }, { status: 400 });
  }

  await setPreferredErc(erc);

  return NextResponse.json({ success: true });
} 
