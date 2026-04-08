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

    const dailyTests = await db.dailyTest.findMany({
      where,
      orderBy: { testDate: 'desc' },
      include: {
        _count: {
          select: { questions: true },
        },
      },
    });

    return NextResponse.json(dailyTests);
  } catch (error) {
    console.error('Error fetching daily tests:', error);
    return NextResponse.json({ error: 'Failed to fetch daily tests' }, { status: 500 });
  }
}
