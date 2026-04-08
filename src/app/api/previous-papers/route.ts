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

    const previousPapers = await db.previousPaper.findMany({
      where,
      orderBy: [{ examYear: 'desc' }, { displayOrder: 'asc' }],
      include: {
        subject: {
          select: { id: true, name: true },
        },
      },
    });

    return NextResponse.json(previousPapers);
  } catch (error) {
    console.error('Error fetching previous papers:', error);
    return NextResponse.json({ error: 'Failed to fetch previous papers' }, { status: 500 });
  }
}
