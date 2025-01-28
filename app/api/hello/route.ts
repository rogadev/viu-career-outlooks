import { NextResponse } from "next/server";

export async function GET(request: Request) {
  console.table(request);
  return NextResponse.json({ message: "Hello, world!" });
}

export async function POST(request: Request) {
  const body = await request.json();
  return NextResponse.json({ received: body });
}
