import { NextResponse } from 'next/server';
export async function POST(req: Request) {
  const { email, password } = await req.json();
  if (email === 'analyst@mbresearch.in' && password === 'mbresearch2025') {
    return NextResponse.json({ success: true, email });
  }
  return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
}
