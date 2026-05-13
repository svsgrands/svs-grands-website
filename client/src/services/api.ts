import { ROOM_NAMES, NORMAL_RATES } from '../utils/pricing';
import type { BookingData } from '../types';

/**
 * MOCKED API SERVICES
 * All database operations have been disabled for static deployment.
 */

export const fetchRooms = async () => {
  return Object.entries(ROOM_NAMES).map(([id, name]) => {
    const config = NORMAL_RATES[id as keyof typeof NORMAL_RATES];
    return {
      id,
      type: name,
      defaultPrice: config.price12h || config.price24h,
      amenities: id.includes('NONAC') ? ['WiFi', '24/7 Water'] : ['AC', 'WiFi', '24/7 Water'],
      images: ['https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&q=80']
    }
  });
};

export const checkAvailability = async () => {
  // Always return available in static mode
  return { available: true };
};

export const createBooking = async (data: BookingData) => {
  console.log('Static Mode: Booking attempt ignored.', data);
  
  // Return a mock success response
  return {
    message: 'Booking request received (Static Mode)',
    booking: { 
      ...data, 
      bookingId: 'mock-' + Math.random().toString(36).substr(2, 9), 
      status: 'pending' 
    }
  };
};

export const getBooking = async (id: string) => {
  console.log('Static Mode: Fetching mock booking for ID:', id);
  
  // Return a mock not found or empty state
  throw new Error('Booking retrieval disabled in static mode');
};
