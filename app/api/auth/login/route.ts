import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    // In production: use Supabase Auth
    // const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    const DEMO = [
      { email: 'analyst@mbresearch.in', password: 'mbresearch2025' },
      { email: 'admin@mbresearch.in',   password: 'admin2025' },
      { email: 'deep@mbresearch.in',    password: 'deep2025' },
    ];
    const valid = DEMO.find(u => u.email === email && u.password === password);
    if (!valid) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    return NextResponse.json({ success: true, email });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
