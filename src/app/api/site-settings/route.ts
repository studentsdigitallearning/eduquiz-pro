import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { toCamelCase } from '@/lib/utils';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .limit(1)
      .single();

    if (error || !data) {
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

    return NextResponse.json(toCamelCase(data));
  } catch (error) {
    console.error('Error fetching site settings:', error);
    return NextResponse.json({ error: 'Failed to fetch site settings' }, { status: 500 });
  }
}
