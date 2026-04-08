import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { toCamelCase } from '@/lib/utils';

export async function GET() {
  try {
    // Fetch all active update sections
    const { data: sections, error: sectionsError } = await supabase
      .from('update_sections')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (sectionsError) {
      return NextResponse.json({ error: sectionsError.message }, { status: 500 });
    }

    if (!sections || sections.length === 0) {
      return NextResponse.json([]);
    }

    const sectionIds = sections.map((s) => s.id);

    // Fetch active update items for these sections
    const { data: items, error: itemsError } = await supabase
      .from('update_items')
      .select('*')
      .in('section_id', sectionIds)
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (itemsError) {
      return NextResponse.json({ error: itemsError.message }, { status: 500 });
    }

    const itemIds = items?.map((i) => i.id) || [];

    // Fetch active buttons for these items
    let buttons: unknown[] = [];
    if (itemIds.length > 0) {
      const { data: buttonsData, error: buttonsError } = await supabase
        .from('update_buttons')
        .select('*')
        .in('item_id', itemIds)
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (buttonsError) {
        return NextResponse.json({ error: buttonsError.message }, { status: 500 });
      }
      buttons = buttonsData || [];
    }

    // Build the nested structure
    const buttonsByItem = new Map<string, unknown[]>();
    buttons.forEach((b: Record<string, unknown>) => {
      const itemId = b.item_id as string;
      const existing = buttonsByItem.get(itemId) || [];
      existing.push(b);
      buttonsByItem.set(itemId, existing);
    });

    const itemsBySection = new Map<string, unknown[]>();
    items?.forEach((item: Record<string, unknown>) => {
      const sectionId = item.section_id as string;
      const existing = itemsBySection.get(sectionId) || [];
      existing.push({
        ...item,
        buttons: toCamelCase(buttonsByItem.get(item.id as string) || []),
      });
      itemsBySection.set(sectionId, existing);
    });

    const result = toCamelCase(sections).map((section: Record<string, unknown>) => ({
      ...section,
      items: toCamelCase(itemsBySection.get(section.id as string) || []),
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching updates:', error);
    return NextResponse.json({ error: 'Failed to fetch updates' }, { status: 500 });
  }
}
