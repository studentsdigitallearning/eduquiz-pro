import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { toCamelCase } from '@/lib/utils';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const subjectId = searchParams.get('subjectId');

    if (!subjectId) {
      return NextResponse.json(
        { error: 'subjectId query parameter is required' },
        { status: 400 }
      );
    }

    const { data: sets, error } = await supabase
      .from('sets')
      .select('*')
      .eq('subject_id', subjectId)
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Fetch question counts per set
    const { data: questionRefs } = await supabase
      .from('questions')
      .select('set_id')
      .eq('is_active', true);

    const questionCounts = new Map<string, number>();
    questionRefs?.forEach((q) => {
      questionCounts.set(q.set_id, (questionCounts.get(q.set_id) ?? 0) + 1);
    });

    const result = toCamelCase(sets).map((set: Record<string, unknown>) => ({
      ...set,
      _count: { questions: questionCounts.get(set.id as string) ?? 0 },
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching sets:', error);
    return NextResponse.json({ error: 'Failed to fetch sets' }, { status: 500 });
  }
}
