import { useState, useEffect } from 'react';
import { formatDate } from '../utils/formatDate';
import DateRangePicker from '../components/DateRangePicker';
import { useSearchParams } from 'react-router-dom';
import { createBooking } from '../services/api';
import type { BookingResponse } from '../types';
import { calculatePrice, ROOM_NAMES, NORMAL_RATES } from '../utils/pricing';
import type { RoomId } from '../utils/pricing';
import './CheckoutPage.css';

export default function CheckoutPage() {
  const [searchParams] = useSearchParams();
  
  const today = new Date().toISOString().split('T')[0];

  // Initialize from URL params or defaults
  const paramRoom = searchParams.get('roomType');
  const initialRoom = (paramRoom && paramRoom in ROOM_NAMES) ? (paramRoom as RoomId) : 'CLASSIC';
  
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const paramCheckIn = searchParams.get('checkIn') || today;
  const paramCheckOut = searchParams.get('checkOut') || tomorrow.toISOString().split('T')[0];
  const paramGuests = parseInt(searchParams.get('guests') || '2', 10);

  const [step, setStep] = useState<'form' | 'success'>('form');
  const [loading, setLoading] = useState(false);
  const [bookingResult, setBookingResult] = useState<BookingResponse | null>(null);
  const [formError, setFormError] = useState('');
  
  const [pricingDetails, setPricingDetails] = useState<{totalPrice: number, error?: string}>({ totalPrice: 0 });

  const [formData, setFormData] = useState({
    roomType: initialRoom,
    checkInDate: paramCheckIn,
    checkInTime: '12:00',
    checkOutDate: paramCheckOut,
    checkOutTime: '12:00',
    guestName: '',
    guestPhone: '',
    guestEmail: '',
    numberOfGuests: paramGuests,
    specialRequests: '',
  });

  // Calculate pricing when dependencies change
  useEffect(() => {
    if (!formData.checkInDate || !formData.checkOutDate) return;
    try {
      const ci = new Date(`${formData.checkInDate}T${formData.checkInTime}`);
      const co = new Date(`${formData.checkOutDate}T${formData.checkOutTime}`);
      
      const result = calculatePrice(ci, co, formData.roomType, formData.numberOfGuests);
      setPricingDetails({ totalPrice: result.totalPrice, error: result.error });
    } catch {
      setPricingDetails({ totalPrice: 0, error: 'Invalid date/time format.' });
    }
  }, [formData.checkInDate, formData.checkInTime, formData.checkOutDate, formData.checkOutTime, formData.roomType, formData.numberOfGuests]);

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setFormError('');
  };

  const getRoomImage = (id: string) => {
    if (id === 'DELUXE') return '/assets/rooms/deluxe/1.webp';
    if (id === 'SUPERIOR') return '/assets/rooms/superior/1.webp';
    if (id === 'FAMILY_COMFORT') return '/assets/rooms/family-comfort/1.webp';
    if (id === 'CLASSIC') return '/assets/rooms/classic/1.webp';
    if (id === 'STANDARD') return '/assets/rooms/standard/1.webp';
    return '/assets/rooms/classic/1.webp';
  };

  const generateWhatsAppUrl = (bookingId?: string) => {
    const ci = new Date(`${formData.checkInDate}T${formData.checkInTime}`);
    const co = new Date(`${formData.checkOutDate}T${formData.checkOutTime}`);
    const hours = Math.max(0, Math.ceil((co.getTime() - ci.getTime()) / (1000 * 60 * 60)));
    const checkInDisplay = new Date(formData.checkInDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    const checkOutDisplay = new Date(formData.checkOutDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

    const message = encodeURIComponent(
      `🏨 *New Checkout Booking - SVS Grands*\n\n` +
      (bookingId ? `📋 *Booking ID:* ${bookingId}\n` : '') +
      `🛏️ *Room:* ${ROOM_NAMES[formData.roomType]}\n` +
      `📅 *Check-In:* ${checkInDisplay} at ${formData.checkInTime}\n` +
      `📅 *Check-Out:* ${checkOutDisplay} at ${formData.checkOutTime}\n` +
      `⏱️ *Duration:* ${hours} Hours\n` +
      `💰 *Total:* ₹${pricingDetails.totalPrice.toLocaleString('en-IN')}\n\n` +
      `👤 *Guest:* ${formData.guestName}\n` +
      `📞 *Phone:* ${formData.guestPhone}\n` +
      `👥 *Guests:* ${formData.numberOfGuests}\n` +
      (formData.specialRequests ? `📝 *Requests:* ${formData.specialRequests}\n` : '')
    );
    return `https://wa.me/918341199779?text=${message}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.checkInDate || !formData.checkOutDate || !formData.guestName || !formData.guestPhone) {
      setFormError('Please fill in all required fields (Dates, name, and phone).');
      return;
    }

    if (pricingDetails.error) {
      setFormError(pricingDetails.error);
      return;
    }

    setLoading(true);
    setFormError('');

    try {
      const checkIn = `${formData.checkInDate}T${formData.checkInTime}:00`;
      const checkOut = `${formData.checkOutDate}T${formData.checkOutTime}:00`;
      const ciDate = new Date(checkIn);
      const coDate = new Date(checkOut);
      const hours = Math.ceil((coDate.getTime() - ciDate.getTime()) / (1000 * 60 * 60));

      const result = await createBooking({
        guestName: formData.guestName,
        guestPhone: formData.guestPhone,
        guestEmail: formData.guestEmail,
        roomType: ROOM_NAMES[formData.roomType],
        checkIn,
        checkOut,
        duration: `${hours} hours`,
        numberOfGuests: formData.numberOfGuests,
        totalAmount: pricingDetails.totalPrice,
        specialRequests: formData.specialRequests,
      });

      setBookingResult(result);
      setStep('success');
    } catch {
      const checkIn = `${formData.checkInDate}T${formData.checkInTime}:00`;
      const checkOut = `${formData.checkOutDate}T${formData.checkOutTime}:00`;
      const hours = Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60));

      setBookingResult({
        message: 'Booking sent via WhatsApp',
        booking: {
          bookingId: `WA-${Date.now()}`,
          guestName: formData.guestName,
          guestPhone: formData.guestPhone,
          roomType: ROOM_NAMES[formData.roomType],
          checkIn,
          checkOut,
          duration: `${hours} hours`,
          totalAmount: pricingDetails.totalPrice,
          status: 'pending',
        },
        whatsappUrl: generateWhatsAppUrl(),
      });
      setStep('success');
    } finally {
      setLoading(false);
    }
  };

  if (step === 'success') {
    return (
      <div className="checkout-page">
        <div className="container">
          <div className="glass-card checkout-success">
            <div className="checkout-success-icon">🎉</div>
            <h1 className="checkout-success-title">Your Reservation is Confirmed</h1>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              Booking Reference: <strong style={{ color: 'var(--text-primary)' }}>{bookingResult?.booking?.bookingId}</strong>
            </p>
            <p style={{ maxWidth: '600px', margin: '0 auto 32px', lineHeight: 1.8 }}>
              Thank you for choosing SVS Grands. We've received your reservation details and look forward to welcoming you. 
              Our team may contact you shortly to confirm any special requests.
            </p>
            
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
              {bookingResult?.whatsappUrl && (
                <a href={bookingResult.whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn-primary">
                  💬 Share Details on WhatsApp
                </a>
              )}
              <a href="/" className="btn-outline">Return to Home</a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        {/* Left Column: Form Details */}
        <div className="checkout-form-section">
          <h1 className="checkout-heading">1. Guest Details</h1>
          
          {(formError || pricingDetails.error) && (
            <div className="checkout-error">
              ⚠️ {formError || pricingDetails.error}
            </div>
          )}

          <form id="checkout-form" onSubmit={handleSubmit}>
            <div className="checkout-form-row">
              <div className="checkout-form-group">
                <label className="checkout-label">First Name *</label>
                <input 
                  type="text" 
                  className="checkout-input" 
                  required 
                  placeholder="e.g. John"
                  value={formData.guestName.split(' ')[0] || ''}
                  onChange={e => handleChange('guestName', e.target.value + ' ' + (formData.guestName.split(' ').slice(1).join(' ') || ''))} 
                />
              </div>
              <div className="checkout-form-group">
                <label className="checkout-label">Last Name *</label>
                <input 
                  type="text" 
                  className="checkout-input" 
                  required 
                  placeholder="e.g. Doe"
                  value={formData.guestName.split(' ').slice(1).join(' ') || ''}
                  onChange={e => handleChange('guestName', (formData.guestName.split(' ')[0] || '') + ' ' + e.target.value)} 
                />
              </div>
            </div>

            <div className="checkout-form-row">
              <div className="checkout-form-group">
                <label className="checkout-label">Phone Number *</label>
                <input 
                  type="tel" 
                  className="checkout-input" 
                  required 
                  pattern="[0-9]{10}"
                  placeholder="10-digit mobile number"
                  value={formData.guestPhone}
                  onChange={e => handleChange('guestPhone', e.target.value)} 
                />
              </div>
              <div className="checkout-form-group">
                <label className="checkout-label">Email Address (Optional)</label>
                <input 
                  type="email" 
                  className="checkout-input" 
                  placeholder="For booking confirmation"
                  value={formData.guestEmail}
                  onChange={e => handleChange('guestEmail', e.target.value)} 
                />
              </div>
            </div>

            <h1 className="checkout-heading" style={{ marginTop: '48px' }}>2. Stay Preferences</h1>

            <div className="checkout-form-row">
              <div className="checkout-form-group">
                <label className="checkout-label">Room Configuration</label>
                <select 
                  className="checkout-input"
                  value={formData.roomType} 
                  onChange={e => handleChange('roomType', e.target.value)}
                >
                  {Object.entries(ROOM_NAMES).map(([id, name]) => (
                    <option key={id} value={id}>{name}</option>
                  ))}
                </select>
              </div>
              <div className="checkout-form-group">
                <label className="checkout-label">Number of Guests</label>
                <select 
                  className="checkout-input"
                  value={formData.numberOfGuests} 
                  onChange={e => handleChange('numberOfGuests', +e.target.value)}
                >
                  {Array.from({ length: 5 }, (_, i) => i + 1).map(n => 
                    <option key={n} value={n}>{n} Guest{n > 1 ? 's' : ''}</option>
                  )}
                </select>
              </div>
            </div>

            <div className="checkout-form-group">
              <label className="checkout-label">Stay Dates *</label>
              <DateRangePicker
                checkInDate={formData.checkInDate}
                checkOutDate={formData.checkOutDate}
                onCheckInChange={val => handleChange('checkInDate', val)}
                onCheckOutChange={val => handleChange('checkOutDate', val)}
              />
            </div>

            <div className="checkout-form-row">
              <div className="checkout-form-group">
                <label className="checkout-label">Arrival Time *</label>
                <input 
                  type="time" 
                  className="checkout-input" 
                  required 
                  value={formData.checkInTime}
                  onChange={e => handleChange('checkInTime', e.target.value)} 
                />
              </div>
              <div className="checkout-form-group">
                <label className="checkout-label">Departure Time *</label>
                <input 
                  type="time" 
                  className="checkout-input" 
                  required 
                  value={formData.checkOutTime}
                  onChange={e => handleChange('checkOutTime', e.target.value)} 
                />
              </div>
            </div>

            <div className="checkout-form-group" style={{ marginTop: '24px' }}>
              <label className="checkout-label">Special Requests or Enhancements</label>
              <textarea 
                className="checkout-input" 
                rows={4}
                placeholder="E.g., Extra bed, ground floor preference, late arrival..."
                value={formData.specialRequests}
                onChange={e => handleChange('specialRequests', e.target.value)} 
              />
            </div>
          </form>
        </div>

        {/* Right Column: Reservation Summary */}
        <div className="checkout-summary-section">
          <div className="checkout-summary-card">
            <div className="checkout-summary-header">
              Your Reservation
            </div>
            <img src={getRoomImage(formData.roomType)} alt="Selected Room" className="checkout-summary-image" />
            
            <div className="checkout-summary-body">
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', color: 'var(--secondary)', marginBottom: '16px' }}>
                {ROOM_NAMES[formData.roomType]}
              </h3>

              <div className="checkout-summary-item">
                <span className="checkout-summary-label">Check-in</span>
                <span className="checkout-summary-value">{formatDate(formData.checkInDate)} / {formData.checkInTime}</span>
              </div>
              <div className="checkout-summary-item">
                <span className="checkout-summary-label">Check-out</span>
                <span className="checkout-summary-value">{formatDate(formData.checkOutDate)} / {formData.checkOutTime}</span>
              </div>
              <div className="checkout-summary-item">
                <span className="checkout-summary-label">Guests</span>
                <span className="checkout-summary-value">{formData.numberOfGuests} Persons</span>
              </div>

              {formData.numberOfGuests > NORMAL_RATES[formData.roomType].includedPersons && (
                 <div className="checkout-summary-item" style={{ color: 'var(--primary)', fontWeight: 500 }}>
                   <span>Extra guest surcharge</span>
                   <span>Included</span>
                 </div>
              )}

              <div className="checkout-summary-item total">
                <span>Total Amount</span>
                <span>{pricingDetails.error ? '—' : `₹${pricingDetails.totalPrice.toLocaleString('en-IN')}`}</span>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--success)', textAlign: 'right', marginTop: '-8px', marginBottom: '24px' }}>
                Taxes Included
              </p>

              <button 
                type="submit" 
                form="checkout-form"
                className="btn-primary" 
                style={{ width: '100%', justifyContent: 'center', padding: '16px' }}
                disabled={loading || !!pricingDetails.error}
              >
                {loading ? 'Processing...' : 'Complete Booking'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
