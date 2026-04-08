import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const settings = await db.siteSettings.findFirst();

    if (!settings) {
      // Return defaults if no settings exist yet
      return NextResponse.json({
        siteName: 'EduQuiz Pro',
        logoUrl: null,
        faviconUrl: null,
        metaTitle: 'EduQuiz Pro - Premium Learning App',
        metaDescription: 'Practice MCQs, daily tests, mock exams and more',
        contactEmail: 'support@eduquizpro.com',
        contactPhone: null,
        whatsappLink: null,
        telegramLink: null,
        rateAppEnabled: true,
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error fetching site settings:', error);
    return NextResponse.json({ error: 'Failed to fetch site settings' }, { status: 500 });
  }
}
