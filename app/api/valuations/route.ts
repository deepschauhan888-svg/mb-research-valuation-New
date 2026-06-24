import { NextResponse } from 'next/server';
// import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // Production: fetch from Supabase
    // const { data, error } = await supabase.from('valuations').select('*').order('created_at', { ascending: false });
    // if (error) throw error;
    // return NextResponse.json(data);
    return NextResponse.json({ message: 'Connect Supabase to fetch live data. Demo data is loaded from store.' });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch valuations' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // Production: insert to Supabase
    // const { data, error } = await supabase.from('valuations').insert(body).select();
    // if (error) throw error;
    // return NextResponse.json(data);
    return NextResponse.json({ success: true, message: 'Received. Connect Supabase to persist.', data: body });
  } catch {
    return NextResponse.json({ error: 'Failed to save valuation' }, { status: 500 });
  }
}
