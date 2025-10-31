# Highway Delite: Experiences & Slots

A modern, full-stack booking platform built with Next.js and Supabase. Book amazing experiences with real-time availability, slot management, and promo code support.

![Highway Delite Platform](https://images.pexels.com/photos/163236/luxury-yacht-boat-speed-water-163236.jpeg?auto=compress&cs=tinysrgb&w=800)

## Features

- **Experience Browsing**: Beautiful grid layout showcasing various experiences with images, ratings, and pricing
- **Detailed Views**: Comprehensive experience details with highlights, included items, and requirements
- **Slot Selection**: Real-time availability calendar with multiple time slots per day
- **Smart Booking**: Prevents double-booking and validates capacity constraints
- **Promo Codes**: Support for percentage and fixed discount codes
- **Responsive Design**: Fully optimized for desktop, tablet, and mobile devices
- **Loading States**: Skeleton screens and loading indicators for better UX
- **Error Handling**: Comprehensive error messages and fallback UI

## Tech Stack

### Frontend
- **Framework**: Next.js 13 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **UI Components**: shadcn/ui (Radix UI)
- **Icons**: Lucide React

### Backend & Database
- **Database**: Supabase (PostgreSQL)
- **API**: Next.js API Routes
- **Authentication**: Row Level Security (RLS)
- **Real-time**: Supabase Realtime

## Project Structure

```
Highway Delite/
├── app/
│   ├── api/
│   │   ├── bookings/
│   │   │   └── route.ts           # Create bookings
│   │   ├── experiences/
│   │   │   ├── route.ts           # List all experiences
│   │   │   └── [id]/route.ts      # Get experience details & slots
│   │   └── promo/
│   │       └── validate/route.ts  # Validate promo codes
│   ├── checkout/
│   │   └── page.tsx               # Checkout form
│   ├── experience/
│   │   └── [id]/page.tsx          # Experience details page
│   ├── result/
│   │   └── page.tsx               # Booking confirmation/error
│   ├── globals.css                # Global styles
│   ├── layout.tsx                 # Root layout
│   └── page.tsx                   # Home page
├── components/
│   └── ui/                        # shadcn/ui components
├── lib/
│   ├── supabase.ts                # Supabase client & types
│   └── utils.ts                   # Utility functions
├── .env                           # Environment variables
├── .env.example                   # Example environment variables
├── next.config.js                 # Next.js configuration
├── package.json                   # Dependencies
├── tailwind.config.ts             # Tailwind configuration
└── tsconfig.json                  # TypeScript configuration
```

## Database Schema

### Tables

1. **experiences**
   - Stores all bookable experiences/activities
   - Fields: title, description, image_url, location, duration, price, category, rating, capacity, etc.

2. **experience_slots**
   - Available time slots for each experience
   - Fields: experience_id, date, start_time, end_time, available_capacity

3. **bookings**
   - Customer bookings with full details
   - Fields: slot_id, customer info, pricing, booking_reference, status

4. **promo_codes**
   - Promotional discount codes
   - Fields: code, discount_type, discount_value, validity, usage limits

## API Routes

### GET `/api/experiences`
List all active experiences with full details.

**Response:**
```json
{
  "experiences": [
    {
      "id": "uuid",
      "title": "Boat Cruise",
      "description": "...",
      "price": 299,
      "rating": 4.8,
      ...
    }
  ]
}
```

### GET `/api/experiences/:id`
Get specific experience details with available slots.

**Response:**
```json
{
  "experience": { ... },
  "slots": [
    {
      "id": "uuid",
      "date": "2025-11-01",
      "start_time": "09:00:00",
      "available_capacity": 12
    }
  ]
}
```

### POST `/api/bookings`
Create a new booking.

**Request Body:**
```json
{
  "slot_id": "uuid",
  "customer_name": "John Doe",
  "customer_email": "john@example.com",
  "number_of_people": 2,
  "promo_code": "SAVE10",
  "discount_amount": 59.80,
  "subtotal": 598,
  "total_amount": 538.20,
  "special_requests": "..."
}
```

**Response:**
```json
{
  "booking": {
    "id": "uuid",
    "booking_reference": "BK-ABC12345",
    "status": "confirmed",
    ...
  }
}
```

### POST `/api/promo/validate`
Validate a promo code and calculate discount.

**Request Body:**
```json
{
  "code": "WELCOME10",
  "subtotal": 598
}
```

**Response:**
```json
{
  "valid": true,
  "discountAmount": 59.80,
  "totalAmount": 538.20,
  "discountType": "percentage",
  "discountValue": 10
}
```

## Setup Instructions

### Prerequisites
- Node.js 18+ installed
- Supabase account (free tier available)

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Highway Delite
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   - Create a new project at [supabase.com](https://supabase.com)
   - The database is already configured with all necessary tables and data
   - Copy your project URL and anon key

4. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```

   Update `.env` with your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY=your_supabase_anon_key
   ```

   ``` If that does not work due to some issues, You can try hardcoding the env variables in lib/supabase.ts
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser

6. **Build for production**
   ```bash
   npm run build
   npm start
   ```

## Available Promo Codes

Test the promo code functionality with these codes:

- **WELCOME10**: 10% discount
- **FLAT50**: ₹50 flat discount

## User Flow

1. **Browse Experiences** → Home page displays all available experiences
2. **View Details** → Click on an experience to see full details and available slots
3. **Select Slot** → Choose date, time, and number of people
4. **Checkout** → Fill in customer information and apply promo code
5. **Confirmation** → Receive booking reference and confirmation details

## Key Features Implementation

### Slot Management
- Real-time availability tracking
- Automatic capacity updates on booking
- Prevention of overbooking
- Date-based slot grouping

### Promo Code System
- Percentage and fixed discount types
- Validity period enforcement
- Maximum usage limits
- Real-time validation

### Responsive Design
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Touch-friendly interface
- Optimized images

## Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## Support

For issues or questions:
- GitHub Issues: [Create an issue]

---

Built with ❤️ using Next.js and Supabase
