import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gpdjacajxnqianxiqxon.supabase.co';
// const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdwZGphY2FqeG5xaWFueGlxeG9uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE4ODg1OTksImV4cCI6MjA3NzQ2NDU5OX0.n-b9_jO8cBr6S-EX3ly_aCb3oMyjMG3sXLMT-yhb7tw';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdwZGphY2FqeG5xaWFueGlxeG9uIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTg4ODU5OSwiZXhwIjoyMDc3NDY0NTk5fQ.87bWrA24MV2969aTp7vBYf0BmuE-V-BCQEj2gy0u3A0';

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
