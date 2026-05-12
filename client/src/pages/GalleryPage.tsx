import { useState, useEffect, useRef } from 'react';
import { client, GALLERY_QUERY } from '../lib/sanity';

type MediaType = 'image' | 'video';
type Category = 'all' | 'classic' | 'standard' | 'deluxe' | 'superior' | 'family-comfort' | 'exterior';

interface GalleryItem {
  src: string;
  alt: string;
  category: Category;
  type: MediaType;
  poster?: string;
}

const defaultGalleryItems: GalleryItem[] = [
  // Classic Room
  { src: '/assets/rooms/classic/1.png', alt: 'Classic Room — View 1', category: 'classic', type: 'image' },
  { src: '/assets/rooms/classic/2.png', alt: 'Classic Room — Washroom', category: 'classic', type: 'image' },
  { src: '/assets/rooms/classic/3.png', alt: 'Classic Room — View 3', category: 'classic', type: 'image' },
  { src: '/assets/rooms/classic/4.png', alt: 'Classic Room — View 4', category: 'classic', type: 'image' },
  { src: '/assets/rooms/classic/5.png', alt: 'Classic Room — View 5', category: 'classic', type: 'image' },
  // Classic Rooms — Videos
  { src: '/assets/gallery/classic/first-floor-ac.mp4', alt: 'Classic Room Tour', category: 'classic', type: 'video', poster: '/assets/rooms/classic/1.png' },
  { src: '/assets/gallery/classic/ground-floor-ac-room.mp4', alt: 'Classic Room Tour 2', category: 'classic', type: 'video', poster: '/assets/rooms/classic/2.png' },
  { src: '/assets/gallery/classic/ac-room-tour-1.mp4', alt: 'Classic Room Walkthrough 1', category: 'classic', type: 'video', poster: '/assets/rooms/classic/3.png' },
  { src: '/assets/gallery/classic/ac-room-tour-2.mp4', alt: 'Classic Room Walkthrough 2', category: 'classic', type: 'video', poster: '/assets/rooms/classic/4.png' },
  
  // Standard Room
  { src: '/assets/rooms/standard/1.png', alt: 'Standard Room — Washroom', category: 'standard', type: 'image' },
  { src: '/assets/rooms/standard/2.png', alt: 'Standard Room — View 2', category: 'standard', type: 'image' },
  { src: '/assets/rooms/standard/3.png', alt: 'Standard Room — View 3', category: 'standard', type: 'image' },
  // Standard Room — Video
  { src: '/assets/gallery/standard/non-ac-room-tour.mp4', alt: 'Standard Room Tour', category: 'standard', type: 'video', poster: '/assets/rooms/standard/1.png' },

  // Deluxe Room
  { src: '/assets/rooms/deluxe/1.png', alt: 'Deluxe Room — Washroom', category: 'deluxe', type: 'image' },
  { src: '/assets/rooms/deluxe/2.png', alt: 'Deluxe Room — View 2', category: 'deluxe', type: 'image' },
  { src: '/assets/rooms/deluxe/3.png', alt: 'Deluxe Room — View 3', category: 'deluxe', type: 'image' },
  { src: '/assets/rooms/deluxe/4.png', alt: 'Deluxe Room — View 4', category: 'deluxe', type: 'image' },
  
  // Superior Room
  { src: '/assets/rooms/superior/1.png', alt: 'Superior Room — View 1', category: 'superior', type: 'image' },
  { src: '/assets/rooms/superior/2.png', alt: 'Superior Room — View 2', category: 'superior', type: 'image' },
  { src: '/assets/rooms/superior/3.png', alt: 'Superior Room — View 3', category: 'superior', type: 'image' },
  { src: '/assets/rooms/superior/4.png', alt: 'Superior Room — View 4', category: 'superior', type: 'image' },
  { src: '/assets/rooms/superior/5.png', alt: 'Superior Room — View 5', category: 'superior', type: 'image' },
  { src: '/assets/rooms/superior/6.png', alt: 'Superior Room — Washroom', category: 'superior', type: 'image' },

  // Family Comfort Room
  { src: '/assets/rooms/family-comfort/1.png', alt: 'Family Comfort Room — Washroom', category: 'family-comfort', type: 'image' },
  { src: '/assets/rooms/family-comfort/2.png', alt: 'Family Comfort Room — View 2', category: 'family-comfort', type: 'image' },
  { src: '/assets/rooms/family-comfort/3.png', alt: 'Family Comfort Room — View 3', category: 'family-comfort', type: 'image' },

  // Exterior / Property
  { src: '/assets/gallery/exterior/ground-floor-corridor.jpeg', alt: 'Ground Floor Corridor', category: 'exterior', type: 'image' },
  { src: '/assets/gallery/exterior/ground-floor-corridor.mp4', alt: 'Corridor Walkthrough', category: 'exterior', type: 'video', poster: '/assets/gallery/exterior/ground-floor-corridor.jpeg' },
  { src: '/assets/gallery/exterior/first-floor-hall.mp4', alt: 'First Floor Hall Tour', category: 'exterior', type: 'video', poster: '/assets/gallery/exterior/ground-floor-corridor.jpeg' },
];

const categories: { key: Category; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'classic', label: 'Classic' },
  { key: 'standard', label: 'Standard' },
  { key: 'deluxe', label: 'Deluxe' },
  { key: 'superior', label: 'Superior' },
  { key: 'family-comfort', label: 'Family Comfort' },
  { key: 'exterior', label: 'Property' },
];

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState<Category>('all');
  const [items, setItems] = useState<GalleryItem[]>(defaultGalleryItems);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const lightboxVideoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const data = await client.fetch(GALLERY_QUERY);
        if (data && data.length > 0) {
          const allItems: GalleryItem[] = [];
          data.forEach((cat: any) => {
            if (cat.images) {
              cat.images.forEach((img: any) => allItems.push({ ...img, category: cat.category }));
            }
            if (cat.videos) {
              cat.videos.forEach((vid: any) => allItems.push({ ...vid, category: cat.category }));
            }
          });
          if (allItems.length > 0) setItems(allItems);
        }
      } catch (error) {
        console.error('Sanity fetch error:', error);
      }
    };
    fetchGallery();
  }, []);

  const filtered = activeCategory === 'all'
    ? items
    : items.filter(item => item.category === activeCategory);

  const openLightbox = (idx: number) => setLightboxIdx(idx);
  const closeLightbox = () => {
    if (lightboxVideoRef.current) lightboxVideoRef.current.pause();
    setLightboxIdx(null);
  };
  const prevItem = () => setLightboxIdx(prev => prev !== null ? (prev - 1 + filtered.length) % filtered.length : 0);
  const nextItem = () => setLightboxIdx(prev => prev !== null ? (prev + 1) % filtered.length : 0);

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (lightboxIdx === null) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') prevItem();
      if (e.key === 'ArrowRight') nextItem();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lightboxIdx, filtered.length]);


  return (
    <div className="gallery-page">
      {/* Page Header - Luxury Editorial Style */}
      <div className="page-header gallery-hero">
        <div className="container">
          <div className="gallery-hero-badge">SVS GRANDS EXPERIENCE</div>
          <h1 className="page-header-title">Gallery</h1>
          <div className="page-header-ornament">
            <span className="line"></span>
            <span className="dot">✦</span>
            <span className="line"></span>
          </div>
          <p className="page-header-subtitle">
            Explore our rooms, facilities, and guest experience at SVS Grands.
          </p>
        </div>
      </div>

      {/* Category Filter Bar - Modern Pill Tabs */}
      <div className="gallery-filter-wrapper">
        <div className="gallery-filter-bar">
          <div className="container">
            <div className="gallery-filters-container">
              <div className="gallery-filters">
                {categories.map(cat => {
                  const count = cat.key === 'all' 
                    ? items.length 
                    : items.filter(i => i.category === cat.key).length;
                  return (
                    <button
                      key={cat.key}
                      className={`gallery-filter-btn ${activeCategory === cat.key ? 'active' : ''}`}
                      onClick={() => setActiveCategory(cat.key)}
                    >
                      {cat.label} <span className="cat-count">{count}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Gallery Content - Masonry Flow */}
      <div className="gallery-content">
        <div className="container">
          <div className="gallery-masonry">
            {filtered.map((item, i) => {
              // Create an editorial masonry pattern based on index
              let sizeClass = '';
              if (i % 7 === 0) sizeClass = 'gallery-span-large';
              else if (i % 7 === 3 || i % 7 === 5) sizeClass = 'gallery-span-tall';
              
              return (
                <div
                  className={`gallery-item ${sizeClass}`}
                  key={`${item.src}-${i}`}
                  onClick={() => openLightbox(i)}
                >
                  <div className="gallery-card-inner">
                    {item.type === 'video' ? (
                      <div className="gallery-video-thumb">
                        <img
                          src={item.poster || '/assets/gallery/exterior/ground-floor-corridor.jpeg'}
                          alt={item.alt}
                          loading="lazy"
                        />
                        <div className="gallery-play-icon">
                          <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M8 5v14l11-7z"/>
                          </svg>
                        </div>
                        <div className="video-tour-label">VIDEO TOUR</div>
                      </div>
                    ) : (
                      <img src={item.src} alt={item.alt} loading="lazy" />
                    )}
                    
                    <div className="gallery-item-hover-content">
                      <div className="item-meta">
                        <span className="item-category">{item.category}</span>
                        <h4 className="item-title">{item.alt}</h4>
                      </div>
                      <div className="item-action-icon">
                        {item.type === 'video' ? '▶' : '🔍'}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxIdx !== null && (
        <div className="lightbox" onClick={closeLightbox}>
          <button className="lightbox-close" onClick={closeLightbox}>✕</button>
          <button className="lightbox-nav lightbox-prev" onClick={(e) => { e.stopPropagation(); prevItem(); }}>‹</button>

          {filtered[lightboxIdx].type === 'video' ? (
            <video
              ref={lightboxVideoRef}
              key={filtered[lightboxIdx].src}
              src={filtered[lightboxIdx].src}
              controls
              autoPlay
              className="lightbox-video"
              onClick={e => e.stopPropagation()}
            />
          ) : (
            <img src={filtered[lightboxIdx].src} alt={filtered[lightboxIdx].alt} onClick={e => e.stopPropagation()} />
          )}

          <button className="lightbox-nav lightbox-next" onClick={(e) => { e.stopPropagation(); nextItem(); }}>›</button>
          <div className="lightbox-caption">
            {filtered[lightboxIdx].type === 'video' && <span className="lightbox-badge">VIDEO</span>}
            {filtered[lightboxIdx].alt}
          </div>
          <div className="lightbox-counter">{lightboxIdx + 1} / {filtered.length}</div>
        </div>
      )}
    </div>
  );
}
