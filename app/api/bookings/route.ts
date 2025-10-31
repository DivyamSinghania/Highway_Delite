import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';

function generateBookingReference(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let reference = 'BK-';
  for (let i = 0; i < 8; i++) {
    reference += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return reference;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      slot_id,
      customer_name,
      customer_email,
      number_of_people,
      promo_code,
      discount_amount,
      subtotal,
      total_amount,
      special_requests,
    } = body;

    // Validation
    if (!slot_id || !customer_name || !customer_email || !number_of_people || subtotal === undefined || total_amount === undefined) {
      console.error('Validation failed: missing fields', body);
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customer_email)) {
      console.error('Validation failed: invalid email', customer_email);
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    // Fetch slot
    const { data: slot, error: slotError } = await supabaseServer
      .from('experience_slots')
      .select('available_capacity, is_available')
      .eq('id', slot_id)
      .maybeSingle();

    console.log('Fetched slot:', slot, slotError);

    if (slotError) {
      console.error('Error fetching slot:', slotError);
      throw slotError;
    }

    if (!slot || !slot.is_available) {
      console.error('Slot not available:', slot);
      return NextResponse.json({ error: 'Slot is not available' }, { status: 400 });
    }

    if (slot.available_capacity < number_of_people) {
      console.error(`Not enough capacity: ${slot.available_capacity} < ${number_of_people}`);
      return NextResponse.json({ error: `Only ${slot.available_capacity} spot(s) available` }, { status: 400 });
    }

    // Insert booking
    const booking_reference = generateBookingReference();

    const { data: booking, error: bookingError } = await supabaseServer
      .from('bookings')
      .insert({
        slot_id,
        customer_name,
        customer_email,
        number_of_people,
        promo_code: promo_code || null,
        discount_amount: discount_amount || 0,
        subtotal,
        total_amount,
        status: 'confirmed',
        booking_reference,
        special_requests: special_requests || null,
      })
      .select()
      .single();

    console.log('Booking insert result:', booking, bookingError);

    if (bookingError) {
      console.error('Error inserting booking:', bookingError);
      throw bookingError;
    }

    // Update slot capacity
    const newCapacity = slot.available_capacity - number_of_people;
    const { data: updatedSlot, error: updateError } = await supabaseServer
      .from('experience_slots')
      .update({
        available_capacity: newCapacity,
        is_available: newCapacity > 0,
      })
      .eq('id', slot_id)
      .select()
      .single();

    console.log('Updated slot:', updatedSlot, updateError);

    if (updateError) {
      console.error('Error updating slot capacity:', updateError);
      throw updateError;
    }

    return NextResponse.json({ booking }, { status: 201 });
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 });
  }
}
