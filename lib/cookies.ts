"use server";

import { cookies } from 'next/headers';
import { DEFAULT_ERC, ERC_COOKIE_NAME } from './constants';

export async function getPreferredErc(): Promise<string> {
  const cookieStore = await cookies();
  return cookieStore.get(ERC_COOKIE_NAME)?.value || DEFAULT_ERC;
}

export async function setPreferredErc(erc: string) {
  const cookieStore = await cookies();
  cookieStore.set(ERC_COOKIE_NAME, erc, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 365, // 1 year
  });
}
