import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { client, PLACES_QUERY, urlFor } from '../lib/sanity';
import './DiscoverPage.css';

const defaultDiscoverData = [
  {
    id: 'vadapalli',
    title: 'వడపల్లి — Sri Venkateswara Swamy Temple',
    image: '/assets/discover/vadapalli.jpg',
    description: 'వడపల్లి is a famous spiritual destination known for the Sri Venkateswara Swamy Temple surrounded by peaceful Konaseema scenery.',
    distance: 'Approx. 1 km',
    timingLabel: 'Temple Timings',
    timings: '5:30 AM – 12:00 PM\n4:30 PM – 8:00 PM'
  },
  {
    id: 'ryali',
    title: 'ర్యాలి — Jaganmohini Kesava Swamy Temple',
    image: '/assets/discover/Rayali.jpg',
    description: 'ర్యాలి is one of the most famous spiritual destinations near Vadapalli, known for the unique Jaganmohini Kesava Swamy Temple.',
    distance: 'Approx. 12 km',
    timingLabel: 'Temple Timings',
    timings: '6:00 AM – 12:00 PM\n4:00 PM – 8:00 PM'
  },
  {
    id: 'atreyapuram',
    title: 'ఆత్రేయపురం — Home of Pootharekulu',
    image: '/assets/discover/atreyapuram.jpg',
    description: 'ఆత్రేయపురం is world-famous for traditional Andhra Pootharekulu sweets and beautiful Konaseema surroundings.',
    distance: 'Approx. 18 km',
    timingLabel: 'Best Visiting Time',
    timings: '8:00 AM – 9:00 PM'
  },
  {
    id: 'ravulapalem',
    title: 'రావులపాలెం — Gateway of Konaseema',
    image: '/assets/discover/ravulapalem.jpg',
    description: 'రావులపాలెం is popularly called the Gateway of Konaseema because of its greenery, coconut plantations, and lively town atmosphere.',
    distance: 'Approx. 15 km',
    timingLabel: 'Best Visiting Time',
    timings: 'Morning and evening hours'
  },
  {
    id: 'mandapalli',
    title: 'మందపల్లి — Sri Mandeswara Swamy Temple',
    image: '/assets/discover/mandapalli.png',
    description: 'మందపల్లి is a highly visited pilgrimage destination known for the famous Sri Mandeswara Swamy Temple dedicated to Lord Shani.',
    distance: 'Approx. 20 km',
    timingLabel: 'Temple Timings',
    timings: '5:00 AM – 1:00 PM\n4:00 PM – 8:30 PM'
  },
  {
    id: 'vanapalli',
    title: 'వానపల్లి — Konaseema Village Beauty',
    image: '/assets/discover/vanapalli.jpg',
    description: 'వానపల్లి is known for peaceful village beauty, coconut gardens, and authentic Konaseema atmosphere.',
    distance: 'Approx. 10 km',
    timingLabel: 'Best Visiting Time',
    timings: 'Early morning and sunset hours'
  },
  {
    id: 'annavaram',
    title: 'అన్నవరం — Sri Satyanarayana Swamy Temple',
    image: '/assets/discover/annavaram.png',
    description: 'అన్నవరం is one of the most famous pilgrimage centers in Andhra Pradesh located on Ratnagiri Hill.',
    distance: 'Approx. 75 km',
    timingLabel: 'Temple Timings',
    timings: '4:00 AM – 9:00 PM'
  },
  {
    id: 'draksharamam',
    title: 'ద్రాక్షారామం — Bhimeswara Swamy Temple',
    image: '/assets/discover/draksharamam.png',
    description: 'ద్రాక్షారామం is one of the sacred Pancharama Kshetrams dedicated to Lord Shiva.',
    distance: 'Approx. 35 km',
    timingLabel: 'Temple Timings',
    timings: '6:00 AM – 12:00 PM\n4:00 PM – 8:00 PM'
  },
  {
    id: 'kotipalli',
    title: 'కోటిపల్లి — Someswara Swamy Temple',
    image: '/assets/discover/kotipalli.png',
    description: 'కోటిపల్లి is a calm riverside spiritual destination known for the Someswara Swamy Temple and scenic Godavari surroundings.',
    distance: 'Approx. 30 km',
    timingLabel: 'Temple Timings',
    timings: '6:00 AM – 12:00 PM\n5:00 PM – 8:00 PM'
  },
  {
    id: 'appanapalli',
    title: 'అప్పనపల్లి — Bala Balaji Temple',
    image: '/assets/discover/appanapalli.png',
    description: 'అప్పనపల్లి is a popular devotional destination known for the Sri Bala Balaji Temple located amidst Konaseema greenery.',
    distance: 'Approx. 45 km',
    timingLabel: 'Temple Timings',
    timings: '5:00 AM – 12:30 PM\n4:30 PM – 8:30 PM'
  },
  {
    id: 'antarvedi',
    title: 'అంతర్వేది — Lakshmi Narasimha Swamy Temple',
    image: '/assets/discover/antarvedi.png',
    description: 'అంతర్వేది is a beautiful spiritual and coastal destination where the Godavari river meets the Bay of Bengal.',
    distance: 'Approx. 70 km',
    timingLabel: 'Temple Timings',
    timings: '5:30 AM – 12:30 PM\n4:00 PM – 8:00 PM'
  },
  {
    id: 'konaseema',
    title: 'కోనసీమ Coconut Roads & Backwaters',
    image: '/assets/discover/konaseema.png',
    description: 'Konaseema is famous for its scenic coconut tree roads, canals, lush greenery, and peaceful village landscapes.',
    distance: 'Accessible throughout surrounding region',
    timingLabel: 'Best Visiting Time',
    timings: 'Early morning, evening, and monsoon season'
  }
];

const getImageUrl = (source: any) => {
  if (!source) return '/assets/BackgroundPC.jpg';
  if (typeof source === 'string') return source;
  try {
    return urlFor(source).url();
  } catch (err) {
    return '/assets/BackgroundPC.jpg';
  }
};

export default function DiscoverPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // States
  const [places, setPlaces] = useState(defaultDiscoverData);
  const [animPhase, setAnimPhase] = useState<'idle' | 'reset' | 'animating'>('idle');
  const [prevImage, setPrevImage] = useState<string | null>(null);
  const lastImageRef = useRef<string | null>(null);

  // Hash Routing Logic
  const hash = location.hash;
  const hashIndex = hash ? parseInt(hash.replace('#', '')) : NaN;
  const isDetailsView = !isNaN(hashIndex) && hashIndex >= 0 && hashIndex < places.length;
  const activeIndex = isDetailsView ? hashIndex : 0;
  const [displayPlace, setDisplayPlace] = useState(places[activeIndex]);

  // Fetch Sanity Content
  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const data = await client.fetch(PLACES_QUERY);
        if (data && data.length > 0) {
          const mappedPlaces = data.map((p: any) => ({
            id: p.id || p._id,
            title: p.name,
            image: p.featuredImage || p.gallery?.[0] || '/assets/BackgroundPC.jpg',
            description: p.description,
            distance: p.distance,
            timingLabel: 'Timings',
            timings: 'Contact for timings'
          }));
          setPlaces(mappedPlaces);
        }
      } catch (error) {
        console.error('Sanity fetch error:', error);
      }
    };
    fetchPlaces();
  }, []);

  // Trigger animations on place change or initial entry
  useEffect(() => {
    // 1. Reset state synchronously to hide current content
    setAnimPhase('reset');
    window.scrollTo(0, 0);

    // 2. Set up background bridging
    if (lastImageRef.current) {
      setPrevImage(lastImageRef.current);
    } else {
      setPrevImage('/assets/BackgroundPC.jpg');
    }
    
    // 3. Update the content and start animation AFTER the reset is settled
    const timer = setTimeout(() => {
      if (places[activeIndex]) {
        setDisplayPlace(places[activeIndex]);
        setAnimPhase('animating');
        lastImageRef.current = places[activeIndex].image;
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [activeIndex, places]);

  const openPlace = (index: number) => {
    if (index === activeIndex) return;
    navigate(`/discover-vadapalli#${index}`);
  };

  return (
    <div className={`discover-page-container phase-${animPhase}`}>
      
      {/* Background Layer */}
      <>
        {prevImage && (
          <div 
            className="discover-details-bg" 
            style={{ backgroundImage: `url('/assets/BackgroundPC.jpg')`, opacity: 1, transform: 'scale(1)', filter: 'none', zIndex: 0 }} 
          />
        )}

        <div 
          className={`discover-details-bg ${animPhase === 'animating' ? 'bg-reveal' : ''}`} 
          style={{ backgroundImage: `url(${getImageUrl(displayPlace?.image)})`, zIndex: 1 }} 
        />
      </>

      <div className="discover-details-view">
        {/* Left Sidebar */}
        <aside className={`discover-sidebar ${animPhase === 'animating' ? 'sidebar-slide-in' : ''}`}>
          <h3 className="discover-sidebar-title">Nearby Places</h3>

          <div className="discover-thumbs-wrap">
            {places.map((place, idx) => (
              <div
                key={place.id}
                className={`discover-thumb ${idx === activeIndex ? 'discover-thumb--active' : ''} ${animPhase === 'animating' ? 'thumb-fade-in' : ''}`}
                onClick={() => openPlace(idx)}
                style={{ animationDelay: animPhase === 'animating' ? `${0.4 + idx * 0.1}s` : '0s' }}
              >
                <img src={getImageUrl(place.image)} alt={place.title} />
                <div className="discover-thumb-overlay">
                  <span>{place.title.split('—')[0].trim()}</span>
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Content Panel */}
        <div className={`discover-content-panel ${animPhase === 'animating' ? 'panel-slide-in' : ''}`}>
          <h1 className={`discover-title stagger-1 ${displayPlace?.title?.length > 30 ? 'title-long' : ''}`}>
            {displayPlace?.title}
          </h1>

          <div className="discover-divider stagger-2"></div>

          <p className="discover-description stagger-3">{displayPlace?.description}</p>

          <div className="discover-info-grid stagger-4">
            <div className="discover-info-item">
              <h4>{displayPlace?.timingLabel}</h4>
              <p style={{ whiteSpace: 'pre-line' }}>{displayPlace?.timings}</p>
            </div>
            
            <div className="discover-info-item">
              <h4>Distance from SVS Grands</h4>
              <p>{displayPlace?.distance}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
