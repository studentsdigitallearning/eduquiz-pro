import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

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

    const courses = await db.course.findMany({
      where: {
        categoryId,
        isActive: true,
      },
      orderBy: { displayOrder: 'asc' },
      include: {
        _count: {
          select: {
            subjects: true,
            syllabus: true,
            dailyTests: true,
            mockTests: true,
          },
        },
      },
    });

    return NextResponse.json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    return NextResponse.json({ error: 'Failed to fetch courses' }, { status: 500 });
  }
}
