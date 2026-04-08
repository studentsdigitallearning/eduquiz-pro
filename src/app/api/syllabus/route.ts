import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

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

    const syllabusItems = await db.syllabus.findMany({
      where: {
        courseId,
        isActive: true,
      },
      orderBy: { displayOrder: 'asc' },
    });

    return NextResponse.json(syllabusItems);
  } catch (error) {
    console.error('Error fetching syllabus:', error);
    return NextResponse.json({ error: 'Failed to fetch syllabus' }, { status: 500 });
  }
}
