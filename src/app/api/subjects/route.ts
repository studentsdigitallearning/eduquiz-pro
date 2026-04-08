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

    const { data: subjects, error } = await supabase
      .from('subjects')
      .select('*')
      .eq('course_id', courseId)
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Fetch set counts per subject
    const { data: setRefs } = await supabase
      .from('sets')
      .select('subject_id')
      .eq('is_active', true);

    const setCounts = new Map<string, number>();
    setRefs?.forEach((s) => {
      setCounts.set(s.subject_id, (setCounts.get(s.subject_id) ?? 0) + 1);
    });

    const result = toCamelCase(subjects).map((subject: Record<string, unknown>) => ({
      ...subject,
      _count: { sets: setCounts.get(subject.id as string) ?? 0 },
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching subjects:', error);
    return NextResponse.json({ error: 'Failed to fetch subjects' }, { status: 500 });
  }
}
