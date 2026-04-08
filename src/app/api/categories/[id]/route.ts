import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { toCamelCase } from '@/lib/utils';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { data: category, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    // Fetch active courses for this category
    const { data: courses, error: coursesError } = await supabase
      .from('courses')
      .select('*')
      .eq('category_id', id)
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (coursesError) {
      return NextResponse.json({ error: coursesError.message }, { status: 500 });
    }

    const result = {
      ...toCamelCase(category),
      courses: toCamelCase(courses),
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching category:', error);
    return NextResponse.json({ error: 'Failed to fetch category' }, { status: 500 });
  }
}
