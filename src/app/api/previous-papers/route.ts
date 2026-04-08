import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { toCamelCase } from '@/lib/utils';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('courseId');

    let query = supabase
      .from('previous_papers')
      .select('*, subject:subjects(id, name)')
      .eq('is_active', true)
      .order('exam_year', { ascending: false })
      .order('display_order', { ascending: true });

    if (courseId) {
      query = query.eq('course_id', courseId);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Transform to match Prisma format: subject should be an object, not null
    const result = toCamelCase(data).map((paper: Record<string, unknown>) => ({
      ...paper,
      subject: (paper as Record<string, unknown>).subject || null,
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching previous papers:', error);
    return NextResponse.json({ error: 'Failed to fetch previous papers' }, { status: 500 });
  }
}
