import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { toCamelCase } from '@/lib/utils';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('courseId');

    let query = supabase
      .from('mock_tests')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (courseId) {
      query = query.eq('course_id', courseId);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Fetch question counts per mock test
    const { data: questionRefs } = await supabase
      .from('mock_questions')
      .select('test_id');

    const questionCounts = new Map<string, number>();
    questionRefs?.forEach((q) => {
      questionCounts.set(q.test_id, (questionCounts.get(q.test_id) ?? 0) + 1);
    });

    const result = toCamelCase(data).map((test: Record<string, unknown>) => ({
      ...test,
      _count: { questions: questionCounts.get(test.id as string) ?? 0 },
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching mock tests:', error);
    return NextResponse.json({ error: 'Failed to fetch mock tests' }, { status: 500 });
  }
}
