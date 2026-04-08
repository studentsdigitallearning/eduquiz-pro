import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const setId = searchParams.get('setId');

    if (!setId) {
      return NextResponse.json(
        { error: 'setId query parameter is required' },
        { status: 400 }
      );
    }

    const questions = await db.question.findMany({
      where: {
        setId,
        isActive: true,
      },
      orderBy: { displayOrder: 'asc' },
    });

    return NextResponse.json(questions);
  } catch (error) {
    console.error('Error fetching questions:', error);
    return NextResponse.json({ error: 'Failed to fetch questions' }, { status: 500 });
  }
}
