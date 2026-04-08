import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const mockTest = await db.mockTest.findUnique({
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

    if (!mockTest) {
      return NextResponse.json({ error: 'Mock test not found' }, { status: 404 });
    }

    return NextResponse.json(mockTest);
  } catch (error) {
    console.error('Error fetching mock test:', error);
    return NextResponse.json({ error: 'Failed to fetch mock test' }, { status: 500 });
  }
}
