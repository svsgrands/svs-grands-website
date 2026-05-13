import { useState, useEffect, useRef } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { client, HOMEPAGE_QUERY, ROOMS_QUERY, urlFor } from '../lib/sanity';
import ReservationBar from '../components/ReservationBar';

// Import Swiper React components and modules
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';

interface LayoutContext {
  openBooking: (roomType?: string) => void;
}

const defaultSlides = [
  {
    boldText: 'A COZY FAMILY STAY',
    normalText: 'NEAR KONASEEMA TIRUPATHI TEMPLE.',
    bgImage: '/assets/rooms/classic/3.png',
    fgImage: '/assets/rooms/classic/1.png',
    thumbs: [
      '/assets/rooms/classic/1.png',
      '/assets/rooms/standard/2.png',
    ],
  },
  {
    boldText: 'RELAX & RECHARGE',
    normalText: 'THE PERFECT STAY IN VADAPALLI.',
    bgImage: '/assets/rooms/standard/2.png',
    fgImage: '/assets/rooms/superior/1.png',
    thumbs: [
      '/assets/rooms/superior/2.png',
      '/assets/rooms/deluxe/2.png',
    ],
  },
  {
    boldText: 'COMFORTABLE ROOMS',
    normalText: 'AT COMFORTABLE PRICES.',
    bgImage: '/assets/rooms/deluxe/2.png',
    fgImage: '/assets/rooms/deluxe/3.png',
    thumbs: [
      '/assets/rooms/standard/3.png',
      '/assets/rooms/classic/1.png',
    ],
  },
];

const defaultRoomCategories = [
  {
    id: 'STANDARD',
    name: 'Standard Room',
    image: '/assets/rooms/standard/2.png',
    price: '800',
    unit: '/12hrs',
    desc: 'Comfortable rooms with modern amenities — WiFi, TV (Optional), hot water and room service.'
  },
  {
    id: 'CLASSIC',
    name: 'Classic Room',
    image: '/assets/rooms/classic/1.png',
    price: '1,000',
    unit: '/12hrs',
    desc: 'Climate-controlled rooms for a premium stay — all amenities plus air conditioning. TV (Optional).'
  },
  {
    id: 'DELUXE',
    name: 'Deluxe Room',
    image: '/assets/rooms/deluxe/2.png',
    price: '1,500',
    unit: '/12hrs',
    desc: 'Spacious ground floor rooms with a double bed, TV, and premium furnishings for ultimate comfort.'
  },
  {
    id: 'SUPERIOR',
    name: 'Superior Room',
    image: '/assets/rooms/superior/1.png',
    price: '1,500',
    unit: '/12hrs',
    desc: 'Elegant first-floor double bed rooms offering extra privacy, modern decor, and top-tier amenities.'
  },
  {
    id: 'FAMILY_COMFORT',
    name: 'Family Comfort Room',
    image: '/assets/rooms/family-comfort/2.png',
    price: '1,200',
    unit: '/12hrs',
    desc: 'Perfect for families, these spacious first-floor rooms offer great value without compromising on comfort.'
  },
];

const defaultFeatures = [
  { 
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
      </svg>
    ), 
    title: 'Prime Location', 
    desc: '2-minute walk from Sri Venkateswara Swamy Temple.' 
  },
  { 
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="3" width="22" height="13" rx="2" ry="2"/><path d="M7 21h10"/><path d="M12 16v5"/>
      </svg>
    ), 
    title: 'Spacious Parking', 
    desc: 'Secure and ample parking within hotel premises.' 
  },
  { 
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 21h18M3 7v1a3 3 0 0 0 6 0V7m0 1a3 3 0 0 0 6 0V7m0 1a3 3 0 0 0 6 0V7m-18 1h18V4H3v4zM4 21v-7m16 7v-7m-7 7v-4m0-10V4"/>
      </svg>
    ), 
    title: 'Comfort & Hygiene', 
    desc: 'Spotless rooms with daily housekeeping services.' 
  },
  { 
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
      </svg>
    ), 
    title: '24/7 Support', 
    desc: 'Dedicated front desk team always available.' 
  }
];

export default function HomePage() {
  const { openBooking } = useOutletContext<LayoutContext>();
  const [current, setCurrent] = useState(0);
  const [phase, setPhase] = useState<'idle' | 'exit' | 'enter'>('idle');
  const timerRef = useRef<any>(null);

  const getImageUrl = (source: any) => {
    if (!source) return '/assets/BackgroundPC.jpg';
    if (typeof source === 'string') return source;
    try {
      return urlFor(source).url();
    } catch (err) {
      return '/assets/BackgroundPC.jpg';
    }
  };

  // Dynamic States
  const [slides, setSlides] = useState(defaultSlides);
  const [aboutContent, setAboutContent] = useState('Located near the famous Sri Venkateswara Swamy Temple, Vadapalli, SVS Grands offers a peaceful and comfortable stay experience for pilgrims, families, and travelers. Designed with modern comfort and traditional hospitality, our rooms provide a relaxing atmosphere with convenient amenities, flexible stay options, and easy access to nearby spiritual destinations.');
  const [featuresList, setFeaturesList] = useState(defaultFeatures);
  const [rooms, setRooms] = useState(defaultRoomCategories);
  const [benefits, setBenefits] = useState([
    { title: 'Long Stay Benefits', text: 'Book for 7+ Days and enjoy special pricing, complimentary Hi-tea, and a peaceful extended stay experience near Konaseema Tirupathi.', cta: 'CALL 8341199779' },
    { title: 'Group Booking', text: '10+ Rooms available for religious groups, temple visitors, and corporate stays at special tariff.', cta: 'CALL 8341199779' }
  ]);

  const goToSlide = (index: number) => {
    if (index === current || phase !== 'idle' || !slides[index]) return;
    setPhase('exit');

    setTimeout(() => {
      setCurrent(index);
      setTimeout(() => {
        setPhase('enter');
        setTimeout(() => setPhase('idle'), 1000);
      }, 100);
    }, 900);
  };

  useEffect(() => {
    const fetchHome = async () => {
      try {
        const data = await client.fetch(HOMEPAGE_QUERY);
        if (data) {
          if (data.heroMedia && data.heroMedia.length > 0) {
            const mappedSlides = data.heroMedia.map((m: any) => ({
              boldText: data.heroHeading || 'WELCOME TO',
              normalText: data.heroSubheading || 'SVS GRANDS',
              bgImage: m.image || m.fallbackImage || '/assets/BackgroundPC.jpg',
              fgImage: m.image || m.fallbackImage || '/assets/BackgroundPC.jpg',
              thumbs: [m.image || '/assets/rooms/classic/1.png', m.fallbackImage || '/assets/rooms/standard/2.png']
            }));
            setSlides(mappedSlides);
          }
          if (data.aboutContent) setAboutContent(data.aboutContent);
          if (data.features && data.features.length > 0) {
            const mappedFeatures = data.features.map((f: any, i: number) => ({
              icon: defaultFeatures[i]?.icon || defaultFeatures[0].icon,
              title: f.title,
              desc: f.description
            }));
            setFeaturesList(mappedFeatures);
          }
          
          if (data.benefits && data.benefits.length > 0) {
            const mappedBenefits = data.benefits.map((b: any) => ({
              title: b.title,
              text: b.description,
              cta: 'CALL 8341199779' // Hardcoded as per cinematic requirement for this project
            }));
            setBenefits(mappedBenefits);
          }

          // Fetch Rooms for Carousel
          const roomsData = await client.fetch(ROOMS_QUERY);
          if (roomsData && roomsData.length > 0) {
            // Filter for only featured and visible rooms for the homepage carousel
            const featuredRooms = roomsData.filter((r: any) => r.isFeatured !== false && r.isVisible !== false);
            
            if (featuredRooms.length > 0) {
              const mappedRooms = featuredRooms.map((r: any) => {
                const original = defaultRoomCategories.find(d => d.id === r.id || d.name === r.name);
                return {
                  id: r.id || r._id,
                  title: r.name,
                  image: r.coverImage || (original ? original.image : '/assets/rooms/classic/1.png'),
                  description: r.shortDescription || (original ? original.desc : 'Luxury stay experience.')
                };
              });
              setRooms(mappedRooms);
            }
          }
        }
      } catch (error) {
        console.error('Sanity fetch error:', error);
      }
    };
    fetchHome();
  }, []);

  useEffect(() => {
    if (phase !== 'idle' || slides.length === 0) return;
    timerRef.current = setTimeout(() => {
      goToSlide((current + 1) % slides.length);
    }, 5000);
    return () => clearTimeout(timerRef.current);
  }, [current, phase, slides.length]);

  const slide = slides[current] || defaultSlides[0];
  const isVisible = phase === 'idle' || phase === 'enter';

  return (
    <>
      {/* ========== HERO SECTION ========== */}
      <section className="hero-split">
        {slides.map((s, i) => (
          <div
            key={`bg-${i}`}
            className={`hero-bg-layer ${i === current ? 'active' : ''}`}
            style={{ backgroundImage: `url('${s.bgImage}')` }}
          />
        ))}
        <div className="hero-overlay-static" />
        <div className="hero-deco-circle hero-deco-circle--1" />
        <div className="hero-text-area">
          <div className="hero-text-content">
            <div className={`hero-split-badge hero-anim-up ${isVisible ? 'visible' : ''}`}>
              BEST LODGE NEAR KONASEEMA TIRUPATHI
            </div>
            <h1 className={`hero-split-headline hero-anim-down ${isVisible ? 'visible' : ''}`}>
              <strong>{slide.boldText}</strong>{' '}
              {slide.normalText}
            </h1>
            <div className="hero-reservation-wrapper">
              <ReservationBar inline />
            </div>
          </div>
        </div>
        <div className="hero-fg-container">
          <div key={`fg-${current}`} className={`hero-fg-panel ${isVisible ? 'active' : ''}`}>
            <img src={slide.fgImage} alt="" />
          </div>
        </div>
        <div className="hero-thumbs" key={`strip-${current}`}>
          {slide.thumbs.map((src, i) => (
            <div className={`hero-thumb-card ${isVisible ? 'visible' : ''}`} key={i} style={{ animationDelay: `${i * 0.12}s` }}>
              <img src={src} alt={`Hotel view ${i + 1}`} loading="lazy" />
            </div>
          ))}
        </div>
      </section>

      {/* ========== LUXURY ABOUT RESORT SECTION ========== */}
      <section className="about-resort-section">
        <div className="container">
          <div className="ar-layout">
            
            {/* Left Content Column */}
            <div className="ar-left">
              <div className="ar-intro">
                <span className="ar-label">WELCOME TO SVS GRANDS</span>
                <h2 className="ar-heading">The Best Stay Near Konaseema Tirupathi</h2>
                <p className="ar-desc">
                  {aboutContent}
                </p>
              </div>

              {/* Stats/Proof Block */}
              <div className="ar-proof-block">
                <div className="ar-proof-image">
                  <img src="/assets/rooms/classic/1.png" alt="SVS Grands Interior" />
                  <div className="ar-image-overlay"></div>
                </div>
                <div className="ar-proof-stats">
                  <div className="ar-stat-card">
                    <div className="ar-stat-header">
                      <span className="ar-stat-icon">★</span>
                      <h4>4.6 Google Rating</h4>
                    </div>
                    <p>Trusted by hundreds of guests visiting Konaseema and Vadapalli Temple.</p>
                  </div>
                  <div className="ar-stat-card">
                    <div className="ar-stat-header">
                      <span className="ar-stat-icon">✦</span>
                      <h4>Premium Amenities</h4>
                    </div>
                    <p>AC Rooms, Hot Water, Free WiFi, Parking, Flexible Check-ins & 24/7 Support.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Visual Column (Polished Asymmetrical Composition) */}
            <div className="ar-right">
              <div className="ar-circle-container">
                {/* Circle 1: Long Stay Benefits (Largest Hero) */}
                <div className="ar-circle ar-circle-1 ar-circle-dark ar-circle-v-large">
                  <div className="ar-circle-inner">
                    <h3 className="ar-circle-title">{benefits[0]?.title || 'Long Stay Benefits'}</h3>
                    <p className="ar-circle-main-text">
                      {benefits[0]?.text || 'Book for 7+ Days and enjoy special pricing, complimentary Hi-tea, and a peaceful extended stay experience near Konaseema Tirupathi.'}
                    </p>
                    <div className="ar-circle-cta">{benefits[0]?.cta || 'CALL 8341199779'}</div>
                  </div>
                </div>
                
                {/* Circle 2: Group Booking (Secondary Anchor) */}
                <div className="ar-circle ar-circle-2 ar-circle-dark ar-circle-large">
                  <div className="ar-circle-inner">
                    <h3 className="ar-circle-title">{benefits[1]?.title || 'Group Booking'}</h3>
                    <p className="ar-circle-main-text">{benefits[1]?.text || '10+ Rooms available for religious groups, temple visitors, and corporate stays at special tariff.'}</p>
                    <div className="ar-circle-cta">{benefits[1]?.cta || 'CALL 8341199779'}</div>
                  </div>
                </div>

                {/* Circle 3: Top Image (Medium) */}
                <div className="ar-circle ar-circle-3 ar-circle-medium">
                  <img src="/assets/rooms/superior/1.png" alt="Premium Room Stay" />
                </div>

                {/* Circle 4: Bottom Image (Small) */}
                <div className="ar-circle ar-circle-4 ar-circle-small">
                  <img src="/assets/rooms/deluxe/3.png" alt="Luxury Amenities" />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========== WHY CHOOSE SECTION (Luxury Redesign) ========== */}
      <section className="why-choose-section section-padding">
        <div className="container">
          <div className="wc-header">
            <span className="wc-subtitle">Discover Our Features</span>
            <h2 className="wc-title">Why Choose SVS Grands?</h2>
            <div className="wc-divider">
              <span></span>
              <i className="fa fa-diamond">✦</i>
              <span></span>
            </div>
          </div>

          <div className="wc-editorial-wrap">
            {featuresList.map((f, i) => (
              <div className="wc-editorial-item" key={i}>
                <div className="wc-editorial-icon">{f.icon}</div>
                <div className="wc-editorial-content">
                  <h3>{f.title}</h3>
                  <p>{f.desc}</p>
                </div>
                {i < featuresList.length - 1 && <div className="wc-editorial-divider"></div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== ROOMS PREVIEW CAROUSEL ========== */}
      <section className="home-rooms-preview section-padding">
        <div className="container-fluid">
          <div className="container">
            <h2 className="section-title">Our Rooms</h2>
            <p className="section-subtitle">
              Choose from our curated collection of rooms — all designed for comfort and luxury. Flexible 12-hour and 24-hour stays available.
            </p>
          </div>

          <div className="home-rooms-carousel-wrapper">
            <Swiper
              modules={[Autoplay]}
              spaceBetween={30}
              slidesPerView={1}
              slidesPerGroup={1}
              loop={true}
              speed={1000}
              autoplay={{
                delay: 4000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              breakpoints={{
                640: { 
                  slidesPerView: 2,
                  slidesPerGroup: 2 
                },
                1024: { 
                  slidesPerView: 3,
                  slidesPerGroup: 1 
                },
              }}
              className="home-rooms-swiper"
            >
              {rooms.map((room) => (
                <SwiperSlide key={room.id}>
                  <div className="home-room-card" onClick={() => openBooking(room.id)}>
                    <div className="home-room-image" style={{ backgroundImage: `url('${getImageUrl(room.image)}')` }} />
                    <div className="home-room-info">
                      <h3>{room.name}</h3>
                      <p className="home-room-price">From ₹{room.price} <small>{room.unit}</small></p>
                      <p className="home-room-desc">{room.desc}</p>
                     <a
  href="https://asiatech.in/booking_engine/index3?token=MTA4NTA="
  target="_blank"
  rel="noopener noreferrer"
  className="home-room-link"
  onClick={(e) => e.stopPropagation()}
>
  Book Now →
</a>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </section>
    </>
  );
}
