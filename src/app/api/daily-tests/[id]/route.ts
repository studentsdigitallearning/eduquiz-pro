import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const dailyTest = await db.dailyTest.findUnique({
      where: { id },
      include: {
        questions: {
          orderBy: { displayOrder: 'asc' },
        },
        course: {
          select: { id: true, name: true },
        },
      },
    });

    if (!dailyTest) {
      return NextResponse.json({ error: 'Daily test not found' }, { status: 404 });
    }

    return NextResponse.json(dailyTest);
  } catch (error) {
    console.error('Error fetching daily test:', error);
    return NextResponse.json({ error: 'Failed to fetch daily test' }, { status: 500 });
  }
}
