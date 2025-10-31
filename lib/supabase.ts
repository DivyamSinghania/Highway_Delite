import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const supabase = createClient(supabaseUrl, SUPABASE_SERVICE_ROLE_KEY);

export type Experience = {
  id: string;
  title: string;
  description: string;
  image_url: string;
  location: string;
  duration: string;
  price: number;
  category: string;
  rating: number;
  total_reviews: number;
  max_capacity: number;
  highlights: string[];
  included_items: string[];
  requirements: string[];
  is_active: boolean;
  created_at: string;
};

export type ExperienceSlot = {
  id: string;
  experience_id: string;
  date: string;
  start_time: string;
  end_time: string;
  available_capacity: number;
  is_available: boolean;
  created_at: string;
};

export type Booking = {
  id?: string;
  slot_id: string;
  customer_name: string;
  customer_email: string;
  number_of_people: number;
  promo_code?: string;
  discount_amount: number;
  subtotal: number;
  total_amount: number;
  status: 'confirmed' | 'pending' | 'cancelled';
  booking_reference?: string;
  special_requests?: string;
  created_at?: string;
};

export type PromoCode = {
  id: string;
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  is_active: boolean;
  valid_from: string;
  valid_until: string | null;
  max_uses: number | null;
  current_uses: number;
  created_at: string;
};
