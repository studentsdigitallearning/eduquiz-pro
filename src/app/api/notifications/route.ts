import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { toCamelCase } from '@/lib/utils';

export async function GET() {
  try {
    // Fetch active notifications where expiry is null or in the future
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('is_active', true)
      .or('expiry_date.is.null,expiry_date.gte.' + new Date().toISOString())
      .order('priority', { ascending: false })
      .order('published_date', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(toCamelCase(data));
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 });
  }
}
