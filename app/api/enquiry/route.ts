import { NextResponse } from 'next/server';
// import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const required = ['name', 'email', 'phone', 'city', 'property_type', 'requirement'];
    for (const f of required) {
      if (!body[f]) return NextResponse.json({ error: `${f} is required` }, { status: 400 });
    }

    // Production: save to Supabase
    // const { error } = await supabase.from('enquiries').insert({ ...body, created_at: new Date().toISOString() });
    // if (error) throw error;

    // TODO: send email notification
    console.log('New enquiry:', body.name, body.email, body.company);

    return NextResponse.json({ success: true, message: 'Enquiry received successfully' });
  } catch (e) {
    console.error('Enquiry error:', e);
    return NextResponse.json({ error: 'Failed to submit enquiry' }, { status: 500 });
  }
}
