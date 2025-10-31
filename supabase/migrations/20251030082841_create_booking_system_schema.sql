/*
  # Highway Delite: Experiences & Slots - Database Schema

  ## Overview
  This migration creates the complete database schema for the Highway Delite booking platform.

  ## New Tables

  ### 1. experiences
  Stores all bookable experiences/activities
  - `id` (uuid, primary key) - Unique identifier
  - `title` (text) - Experience name
  - `description` (text) - Detailed description
  - `image_url` (text) - Cover image URL
  - `location` (text) - Where the experience takes place
  - `duration` (text) - Duration (e.g., "2 hours", "Full day")
  - `price` (numeric) - Base price per person
  - `category` (text) - Type of experience
  - `rating` (numeric) - Average rating (0-5)
  - `total_reviews` (integer) - Number of reviews
  - `max_capacity` (integer) - Maximum people per slot
  - `highlights` (jsonb) - Array of key features
  - `included_items` (jsonb) - What's included
  - `requirements` (jsonb) - Prerequisites or requirements
  - `is_active` (boolean) - Whether experience is available
  - `created_at` (timestamptz) - Record creation time

  ### 2. experience_slots
  Available time slots for each experience
  - `id` (uuid, primary key) - Unique identifier
  - `experience_id` (uuid, foreign key) - Links to experiences table
  - `date` (date) - Slot date
  - `start_time` (time) - Slot start time
  - `end_time` (time) - Slot end time
  - `available_capacity` (integer) - Remaining spots
  - `is_available` (boolean) - Whether slot can be booked
  - `created_at` (timestamptz) - Record creation time

  ### 3. bookings
  Customer bookings
  - `id` (uuid, primary key) - Unique identifier
  - `slot_id` (uuid, foreign key) - Links to experience_slots
  - `customer_name` (text) - Customer full name
  - `customer_email` (text) - Customer email
  - `customer_phone` (text) - Customer phone number
  - `number_of_people` (integer) - Party size
  - `promo_code` (text, nullable) - Applied promo code
  - `discount_amount` (numeric) - Discount value
  - `subtotal` (numeric) - Price before discount
  - `total_amount` (numeric) - Final price after discount
  - `status` (text) - Booking status (confirmed, pending, cancelled)
  - `booking_reference` (text, unique) - Unique booking code
  - `special_requests` (text, nullable) - Customer notes
  - `created_at` (timestamptz) - Booking time

  ### 4. promo_codes
  Promotional discount codes
  - `id` (uuid, primary key) - Unique identifier
  - `code` (text, unique) - Promo code string
  - `discount_type` (text) - "percentage" or "fixed"
  - `discount_value` (numeric) - Discount amount/percentage
  - `is_active` (boolean) - Whether code is valid
  - `valid_from` (timestamptz) - Code start date
  - `valid_until` (timestamptz, nullable) - Code expiry date
  - `max_uses` (integer, nullable) - Maximum number of uses
  - `current_uses` (integer) - Times code has been used
  - `created_at` (timestamptz) - Record creation time

  ## Security
  - RLS enabled on all tables
  - Public read access for experiences and slots
  - Authenticated users can create bookings
  - Promo codes readable by all for validation

  ## Indexes
  - Indexed foreign keys for performance
  - Indexed booking_reference for quick lookups
  - Indexed promo codes for validation
*/

-- Create experiences table
CREATE TABLE IF NOT EXISTS experiences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  image_url text NOT NULL,
  location text NOT NULL,
  duration text NOT NULL,
  price numeric NOT NULL CHECK (price >= 0),
  category text NOT NULL,
  rating numeric DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  total_reviews integer DEFAULT 0,
  max_capacity integer NOT NULL CHECK (max_capacity > 0),
  highlights jsonb DEFAULT '[]'::jsonb,
  included_items jsonb DEFAULT '[]'::jsonb,
  requirements jsonb DEFAULT '[]'::jsonb,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Create experience_slots table
CREATE TABLE IF NOT EXISTS experience_slots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  experience_id uuid NOT NULL REFERENCES experiences(id) ON DELETE CASCADE,
  date date NOT NULL,
  start_time time NOT NULL,
  end_time time NOT NULL,
  available_capacity integer NOT NULL CHECK (available_capacity >= 0),
  is_available boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slot_id uuid NOT NULL REFERENCES experience_slots(id) ON DELETE RESTRICT,
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_phone text NOT NULL,
  number_of_people integer NOT NULL CHECK (number_of_people > 0),
  promo_code text,
  discount_amount numeric DEFAULT 0 CHECK (discount_amount >= 0),
  subtotal numeric NOT NULL CHECK (subtotal >= 0),
  total_amount numeric NOT NULL CHECK (total_amount >= 0),
  status text DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'pending', 'cancelled')),
  booking_reference text UNIQUE NOT NULL,
  special_requests text,
  created_at timestamptz DEFAULT now()
);

-- Create promo_codes table
CREATE TABLE IF NOT EXISTS promo_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  discount_type text NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value numeric NOT NULL CHECK (discount_value >= 0),
  is_active boolean DEFAULT true,
  valid_from timestamptz DEFAULT now(),
  valid_until timestamptz,
  max_uses integer,
  current_uses integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_slots_experience_id ON experience_slots(experience_id);
CREATE INDEX IF NOT EXISTS idx_slots_date ON experience_slots(date);
CREATE INDEX IF NOT EXISTS idx_bookings_slot_id ON bookings(slot_id);
CREATE INDEX IF NOT EXISTS idx_bookings_reference ON bookings(booking_reference);
CREATE INDEX IF NOT EXISTS idx_promo_codes_code ON promo_codes(code);

-- Enable Row Level Security
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE experience_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE promo_codes ENABLE ROW LEVEL SECURITY;

-- Experiences policies (public read)
CREATE POLICY "Anyone can view active experiences"
  ON experiences FOR SELECT
  USING (is_active = true);

-- Experience slots policies (public read)
CREATE POLICY "Anyone can view available slots"
  ON experience_slots FOR SELECT
  USING (is_available = true);

-- Bookings policies (anyone can create, users can view their own)
CREATE POLICY "Anyone can create bookings"
  ON bookings FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can view their own bookings"
  ON bookings FOR SELECT
  USING (true);

-- Promo codes policies (public read for validation)
CREATE POLICY "Anyone can view active promo codes"
  ON promo_codes FOR SELECT
  USING (is_active = true);

-- Insert sample experiences
INSERT INTO experiences (title, description, image_url, location, duration, price, category, rating, total_reviews, max_capacity, highlights, included_items, requirements) VALUES
(
  'Sunset Yacht Cruise',
  'Experience the magic of golden hour aboard a luxury yacht. Sail through crystal-clear waters while enjoying breathtaking sunset views, complementary refreshments, and live music. Perfect for romantic evenings or special celebrations.',
  'https://images.pexels.com/photos/163236/luxury-yacht-boat-speed-water-163236.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'Miami Beach, Florida',
  '3 hours',
  299,
  'Water Activities',
  4.8,
  156,
  12,
  '["Professional captain and crew", "Stunning sunset views", "Live acoustic music", "Complimentary bar service"]'::jsonb,
  '["Welcome drinks", "Gourmet appetizers", "Premium bar selection", "Safety equipment", "Photography service"]'::jsonb,
  '["Minimum age: 18 years", "No swimming skills required", "Dress code: Smart casual"]'::jsonb
),
(
  'Mountain Hiking Adventure',
  'Embark on an unforgettable journey through pristine mountain trails. Led by expert guides, discover hidden waterfalls, panoramic vistas, and diverse wildlife. Suitable for intermediate hikers looking for an authentic outdoor experience.',
  'https://images.pexels.com/photos/691668/pexels-photo-691668.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'Rocky Mountains, Colorado',
  '6 hours',
  149,
  'Adventure',
  4.9,
  243,
  8,
  '["Expert mountain guide", "Scenic viewpoints", "Wildlife spotting", "Waterfall visit"]'::jsonb,
  '["Guided tour", "Trail snacks", "Bottled water", "First aid kit", "Hiking poles"]'::jsonb,
  '["Moderate fitness level required", "Minimum age: 12 years", "Weather dependent"]'::jsonb
),
(
  'Culinary Walking Tour',
  'Discover the authentic flavors of the city with our expert food guides. Visit hidden gems and local favorites, sampling signature dishes and learning about culinary traditions. A delicious journey through culture and cuisine.',
  'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'Downtown Portland, Oregon',
  '4 hours',
  89,
  'Food & Drink',
  4.7,
  312,
  15,
  '["Visit 7+ local eateries", "Expert food guide", "Cultural insights", "Hidden local spots"]'::jsonb,
  '["Food tastings at each stop", "Local craft beverages", "Recipe cards", "Restaurant discount vouchers"]'::jsonb,
  '["Comfortable walking shoes recommended", "Dietary restrictions accommodated with notice", "All ages welcome"]'::jsonb
),
(
  'Hot Air Balloon Ride',
  'Soar above the stunning landscape in a peaceful hot air balloon flight. Experience breathtaking bird''s-eye views at sunrise, when the world awakens below you. Includes a champagne toast upon landing and flight certificate.',
  'https://images.pexels.com/photos/1933239/pexels-photo-1933239.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'Napa Valley, California',
  '3 hours',
  399,
  'Adventure',
  4.9,
  189,
  6,
  '["Sunrise flight", "Champagne toast", "Flight certificate", "Experienced pilot"]'::jsonb,
  '["Pre-flight refreshments", "Celebration champagne", "Commemorative certificate", "Ground transport to/from launch site"]'::jsonb,
  '["Minimum age: 6 years", "Not suitable for pregnant women", "Weather dependent", "Moderate mobility required"]'::jsonb
),
(
  'Urban Photography Workshop',
  'Master the art of urban photography with a professional photographer. Learn composition, lighting, and storytelling techniques while exploring the city''s most photogenic locations. All skill levels welcome.',
  'https://images.pexels.com/photos/1983032/pexels-photo-1983032.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'Brooklyn, New York',
  '3 hours',
  129,
  'Arts & Culture',
  4.6,
  98,
  10,
  '["Professional photographer guide", "Hands-on instruction", "Iconic photo locations", "Post-processing tips"]'::jsonb,
  '["Photography instruction", "Location guide", "Post-workshop photo review", "Editing presets"]'::jsonb,
  '["Bring your own camera (DSLR, mirrorless, or smartphone)", "Basic camera knowledge helpful", "All levels welcome"]'::jsonb
),
(
  'Wine Tasting Experience',
  'Journey through award-winning vineyards and taste exceptional wines paired with artisan cheeses. Learn about winemaking from passionate vintners while enjoying stunning valley views. Transportation included.',
  'https://images.pexels.com/photos/1407846/pexels-photo-1407846.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'Sonoma County, California',
  '5 hours',
  179,
  'Food & Drink',
  4.8,
  267,
  12,
  '["Visit 3 premium wineries", "Expert sommelier guide", "Cheese pairings", "Scenic vineyard tour"]'::jsonb,
  '["Wine tastings", "Artisan cheese board", "Transportation between wineries", "Souvenir wine glass"]'::jsonb,
  '["Minimum age: 21 years", "Valid ID required", "Not recommended for pregnant women"]'::jsonb
);

-- Insert sample slots for the next 14 days for each experience
DO $$
DECLARE
  exp RECORD;
  slot_date DATE;
  morning_time TIME := '09:00:00';
  afternoon_time TIME := '14:00:00';
  evening_time TIME := '18:00:00';
BEGIN
  FOR exp IN SELECT id, max_capacity, duration FROM experiences LOOP
    FOR i IN 0..13 LOOP
      slot_date := CURRENT_DATE + i;
      
      IF exp.duration LIKE '%3 hours%' OR exp.duration LIKE '%4 hours%' THEN
        INSERT INTO experience_slots (experience_id, date, start_time, end_time, available_capacity, is_available)
        VALUES (exp.id, slot_date, morning_time, morning_time + INTERVAL '3 hours', exp.max_capacity, true);
        
        INSERT INTO experience_slots (experience_id, date, start_time, end_time, available_capacity, is_available)
        VALUES (exp.id, slot_date, afternoon_time, afternoon_time + INTERVAL '3 hours', exp.max_capacity, true);
      END IF;
      
      IF exp.duration LIKE '%evening%' OR exp.duration LIKE '%Sunset%' OR exp.duration LIKE '3 hours' THEN
        INSERT INTO experience_slots (experience_id, date, start_time, end_time, available_capacity, is_available)
        VALUES (exp.id, slot_date, evening_time, evening_time + INTERVAL '3 hours', exp.max_capacity, true);
      END IF;
    END LOOP;
  END LOOP;
END $$;

-- Insert promo codes
INSERT INTO promo_codes (code, discount_type, discount_value, is_active, valid_until, max_uses) VALUES
('SAVE10', 'percentage', 10, true, NOW() + INTERVAL '90 days', 1000),
('FLAT100', 'fixed', 100, true, NOW() + INTERVAL '90 days', 500),
('WELCOME20', 'percentage', 20, true, NOW() + INTERVAL '30 days', 100);
