"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";

import { ArrowLeft, Route } from "lucide-react";
import { Experience, ExperienceSlot } from "@/lib/supabase";



export default function ExperienceDetails() {
  const params = useParams();
  const router = useRouter();
  const [experience, setExperience] = useState<Experience | null>(null);
  const [slots, setSlots] = useState<ExperienceSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedSlot, setSelectedSlot] = useState<ExperienceSlot | null>(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchExperienceDetails = async () => {
      try {
        const response = await fetch(`/api/experiences/${params.id}`);
        if (!response.ok) throw new Error('Failed to fetch experience details');
        const data = await response.json();
        setExperience(data.experience);
        setSlots(data.slots);
        
        // Set first available date as default
        if (data.slots.length > 0) {
          setSelectedDate(data.slots[0].date);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchExperienceDetails();
  }, [params.id]);

  const groupedSlotsByDate = useMemo(() => {
    const grouped: { [key: string]: ExperienceSlot[] } = {};
    slots.forEach((slot) => {
      if (!grouped[slot.date]) {
        grouped[slot.date] = [];
      }
      grouped[slot.date].push(slot);
    });
    return grouped;
  }, [slots]);

  const selectedDateSlots = groupedSlotsByDate[selectedDate] || [];
  const availableDates = Object.keys(groupedSlotsByDate).slice(0, 5);

  const formatButtonDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('en-US', { month: 'short' });
    return `${month} ${day}`;
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'pm' : 'am';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const startsAt = experience?.price || 999;
  const subtotal = startsAt * quantity;
  const taxRate = 0.06;
  const taxes = Math.round(subtotal * taxRate);
  const total = subtotal + taxes;

  const handleBooking = () => {
    if (selectedSlot && experience) {
      const bookingData = {
        experienceId: experience.id,
        experienceTitle: experience.title,
        experienceImage: experience.image_url,
        slotId: selectedSlot.id,
        date: selectedSlot.date,
        time: `${formatTime(selectedSlot.start_time)} - ${formatTime(selectedSlot.end_time)}`,
        numPeople: quantity,
        pricePerPerson: experience.price,
        subtotal,
        taxes,
        total,
      };
      sessionStorage.setItem('bookingData', JSON.stringify(bookingData));
      router.push('/checkout');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading experience...</p>
        </div>
      </div>
    );
  }

  if (error || !experience) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md p-8">
          <h2 className="text-2xl font-bold text-destructive mb-4">Error</h2>
          <p className="text-muted-foreground mb-6">{error || 'Experience not found'}</p>
          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Details
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <button 
            onClick={() => router.push('/')}
            className="flex items-center gap-2 text-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back To HomePage</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Image */}
            <div className="rounded-xl overflow-hidden">
              <img
                src={experience.image_url}
                alt={experience.title}
                className="w-full h-[320px] object-cover"
              />
            </div>

            {/* Title */}
            <h1 className="text-3xl font-bold text-foreground">{experience.title}</h1>

            {/* Description */}
            <p className="text-sm text-muted-foreground leading-relaxed">
              {experience.description}
            </p>

            {/* Choose date */}
            <div className="space-y-3">
              <h2 className="text-base font-semibold text-foreground">Choose date</h2>
              <div className="flex gap-2">
                {availableDates.map((date) => (
                  <button
                    key={date}
                    onClick={() => {
                      setSelectedDate(date);
                      setSelectedSlot(null);
                    }}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      selectedDate === date
                        ? "bg-amber-400 text-foreground"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    {formatButtonDate(date)}
                  </button>
                ))}
              </div>
            </div>

            {/* Choose time */}
            <div className="space-y-3">
              <h2 className="text-base font-semibold text-foreground">Choose time</h2>
              <div className="flex gap-3">
                {selectedDateSlots.map((slot) => (
                  <button
                    key={slot.id}
                    onClick={() => slot.available_capacity >= quantity && setSelectedSlot(slot)}
                    disabled={slot.available_capacity === 0}
                    className={`relative px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      slot.available_capacity === 0
                        ? "bg-muted text-muted-foreground cursor-not-allowed"
                        : selectedSlot?.id === slot.id
                        ? "bg-card border-2 border-foreground text-foreground"
                        : "bg-card border border-border text-foreground hover:border-foreground/50"
                    }`}
                  >
                    <div>{formatTime(slot.start_time)}</div>
                    <div
                      className={`text-xs mt-1 ${
                        slot.available_capacity === 0 ? "text-muted-foreground" : "text-red-500"
                      }`}
                    >
                      {slot.available_capacity === 0 ? "Sold out" : `${slot.available_capacity} left`}
                    </div>
                  </button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">All times are in IST (GMT +5:30)</p>
            </div>

            {/* About */}
            {/* <div className="space-y-3">
              <h2 className="text-base font-semibold text-foreground">About</h2>
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-sm text-muted-foreground">
                  Scenic routes, trained guides, and safety briefing. Minimum age 10.
                </p>
              </div>
            </div> */}
          </div>

          {/* Right Column - Booking Card */}
          <div className="lg:sticky lg:top-8 h-fit">
            <div className="bg-card border border-border rounded-lg p-6 space-y-6">
              {/* Starts at */}
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Starts at</span>
                <span className="font-semibold text-foreground">₹{startsAt}</span>
              </div>

              {/* Quantity */}
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Quantity</span>
                <div className="flex items-center gap-3 border border-border rounded-md">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    −
                  </button>
                  <span className="font-semibold text-foreground">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-1 text-foreground hover:text-foreground/80 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="border-t border-border pt-4 space-y-3">
                {/* Subtotal */}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-foreground">₹{subtotal}</span>
                </div>

                {/* Taxes */}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Taxes</span>
                  <span className="text-foreground">₹{taxes}</span>
                </div>
              </div>

              {/* Total */}
              <div className="border-t border-border pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-foreground">Total</span>
                  <span className="text-lg font-bold text-foreground">₹{total}</span>
                </div>
              </div>

              {/* Confirm Button */}
              <button
                onClick={handleBooking}
                disabled={!selectedSlot}
                className={`w-full py-3 rounded-md text-sm font-medium transition-colors ${
                  selectedSlot
                    ? " text-primary-foreground text-lg bg-[#FBC02D] hover:bg-[#F9A825] cursor-pointer"
                    : "bg-muted text-muted-foreground cursor-not-allowed"
                }`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

