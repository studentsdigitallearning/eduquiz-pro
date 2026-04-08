import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const updateSections = await db.updateSection.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: 'asc' },
      include: {
        items: {
          where: { isActive: true },
          orderBy: { displayOrder: 'asc' },
          include: {
            buttons: {
              where: { isActive: true },
              orderBy: { displayOrder: 'asc' },
            },
          },
        },
      },
    });

    return NextResponse.json(updateSections);
  } catch (error) {
    console.error('Error fetching updates:', error);
    return NextResponse.json({ error: 'Failed to fetch updates' }, { status: 500 });
  }
}
