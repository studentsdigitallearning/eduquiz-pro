import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const subjectId = searchParams.get('subjectId');

    if (!subjectId) {
      return NextResponse.json(
        { error: 'subjectId query parameter is required' },
        { status: 400 }
      );
    }

    const sets = await db.set.findMany({
      where: {
        subjectId,
        isActive: true,
      },
      orderBy: { displayOrder: 'asc' },
      include: {
        _count: {
          select: { questions: true },
        },
      },
    });

    return NextResponse.json(sets);
  } catch (error) {
    console.error('Error fetching sets:', error);
    return NextResponse.json({ error: 'Failed to fetch sets' }, { status: 500 });
  }
}
