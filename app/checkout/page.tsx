"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Loader2 } from 'lucide-react';

interface BookingData {
  experienceId: string;
  experienceTitle: string;
  experienceImage: string;
  slotId: string;
  date: string;
  time: string;
  numPeople: number;
  pricePerPerson: number;
  subtotal: number;
}

export default function Checkout() {
  const router = useRouter();
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [loading, setLoading] = useState(false);
  const [promoLoading, setPromoLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    agreedToTerms: false,
  });

  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<{
    code: string;
    discountAmount: number;
    totalAmount: number;
  } | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem('bookingData');
    if (stored) {
      setBookingData(JSON.parse(stored));
    } else {
      router.push('/');
    }
  }, [router]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.customerName.trim()) {
      newErrors.customerName = 'Name is required';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.customerEmail.trim()) {
      newErrors.customerEmail = 'Email is required';
    } else if (!emailRegex.test(formData.customerEmail)) {
      newErrors.customerEmail = 'Invalid email format';
    }

    if (!formData.agreedToTerms) {
      newErrors.terms = 'You must agree to the terms and safety policy';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleApplyPromo = async () => {
    if (!promoCode.trim() || !bookingData) return;

    setPromoLoading(true);
    try {
      const response = await fetch('/api/promo/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: promoCode,
          subtotal: bookingData.subtotal,
        }),
      });

      const data = await response.json();

      if (response.ok && data.valid) {
        setAppliedPromo({
          code: promoCode.toUpperCase(),
          discountAmount: data.discountAmount,
          totalAmount: data.totalAmount + Math.round(bookingData.subtotal * 0.06), // Include taxes
        });
        setErrors({ ...errors, promo: '' });
      } else {
        setErrors({ ...errors, promo: data.error || 'Invalid promo code' });
        setAppliedPromo(null);
      }
    } catch (error) {
      setErrors({ ...errors, promo: 'Failed to validate promo code' });
    } finally {
      setPromoLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !bookingData) return;

    setLoading(true);

    const taxRate = 0.06;
    const taxes = Math.round(bookingData.subtotal * taxRate);
    const finalTotal = appliedPromo?.totalAmount || (bookingData.subtotal + taxes);

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slot_id: bookingData.slotId,
          customer_name: formData.customerName,
          customer_email: formData.customerEmail,
          number_of_people: bookingData.numPeople,
          promo_code: appliedPromo?.code || null,
          discount_amount: appliedPromo?.discountAmount || 0,
          subtotal: bookingData.subtotal,
          total_amount: finalTotal,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        sessionStorage.setItem(
          'bookingResult',
          JSON.stringify({
            success: true,
            booking: data.booking,
            experience: {
              title: bookingData.experienceTitle,
              image: bookingData.experienceImage,
            },
          })
        );
        sessionStorage.removeItem('bookingData');
        router.push('/result');
      } else {
        sessionStorage.setItem(
          'bookingResult',
          JSON.stringify({
            success: false,
            error: data.error || 'Failed to create booking',
          })
        );
        router.push('/result');
      }
    } catch (error) {
      sessionStorage.setItem(
        'bookingResult',
        JSON.stringify({
          success: false,
          error: 'An unexpected error occurred',
        })
      );
      router.push('/result');
    } finally {
      setLoading(false);
    }
  };

  if (!bookingData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Taxes & final total
  const taxRate = 0.06;
  const taxes = Math.round(bookingData.subtotal * taxRate);
  const finalTotal = appliedPromo?.totalAmount || (bookingData.subtotal + taxes);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="px-6 py-4">
        <button
          onClick={() =>
            router.push('/experience/' + bookingData.experienceId)
          }
          className="flex items-center gap-2 text-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Details</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Form */}
          <div>
            <div className="p-6 bg-muted/30 border border-border rounded-lg">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name and Email Row */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">
                      Full name
                    </label>
                    <Input
                      value={formData.customerName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          customerName: e.target.value,
                        })
                      }
                      placeholder="Your name"
                      className={`bg-muted/50 ${
                        errors.customerName ? 'border-red-500' : ''
                      }`}
                    />
                    {errors.customerName && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.customerName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">
                      Email
                    </label>
                    <Input
                      type="email"
                      value={formData.customerEmail}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          customerEmail: e.target.value,
                        })
                      }
                      placeholder="Your email"
                      className={`bg-muted/50 ${
                        errors.customerEmail ? 'border-red-500' : ''
                      }`}
                    />
                    {errors.customerEmail && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.customerEmail}
                      </p>
                    )}
                  </div>
                </div>

                {/* Promo Code */}
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">
                    Promo code
                  </label>
                  <div className="flex gap-2">
                    <Input
                      value={promoCode}
                      onChange={(e) =>
                        setPromoCode(e.target.value.toUpperCase())
                      }
                      placeholder="Promo code"
                      className="bg-muted/50 flex-1"
                      disabled={!!appliedPromo}
                    />
                    <Button
                      type="button"
                      onClick={handleApplyPromo}
                      disabled={promoLoading || !promoCode.trim() || !!appliedPromo}
                      className="bg-foreground text-background hover:bg-foreground/90 px-6"
                    >
                      {promoLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        'Apply'
                      )}
                    </Button>
                  </div>
                  {errors.promo && (
                    <p className="text-red-500 text-xs mt-1">{errors.promo}</p>
                  )}
                  {appliedPromo && (
                    <p className="text-green-600 text-xs mt-1">
                      Promo code applied! Discount: ₹{appliedPromo.discountAmount}
                    </p>
                  )}
                </div>

                {/* Terms Checkbox */}
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="terms"
                    checked={formData.agreedToTerms}
                    onCheckedChange={(checked) =>
                      setFormData({
                        ...formData,
                        agreedToTerms: checked as boolean,
                      })
                    }
                  />
                  <label
                    htmlFor="terms"
                    className="text-sm text-muted-foreground cursor-pointer"
                  >
                    I agree to the terms and safety policy
                  </label>
                </div>
                {errors.terms && (
                  <p className="text-red-500 text-xs">{errors.terms}</p>
                )}
              </form>
            </div>
          </div>

          {/* Right Column - Summary */}
          <div>
            <div className="p-6 border-[3px] border-pink-500 rounded-lg bg-card shadow-sm">
              <div className="space-y-4">
                {/* Experience Details */}
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Experience</span>
                  <span className="font-medium">{bookingData.experienceTitle}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Date</span>
                  <span className="font-medium">{bookingData.date}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Time</span>
                  <span className="font-medium">{bookingData.time}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Qty</span>
                  <span className="font-medium">{bookingData.numPeople}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">₹{bookingData.subtotal}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Taxes</span>
                  <span className="font-medium">₹{taxes}</span>
                </div>

                {appliedPromo && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Discount</span>
                    <span>-₹{appliedPromo.discountAmount}</span>
                  </div>
                )}

                {/* Total */}
                <div className="pt-4 border-t border-border">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-xl font-bold">Total</span>
                    <span className="text-xl font-bold">₹{finalTotal}</span>
                  </div>

                  {/* Pay Button */}
                  <Button
                    onClick={handleSubmit}
                    disabled={loading || promoLoading}
                    className="w-full bg-[#FBC02D] hover:bg-[#F9A825] text-foreground font-semibold py-6 text-base"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                        Processing...
                      </>
                    ) : (
                      'Pay and Confirm'
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
