import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { code, subtotal } = body;

    if (!code || !subtotal) {
      return NextResponse.json(
        { error: 'Code and subtotal are required' },
        { status: 400 }
      );
    }

    const { data: promoCode, error } = await supabase
      .from('promo_codes')
      .select('*')
      .eq('code', code.toUpperCase())
      .eq('is_active', true)
      .maybeSingle();

    if (error) throw error;

    if (!promoCode) {
      return NextResponse.json(
        { error: 'Invalid promo code' },
        { status: 404 }
      );
    }

    const now = new Date();
    const validFrom = new Date(promoCode.valid_from);
    const validUntil = promoCode.valid_until ? new Date(promoCode.valid_until) : null;

    if (now < validFrom) {
      return NextResponse.json(
        { error: 'Promo code is not yet valid' },
        { status: 400 }
      );
    }

    if (validUntil && now > validUntil) {
      return NextResponse.json(
        { error: 'Promo code has expired' },
        { status: 400 }
      );
    }

    if (promoCode.max_uses && promoCode.current_uses >= promoCode.max_uses) {
      return NextResponse.json(
        { error: 'Promo code has reached maximum uses' },
        { status: 400 }
      );
    }

    let discountAmount = 0;
    if (promoCode.discount_type === 'percentage') {
      discountAmount = (subtotal * promoCode.discount_value) / 100;
    } else {
      discountAmount = promoCode.discount_value;
    }

    discountAmount = Math.min(discountAmount, subtotal);
    const totalAmount = subtotal - discountAmount;

    return NextResponse.json({
      valid: true,
      discountAmount,
      totalAmount,
      discountType: promoCode.discount_type,
      discountValue: promoCode.discount_value,
    });
  } catch (error) {
    console.error('Error validating promo code:', error);
    return NextResponse.json(
      { error: 'Failed to validate promo code' },
      { status: 500 }
    );
  }
}
