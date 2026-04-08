import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { toCamelCase } from '@/lib/utils';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId');

    if (!categoryId) {
      return NextResponse.json(
        { error: 'categoryId query parameter is required' },
        { status: 400 }
      );
    }

    const { data: courses, error } = await supabase
      .from('courses')
      .select('*')
      .eq('category_id', categoryId)
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Fetch all counts in parallel
    const [subjectsRes, syllabusRes, dailyTestsRes, mockTestsRes] = await Promise.all([
      supabase.from('subjects').select('course_id').eq('is_active', true),
      supabase.from('syllabus').select('course_id').eq('is_active', true),
      supabase.from('daily_tests').select('course_id').eq('is_active', true),
      supabase.from('mock_tests').select('course_id').eq('is_active', true),
    ]);

    const countByCourse = (refs: { course_id: string }[] | null) => {
      const counts = new Map<string, number>();
      refs?.forEach((r) => {
        counts.set(r.course_id, (counts.get(r.course_id) ?? 0) + 1);
      });
      return counts;
    };

    const subjectCounts = countByCourse(subjectsRes.data);
    const syllabusCounts = countByCourse(syllabusRes.data);
    const dailyTestCounts = countByCourse(dailyTestsRes.data);
    const mockTestCounts = countByCourse(mockTestsRes.data);

    const result = toCamelCase(courses).map((course: Record<string, unknown>) => ({
      ...course,
      _count: {
        subjects: subjectCounts.get(course.id as string) ?? 0,
        syllabus: syllabusCounts.get(course.id as string) ?? 0,
        dailyTests: dailyTestCounts.get(course.id as string) ?? 0,
        mockTests: mockTestCounts.get(course.id as string) ?? 0,
      },
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching courses:', error);
    return NextResponse.json({ error: 'Failed to fetch courses' }, { status: 500 });
  }
}
