import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { toCamelCase } from '@/lib/utils';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const testId = searchParams.get('testId');
    const testType = searchParams.get('testType');
    const courseId = searchParams.get('courseId');

    let query = supabase
      .from('results')
      .select('*, user_profile:user_profiles(id, full_name, email, state)')
      .eq('status', 'completed')
      .order('total_score', { ascending: false })
      .order('time_taken_seconds', { ascending: true })
      .limit(50);

    if (testId) query = query.eq('test_id', testId);
    if (testType) query = query.eq('test_type', testType);
    if (courseId) query = query.eq('course_id', courseId);

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Add rank based on position and normalize user_profile
    const leaderboard = toCamelCase(data).map((result: Record<string, unknown>, index: number) => {
      const rawProfile = (result as Record<string, unknown>).userProfile;
      const profile = Array.isArray(rawProfile) ? rawProfile[0] : rawProfile;
      return {
        ...result,
        userProfile: profile || null,
        rank: index + 1,
      };
    });

    return NextResponse.json(leaderboard);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return NextResponse.json({ error: 'Failed to fetch leaderboard' }, { status: 500 });
  }
}
