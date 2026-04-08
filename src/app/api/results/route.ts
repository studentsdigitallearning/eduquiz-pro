import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// POST: Save a test result
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      userId,
      testId,
      testType,
      courseId,
      totalQuestions,
      correctAnswers,
      wrongAnswers,
      skippedAnswers,
      totalScore,
      percentage,
      timeTakenSeconds,
      attemptNumber,
      status,
      testDate,
    } = body;

    if (!userId || !testId || !testType || !courseId) {
      return NextResponse.json(
        { error: 'userId, testId, testType, and courseId are required' },
        { status: 400 }
      );
    }

    // Upsert user profile if not exists
    await db.userProfile.upsert({
      where: { id: userId },
      update: {
        totalTestsTaken: { increment: 1 },
        totalScore: { increment: totalScore || 0 },
      },
      create: {
        id: userId,
        totalTestsTaken: 1,
        totalScore: totalScore || 0,
      },
    });

    // Calculate rank among results for this test
    const existingResults = await db.result.findMany({
      where: { testId, testType, status: 'completed' },
      orderBy: { totalScore: 'desc' },
      select: { totalScore: true },
    });

    let rank = 1;
    const newScore = totalScore || 0;
    for (const r of existingResults) {
      if (r.totalScore > newScore) rank++;
    }

    const result = await db.result.create({
      data: {
        userId,
        testId,
        testType,
        courseId,
        totalQuestions,
        correctAnswers: correctAnswers || 0,
        wrongAnswers: wrongAnswers || 0,
        skippedAnswers: skippedAnswers || 0,
        totalScore: newScore,
        percentage: percentage || 0,
        timeTakenSeconds: timeTakenSeconds || 0,
        rank,
        attemptNumber: attemptNumber || 1,
        status: status || 'completed',
        testDate: testDate ? new Date(testDate) : new Date(),
      },
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('Error saving result:', error);
    return NextResponse.json({ error: 'Failed to save result' }, { status: 500 });
  }
}

// GET: Fetch results by testId and testType for leaderboard
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const testId = searchParams.get('testId');
    const testType = searchParams.get('testType');
    const courseId = searchParams.get('courseId');

    if (!testId || !testType) {
      return NextResponse.json(
        { error: 'testId and testType query parameters are required' },
        { status: 400 }
      );
    }

    const where: Record<string, unknown> = {
      testId,
      testType,
      status: 'completed',
    };
    if (courseId) {
      where.courseId = courseId;
    }

    const results = await db.result.findMany({
      where,
      orderBy: [
        { totalScore: 'desc' },
        { timeTakenSeconds: 'asc' },
      ],
      take: 100,
      include: {
        userProfile: {
          select: { id: true, fullName: true, email: true },
        },
      },
    });

    return NextResponse.json(results);
  } catch (error) {
    console.error('Error fetching results:', error);
    return NextResponse.json({ error: 'Failed to fetch results' }, { status: 500 });
  }
}
