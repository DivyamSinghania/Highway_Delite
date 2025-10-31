# Quick Start Guide

Get Highway Delite running in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- The project includes a pre-configured Supabase database

## Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Environment is already configured**

   The `.env` file already contains the Supabase credentials. No additional setup needed!

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

## That's it! 🎉

The application is now running with:
- ✅ 9 sample experiences
- ✅ 154 available time slots
- ✅ 2 working promo codes

## Test the Booking Flow

1. Browse experiences on the home page
2. Click "View Details" on any experience
3. Select a date and time slot
4. Click "Continue to Checkout"
5. Fill in the form:
   - Name: Test User
   - Email: test@example.com
6. Try promo code: **WELCOME10**
7. Click "Confirm Booking"
8. See your booking confirmation!

## Available Promo Codes

- `WELCOME10` - 10% discount
- `FLAT50` - ₹50 flat discount

## Database Overview

The Supabase database is already set up with:
- 6 diverse experiences (yacht, hiking, culinary, balloon, photography, wine)
- High-quality images from Pexels
- Available slots for the next 14 days
- Multiple time slots per day

## Build for Production

```bash
npm run build
npm start
```

Enjoy exploring Highway Delite! 🚀
