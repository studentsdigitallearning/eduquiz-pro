import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { toCamelCase } from '@/lib/utils';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { data: mockTest, error } = await supabase
      .from('mock_tests')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !mockTest) {
      return NextResponse.json({ error: 'Mock test not found' }, { status: 404 });
    }

    // Fetch questions for this mock test
    const { data: questions, error: questionsError } = await supabase
      .from('mock_questions')
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
      .eq('id', mockTest.course_id)
      .single();

    const result = {
      ...toCamelCase(mockTest),
      questions: toCamelCase(questions),
      course: courseError ? null : toCamelCase(course),
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching mock test:', error);
    return NextResponse.json({ error: 'Failed to fetch mock test' }, { status: 500 });
  }
}
