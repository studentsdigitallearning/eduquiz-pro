import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

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

    const profile = await db.userProfile.upsert({
      where: { id },
      update: {
        ...(fullName !== undefined && { fullName }),
        ...(email !== undefined && { email }),
        ...(phone !== undefined && { phone }),
        ...(state !== undefined && { state }),
        ...(district !== undefined && { district }),
        ...(courseId !== undefined && { courseId }),
        ...(preferredLanguage !== undefined && { preferredLanguage }),
      },
      create: {
        id,
        fullName: fullName || null,
        email: email || null,
        phone: phone || null,
        state: state || null,
        district: district || null,
        courseId: courseId || null,
        preferredLanguage: preferredLanguage || 'hindi',
      },
    });

    return NextResponse.json(profile, { status: 201 });
  } catch (error) {
    console.error('Error saving user profile:', error);
    return NextResponse.json({ error: 'Failed to save user profile' }, { status: 500 });
  }
}
