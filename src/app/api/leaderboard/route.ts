import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const testId = searchParams.get('testId');
    const testType = searchParams.get('testType');
    const courseId = searchParams.get('courseId');

    const where: Record<string, unknown> = { status: 'completed' };

    if (testId) where.testId = testId;
    if (testType) where.testType = testType;
    if (courseId) where.courseId = courseId;

    const results = await db.result.findMany({
      where,
      orderBy: [
        { totalScore: 'desc' },
        { timeTakenSeconds: 'asc' },
      ],
      take: 50,
      include: {
        userProfile: {
          select: { id: true, fullName: true, email: true, state: true },
        },
      },
    });

    // Add rank based on position in sorted results
    const leaderboard = results.map((result, index) => ({
      ...result,
      rank: index + 1,
    }));

    return NextResponse.json(leaderboard);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return NextResponse.json({ error: 'Failed to fetch leaderboard' }, { status: 500 });
  }
}
