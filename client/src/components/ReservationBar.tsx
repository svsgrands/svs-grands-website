import { useState } from 'react';
import { ROOM_NAMES } from '../utils/pricing';
import type { RoomId } from '../utils/pricing';
import DateRangePicker from './DateRangePicker';

interface ReservationBarProps {
  inline?: boolean;
}

export default function ReservationBar({ inline }: ReservationBarProps) {
  const today = new Date().toISOString().split('T')[0];

  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  const [checkIn, setCheckIn] = useState(today);
  const [checkOut, setCheckOut] = useState(tomorrow);
  const [roomType, setRoomType] = useState<RoomId>('CLASSIC');
  const [guests, setGuests] = useState(1);

  const handleBook = () => {
    window.open(
      "https://asiatech.in/booking_engine/index3?token=MTA4NTA=",
      "_blank"
    );
  };

  return (
    <div className={`reservation-bar ${inline ? 'reservation-bar--inline' : ''}`}>
      <div className="reservation-bar-inner">
        <div className="reservation-bar-title">
          {inline ? 'BOOK ONLINE' : 'RESERVATION'}
        </div>

        <div className="reservation-bar-field" style={{ flex: 1.5 }}>
          <DateRangePicker
            checkInDate={checkIn}
            checkOutDate={checkOut}
            onCheckInChange={setCheckIn}
            onCheckOutChange={setCheckOut}
            direction={inline ? 'up' : 'up'}
            variant="compact"
          />
        </div>

        <div
          className="reservation-bar-divider"
          style={{ margin: inline ? '0 32px' : '0 24px' }}
        />

        <div className="reservation-bar-field">
          <select
            value={roomType}
            onChange={e => setRoomType(e.target.value as RoomId)}
          >
            {Object.entries(ROOM_NAMES).map(([id, name]) => (
              <option key={id} value={id}>
                {name}
              </option>
            ))}
          </select>
        </div>

        <div className="reservation-bar-divider" />

        <div className="reservation-bar-field">
          <select
            value={guests}
            onChange={e => setGuests(+e.target.value)}
          >
            {Array.from({ length: 5 }, (_, i) => i + 1).map(n => (
              <option key={n} value={n}>
                {n} Guest{n > 1 ? 's' : ''}
              </option>
            ))}
          </select>
        </div>

        <button className="reservation-bar-book" onClick={handleBook}>
          {inline ? 'FIND ROOM' : 'BOOK NOW'}
        </button>
      </div>

      {/* Mobile: compact sticky button */}
      {!inline && (
        <button className="reservation-bar-mobile" onClick={handleBook}>
          🏨 Book Your Stay
        </button>
      )}
    </div>
  );
}
