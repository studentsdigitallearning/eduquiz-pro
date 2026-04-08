import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { toCamelCase } from '@/lib/utils';

export async function GET() {
  try {
    const { data: categories, error } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Fetch course counts per category in a single query
    const { data: courseRefs } = await supabase
      .from('courses')
      .select('category_id')
      .eq('is_active', true);

    const courseCounts = new Map<string, number>();
    courseRefs?.forEach((c) => {
      courseCounts.set(c.category_id, (courseCounts.get(c.category_id) ?? 0) + 1);
    });

    const result = toCamelCase(categories).map((cat: Record<string, unknown>) => ({
      ...cat,
      _count: { courses: courseCounts.get(cat.id as string) ?? 0 },
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}
