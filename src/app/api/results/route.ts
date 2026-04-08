import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { supabaseAdmin } from '@/lib/supabase';
import { toCamelCase } from '@/lib/utils';

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

    const newScore = totalScore || 0;

    // Upsert user profile: check if exists first
    const { data: existingProfile } = await supabaseAdmin
      .from('user_profiles')
      .select('id, total_tests_taken, total_score')
      .eq('id', userId)
      .single();

    if (existingProfile) {
      // Update existing profile with incremented stats
      await supabaseAdmin
        .from('user_profiles')
        .update({
          total_tests_taken: (existingProfile.total_tests_taken || 0) + 1,
          total_score: (existingProfile.total_score || 0) + newScore,
        })
        .eq('id', userId);
    } else {
      // Create new profile
      await supabaseAdmin.from('user_profiles').insert({
        id: userId,
        total_tests_taken: 1,
        total_score: newScore,
      });
    }

    // Calculate rank among existing completed results for this test
    const { data: existingResults } = await supabase
      .from('results')
      .select('total_score')
      .eq('test_id', testId)
      .eq('test_type', testType)
      .eq('status', 'completed');

    let rank = 1;
    existingResults?.forEach((r) => {
      if (r.total_score > newScore) rank++;
    });

    // Insert the result
    const { data: result, error } = await supabaseAdmin
      .from('results')
      .insert({
        user_id: userId,
        test_id: testId,
        test_type: testType,
        course_id: courseId,
        total_questions: totalQuestions || 0,
        correct_answers: correctAnswers || 0,
        wrong_answers: wrongAnswers || 0,
        skipped_answers: skippedAnswers || 0,
        total_score: newScore,
        percentage: percentage || 0,
        time_taken_seconds: timeTakenSeconds || 0,
        rank,
        attempt_number: attemptNumber || 1,
        status: status || 'completed',
        test_date: testDate ? new Date(testDate).toISOString() : new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(toCamelCase(result), { status: 201 });
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

    // Join with user_profiles to get user name and email
    let query = supabase
      .from('results')
      .select('*, user_profile:user_profiles(id, full_name, email)')
      .eq('test_id', testId)
      .eq('test_type', testType)
      .eq('status', 'completed')
      .order('total_score', { ascending: false })
      .order('time_taken_seconds', { ascending: true })
      .limit(100);

    if (courseId) {
      query = query.eq('course_id', courseId);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Transform: user_profile may be an array or object, normalize to single object
    const result = toCamelCase(data).map((item: Record<string, unknown>) => {
      const rawProfile = (item as Record<string, unknown>).userProfile;
      const profile = Array.isArray(rawProfile) ? rawProfile[0] : rawProfile;
      return {
        ...item,
        userProfile: profile || null,
      };
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching results:', error);
    return NextResponse.json({ error: 'Failed to fetch results' }, { status: 500 });
  }
}
