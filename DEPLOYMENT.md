# Deployment Guide

## Overview

This guide covers deploying the Highway Delite application to production using Vercel for the frontend and the existing Supabase instance for the database.

## Current Status

- ✅ Database is already set up and populated with sample data
- ✅ 6 experiences with images from Pexels
- ✅ 154 available time slots over the next 14 days
- ✅ 3 active promo codes (SAVE10, FLAT100, WELCOME20)
- ✅ Row Level Security (RLS) policies configured
- ✅ All API routes tested and working
- ✅ Production build successful

## Deploying to Vercel

### Step 1: Prepare Your Repository

1. Ensure all code is committed to Git:
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

### Step 2: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your Git repository
4. Configure project:
   - **Framework Preset**: Next.js
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

### Step 3: Environment Variables

Add these environment variables in Vercel:

```
NEXT_PUBLIC_SUPABASE_URL=https://zbhccyyiyvvsxysdxijl.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### Step 4: Deploy

Click "Deploy" and wait for the build to complete.

## Database Configuration

The Supabase database is already configured with:

### Tables Created:
- ✅ experiences (6 records)
- ✅ experience_slots (154 records)
- ✅ bookings (empty, ready for production)
- ✅ promo_codes (3 active codes)

### Security:
- ✅ Row Level Security enabled on all tables
- ✅ Public read access for experiences and slots
- ✅ Booking creation allowed for all users
- ✅ Promo code validation available

### Sample Data:
- **Experiences**: Sunset Yacht Cruise, Mountain Hiking, Culinary Tour, Hot Air Balloon, Photography Workshop, Wine Tasting
- **Slots**: Available for next 14 days with morning, afternoon, and evening times
- **Promo Codes**: SAVE10 (10% off), FLAT100 ($100 off), WELCOME20 (20% off)

## Post-Deployment Checklist

After deployment, verify:

- [ ] Home page loads and displays all 6 experiences
- [ ] Experience detail pages show available slots
- [ ] Slot selection and booking flow works
- [ ] Promo codes validate correctly
- [ ] Booking confirmation displays properly
- [ ] All images load from Pexels
- [ ] Mobile responsive design works
- [ ] Error handling displays correctly

## Testing the Deployment

### Test Booking Flow:

1. Navigate to your deployed URL
2. Click on any experience
3. Select date, time, and number of people
4. Click "Continue to Checkout"
5. Fill in customer information:
   - Name: Test User
   - Email: test@example.com
   - Phone: +1234567890
6. Apply promo code: SAVE10
7. Click "Confirm Booking"
8. Verify booking reference is displayed

### Test Promo Codes:

- **SAVE10**: Should give 10% discount
- **FLAT100**: Should give $100 flat discount
- **WELCOME20**: Should give 20% discount

## Monitoring

### Check Database:

```sql
-- View all bookings
SELECT * FROM bookings ORDER BY created_at DESC;

-- Check slot availability
SELECT * FROM experience_slots WHERE available_capacity > 0;

-- Monitor promo code usage
SELECT code, current_uses, max_uses FROM promo_codes;
```

## Production URLs

- **Frontend**: `https://your-app.vercel.app`
- **Database**: `https://zbhccyyiyvvsxysdxijl.supabase.co`

## Troubleshooting

### Build Fails
- Check environment variables are set correctly
- Ensure all dependencies are in package.json
- Run `npm run build` locally first

### API Routes Not Working
- Verify environment variables in Vercel
- Check Supabase connection in logs
- Ensure RLS policies allow access

### Images Not Loading
- Images are hosted on Pexels CDN
- Check network tab for CORS issues
- Verify image URLs in database

## Maintenance

### Adding New Experiences:

```sql
INSERT INTO experiences (
  title, description, image_url, location, duration,
  price, category, rating, max_capacity, highlights,
  included_items, requirements
) VALUES (
  'Your Experience Title',
  'Description...',
  'https://images.pexels.com/...',
  'Location',
  '3 hours',
  199,
  'Category',
  4.5,
  10,
  '["Highlight 1", "Highlight 2"]'::jsonb,
  '["Included 1", "Included 2"]'::jsonb,
  '["Requirement 1"]'::jsonb
);
```

### Adding Slots:

```sql
INSERT INTO experience_slots (
  experience_id, date, start_time, end_time,
  available_capacity, is_available
) VALUES (
  'experience-uuid',
  '2025-12-01',
  '09:00:00',
  '12:00:00',
  12,
  true
);
```

## Support

For deployment issues:
- Check Vercel deployment logs
- Review Supabase logs in dashboard
- Verify environment variables

---

Last Updated: October 30, 2025
