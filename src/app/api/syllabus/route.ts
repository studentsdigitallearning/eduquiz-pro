import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { toCamelCase } from '@/lib/utils';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('courseId');

    if (!courseId) {
      return NextResponse.json(
        { error: 'courseId query parameter is required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('syllabus')
      .select('*')
      .eq('course_id', courseId)
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(toCamelCase(data));
  } catch (error) {
    console.error('Error fetching syllabus:', error);
    return NextResponse.json({ error: 'Failed to fetch syllabus' }, { status: 500 });
  }
}
