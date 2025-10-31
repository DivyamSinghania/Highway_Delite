import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { data: experience, error: expError } = await supabase
      .from('experiences')
      .select('*')
      .eq('id', params.id)
      .eq('is_active', true)
      .maybeSingle();

    if (expError) throw expError;
    if (!experience) {
      return NextResponse.json(
        { error: 'Experience not found' },
        { status: 404 }
      );
    }

    const { data: slots, error: slotsError } = await supabase
      .from('experience_slots')
      .select('*')
      .eq('experience_id', params.id)
      .eq('is_available', true)
      .gte('date', new Date().toISOString().split('T')[0])
      .order('date', { ascending: true })
      .order('start_time', { ascending: true });

    if (slotsError) throw slotsError;

    return NextResponse.json({ experience, slots });
  } catch (error) {
    console.error('Error fetching experience details:', error);
    return NextResponse.json(
      { error: 'Failed to fetch experience details' },
      { status: 500 }
    );
  }
}
