import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('courseId');

    const where: Record<string, unknown> = { isActive: true };
    if (courseId) {
      where.courseId = courseId;
    }

    const mockTests = await db.mockTest.findMany({
      where,
      orderBy: { displayOrder: 'asc' },
      include: {
        _count: {
          select: { questions: true },
        },
      },
    });

    return NextResponse.json(mockTests);
  } catch (error) {
    console.error('Error fetching mock tests:', error);
    return NextResponse.json({ error: 'Failed to fetch mock tests' }, { status: 500 });
  }
}
