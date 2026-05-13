import { useState, useEffect, useRef, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { calculatePrice, ROOM_NAMES, NORMAL_RATES } from '../utils/pricing';
import type { RoomId } from '../utils/pricing';
import { client, ROOMS_QUERY, urlFor } from '../lib/sanity';
import './RoomsPage.css';

interface SanityRoomMatch {
  id?: string;
  name: string;
  isVisible?: boolean;
  occupancy?: string;
  coverImage?: string;
  shortDescription?: string;
  fullDescription?: string;
  price?: number;
  amenities?: string[];
}

const getRoomImage = (id: string) => {
  if (id === 'DELUXE') return '/assets/rooms/deluxe/2.png';
  if (id === 'SUPERIOR') return '/assets/rooms/superior/1.png';
  if (id === 'FAMILY_COMFORT') return '/assets/rooms/family-comfort/2.png';
  if (id === 'CLASSIC') return '/assets/rooms/classic/1.png';
  if (id === 'STANDARD') return '/assets/rooms/standard/2.png';
  return '/assets/rooms/classic/1.png';
};

const getImageUrl = (source: string | object | undefined) => {
  if (!source) return '/assets/BackgroundPC.jpg';
  if (typeof source === 'string') return source;
  try {
    return urlFor(source).url();
  } catch (_err) {
    return '/assets/BackgroundPC.jpg';
  }
};

const getRoomDescription = (id: string) => {
  if (id === 'DELUXE' || id === 'SUPERIOR' || id === 'FAMILY_COMFORT') {
    return 'Spacious double bed configuration ideal for families or large groups.';
  }
  if (id === 'STANDARD') {
    return 'Well-ventilated rooms designed for a comfortable stay. Available in both TV and non-TV configurations to suit your preference.';
  }
  return 'Premium climate-controlled rooms for a comfortable and relaxing stay. Available in both TV and non-TV configurations to suit your preference.';
};

const defaultRoomsData = Object.keys(ROOM_NAMES).map((key) => {
  const id = key as RoomId;
  const isFamily = id === 'DELUXE' || id === 'SUPERIOR' || id === 'FAMILY_COMFORT';
  const isAC = id === 'CLASSIC' || id === 'DELUXE' || id === 'SUPERIOR';
  const isOptionalTV = id === 'CLASSIC' || id === 'STANDARD';

  const rates = NORMAL_RATES[id];
  return {
    id,
    title: ROOM_NAMES[id],
    bedTypes: isFamily ? 'Two Double Beds' : 'Single Double Bed',
    image: getRoomImage(id),
    description: getRoomDescription(id),
    price: rates.price12h || rates.price24h,
    amenities: [
      isAC ? 'Air Conditioning' : 'Fan',
      'Free WiFi', 
      'Hot Water 24/7', 
      isOptionalTV ? 'TV (Optional)' : 'Flat-Screen TV',
      'Room Service'
    ].filter(Boolean) as string[],
  };
});

export default function RoomsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  // States
  const [rooms, setRooms] = useState(defaultRoomsData);
  const [checkInDate] = useState(today);
  const [checkOutDate] = useState(tomorrow.toISOString().split('T')[0]);
  const [guests] = useState(2);
  
  // Animation States
  const [animPhase, setAnimPhase] = useState<'idle' | 'reset' | 'animating'>('idle');
  const [prevImage, setPrevImage] = useState<string | null>(null);
  const lastImageRef = useRef<string | null>(null);
  const LISTING_BG = '/assets/BackgroundPC.jpg';

  // Pricing calculation moved to useMemo to satisfy ESLint and optimize performance
  const pricingMap = useMemo(() => {
    try {
      const ci = new Date(`${checkInDate}T12:00`);
      const co = new Date(`${checkOutDate}T12:00`);
      
      const newPricing: Record<string, { price: number; error?: string }> = {};
      
      rooms.forEach(room => {
        const roomKey = room.id as RoomId;
        if (NORMAL_RATES[roomKey]) {
          const result = calculatePrice(ci, co, roomKey, guests);
          newPricing[room.id] = {
            price: result.totalPrice,
            error: result.error
          };
        } else {
          newPricing[room.id] = { price: typeof room.price === 'number' ? room.price : Number(room.price) || 0 };
        }
      });
      return newPricing;
    } catch (err) {
      console.error("Pricing calculation error:", err);
      return {};
    }
  }, [checkInDate, checkOutDate, guests, rooms]);

  // Hash Routing Logic
  const hash = location.hash;
  const hashIndex = hash ? parseInt(hash.replace('#', '')) : NaN;
  const isDetailsView = !isNaN(hashIndex) && hashIndex >= 0 && hashIndex < rooms.length;
  const activeRoomIndex = isDetailsView ? hashIndex : 0;
  const activeRoom = rooms[activeRoomIndex];

  // Fetch Sanity Content
  useEffect(() => {
    const fetchRoomsFromSanity = async () => {
      try {
        const data = await client.fetch<SanityRoomMatch[]>(ROOMS_QUERY);
        
        const mergedRooms = defaultRoomsData.map(def => {
          const sanityMatch = data?.find((r) => r.id === def.id || r.name === def.title);
          
          if (sanityMatch) {
            if (sanityMatch.isVisible === false) return null;

            return {
              ...def,
              title: sanityMatch.name || def.title,
              bedTypes: sanityMatch.occupancy || def.bedTypes,
              image: sanityMatch.coverImage || def.image,
              description: sanityMatch.shortDescription || sanityMatch.fullDescription || def.description,
              price: sanityMatch.price || def.price,
              amenities: (sanityMatch.amenities && sanityMatch.amenities.length > 0) ? sanityMatch.amenities : def.amenities
            };
          }
          return def;
        }).filter((r): r is NonNullable<typeof r> => r !== null);

        setRooms(mergedRooms);
      } catch (err) {
        console.error('Sanity fetch error:', err);
      }
    };
    fetchRoomsFromSanity();
  }, []);

  // Trigger animations on room change or view entry
  useEffect(() => {
    if (isDetailsView && activeRoom) {
      window.scrollTo(0, 0);

      if (lastImageRef.current) {
        if (lastImageRef.current !== activeRoom.image) {
          setPrevImage(lastImageRef.current);
        }
      } else {
        setPrevImage(LISTING_BG);
      }
      
      setAnimPhase('reset');
      lastImageRef.current = activeRoom.image;
      
      const timer = setTimeout(() => {
        setAnimPhase('animating');
      }, 100);

      return () => clearTimeout(timer);
    } else {
      setAnimPhase('idle');
      setPrevImage(null);
      lastImageRef.current = null;
    }
  }, [isDetailsView, activeRoomIndex, activeRoom, LISTING_BG]);

  const handleBookNow = (roomId: string) => {
    navigate(`/checkout?roomType=${roomId}&checkIn=${checkInDate}&checkOut=${checkOutDate}&guests=${guests}`);
  };

  const openDetails = (index: number) => {
    navigate(`/rooms#${index}`);
  };

  const goToListing = () => {
    navigate(`/rooms`);
  };

  const pricing = activeRoom ? pricingMap[activeRoom.id] : null;

  return (
    <div className={`rooms-page-container ${isDetailsView ? 'is-details' : 'is-listing'} phase-${animPhase}`}>
      
      {isDetailsView && (
        <>
          {prevImage && (
            <div 
              className="rooms-details-bg" 
              style={{ backgroundImage: `url('/assets/BackgroundPC.jpg')`, opacity: 1, transform: 'scale(1)', filter: 'none', zIndex: 0 }} 
            />
          )}

          <div 
            key={`active-${activeRoomIndex}`}
            className={`rooms-details-bg ${animPhase === 'animating' ? 'bg-reveal' : ''}`} 
            style={{ backgroundImage: `url(${getImageUrl(activeRoom.image)})`, zIndex: 1 }} 
          />
        </>
      )}

      {!isDetailsView ? (
        <div className="rooms-listing-view">
           <div className="container">
              <div className="rooms-listing-header">
                <h1>ROOMS</h1>
                <div className="page-header-ornament">
                  <span /><span /><span />
                </div>
                <p>
                  Experience unparalleled luxury and comfort in our thoughtfully designed rooms. 
                  Select a room below to discover more about our premium amenities and tranquil spaces.
                </p>
              </div>
              <div className="rooms-grid">
                {rooms.map((room, idx) => (
                  <div 
                    key={room.id} 
                    className={`room-grid-card ${idx === 0 ? 'featured' : 'standard'}`} 
                    onClick={() => openDetails(idx)}
                  >
                    <img src={getImageUrl(room.image)} alt={room.title} className="room-grid-img" />
                    <div className="room-card-overlay">
                      <h2>{room.title.toUpperCase()}</h2>
                    <button
  className="btn-know-more"
  onClick={() =>
    window.open(
      "https://asiatech.in/booking_engine/index3?token=MTA4NTA=",
      "_blank"
    )
  }
>
  BOOK NOW
</button>
                    </div>
                  </div>
                ))}
              </div>
           </div>
        </div>
      ) : (
        <div className="rooms-details-view">
          <aside className={`rd-sidebar ${animPhase === 'animating' ? 'sidebar-slide-in' : ''}`}>
            <h3 className="rd-sidebar-title">Rooms</h3>

            <div className="rd-thumbs-wrap">
              {rooms.map((room, idx) => (
                <div
                  key={room.id}
                  className={`rd-thumb ${idx === activeRoomIndex ? 'rd-thumb--active' : ''} ${animPhase === 'animating' ? 'thumb-fade-in' : ''}`}
                  onClick={() => openDetails(idx)}
                  style={{ animationDelay: animPhase === 'animating' ? `${0.4 + idx * 0.1}s` : '0s' }}
                >
                  <img src={getImageUrl(room.image)} alt={room.title} />
                  <div className="rd-thumb-overlay">
                    <span>{room.title.toUpperCase()}</span>
                  </div>
                </div>
              ))}
            </div>

            <button className="rd-back-btn" onClick={goToListing}>← All Rooms</button>
          </aside>

          <div className={`rd-content-panel ${animPhase === 'animating' ? 'panel-slide-in' : ''}`}>
            <h1 className="rd-room-title stagger-1">{activeRoom.title}</h1>

            <div className="rd-divider stagger-2"></div>

            <p className="rd-description stagger-3">{activeRoom.description}</p>

            <div className="rd-meta-row stagger-4">
              <span>🛏️ {activeRoom?.bedTypes || 'Double Bed'}</span>
              <span>👥 Max {NORMAL_RATES[activeRoom?.id as RoomId]?.maxPersons || 2} Guests</span>
            </div>

            <div className="rd-amenities stagger-5">
              {activeRoom?.amenities?.map((a: string) => (
                <span key={a}>{a}</span>
              ))}
            </div>

            <div className="rd-pricing stagger-6">
              {pricing?.error ? (
                <div className="room-rate-error">{pricing.error}</div>
              ) : (
                <>
                  <div className="rd-price">₹{(pricing?.price || (typeof activeRoom?.price === 'number' ? activeRoom.price : 0)).toLocaleString('en-IN')}</div>
                  <span className="rd-price-note">per night · taxes included</span>
                  {activeRoom?.id && NORMAL_RATES[activeRoom.id as RoomId] && guests > NORMAL_RATES[activeRoom.id as RoomId].includedPersons && (
                    <div className="rd-price-note rd-extra-charge">Includes extra guest charge</div>
                  )}
                </>
              )}
            </div>

            <button
  className="btn-primary rd-book-btn stagger-7"
  onClick={() =>
    window.open(
      "https://asiatech.in/booking_engine/index3?token=MTA4NTA=",
      "_blank"
    )
  }
  disabled={!!pricing?.error}
>
  Reserve This Room
</button> 
          </div>
        </div>
      )}
    </div>
  );
}
