import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { toCamelCase } from '@/lib/utils';

// POST: Create or update a user profile
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, fullName, email, phone, state, district, courseId, preferredLanguage } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'User id is required' },
        { status: 400 }
      );
    }

    const { data: existing } = await supabaseAdmin
      .from('user_profiles')
      .select('id')
      .eq('id', id)
      .single();

    let result;

    if (existing) {
      // Update existing profile
      const updateData: Record<string, unknown> = {};
      if (fullName !== undefined) updateData.full_name = fullName;
      if (email !== undefined) updateData.email = email;
      if (phone !== undefined) updateData.phone = phone;
      if (state !== undefined) updateData.state = state;
      if (district !== undefined) updateData.district = district;
      if (courseId !== undefined) updateData.course_id = courseId;
      if (preferredLanguage !== undefined) updateData.preferred_language = preferredLanguage;

      const { data, error } = await supabaseAdmin
        .from('user_profiles')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      result = data;
    } else {
      // Create new profile
      const { data, error } = await supabaseAdmin
        .from('user_profiles')
        .insert({
          id,
          full_name: fullName || null,
          email: email || null,
          phone: phone || null,
          state: state || null,
          district: district || null,
          course_id: courseId || null,
          preferred_language: preferredLanguage || 'hindi',
        })
        .select()
        .single();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      result = data;
    }

    return NextResponse.json(toCamelCase(result), { status: 201 });
  } catch (error) {
    console.error('Error saving user profile:', error);
    return NextResponse.json({ error: 'Failed to save user profile' }, { status: 500 });
  }
}
