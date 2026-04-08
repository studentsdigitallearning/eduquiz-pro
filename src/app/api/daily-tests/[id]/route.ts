import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { toCamelCase } from '@/lib/utils';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { data: dailyTest, error } = await supabase
      .from('daily_tests')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !dailyTest) {
      return NextResponse.json({ error: 'Daily test not found' }, { status: 404 });
    }

    // Fetch questions for this daily test
    const { data: questions, error: questionsError } = await supabase
      .from('daily_questions')
      .select('*')
      .eq('test_id', id)
      .order('display_order', { ascending: true });

    if (questionsError) {
      return NextResponse.json({ error: questionsError.message }, { status: 500 });
    }

    // Fetch course info
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select('id, name')
      .eq('id', dailyTest.course_id)
      .single();

    const result = {
      ...toCamelCase(dailyTest),
      questions: toCamelCase(questions),
      course: courseError ? null : toCamelCase(course),
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching daily test:', error);
    return NextResponse.json({ error: 'Failed to fetch daily test' }, { status: 500 });
  }
}
