import { NextResponse } from 'next/server';
import { parseExcel } from '@/lib/excelParser';
// import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 });

    const buffer = await file.arrayBuffer();
    const records = parseExcel(buffer);

    if (records.length === 0) {
      return NextResponse.json({ error: 'No valid records found in file' }, { status: 422 });
    }

    // Production: save to Supabase
    // const { data, error } = await supabase.from('valuations').insert(records).select();
    // if (error) throw error;

    return NextResponse.json({
      success: true,
      count: records.length,
      records,
      message: `Successfully parsed ${records.length} records. Connect Supabase to persist.`,
    });
  } catch (e) {
    console.error('Upload error:', e);
    return NextResponse.json({ error: 'Failed to process file' }, { status: 500 });
  }
}
