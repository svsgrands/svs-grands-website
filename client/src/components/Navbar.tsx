import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar({ settings }: { settings: any }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);

  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      setScrolled(currentScrollY > 50);

      if (currentScrollY <= 50) {
        setHidden(false);
      } else if (currentScrollY > lastScrollY.current + 10) {
        setHidden(true); // scrolling down
      } else if (currentScrollY < lastScrollY.current - 10) {
        setHidden(false); // scrolling up
      }
      
      lastScrollY.current = currentScrollY;
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/rooms', label: 'Rooms' },
    { to: '/discover-vadapalli', label: 'Discover Vadapalli' },
    { to: '/gallery', label: 'Gallery' },
    { to: '/contact', label: 'Contact Us' },
  ];

  useEffect(() => {
    if (menuOpen) {
      document.body.classList.add('menu-open');
    } else {
      document.body.classList.remove('menu-open');
    }
    return () => document.body.classList.remove('menu-open');
  }, [menuOpen]);

  return (
    <>
      {/* Top Info Bar */}
      <div className={`top-info-bar ${hidden ? 'hidden' : ''}`}>
        <div className="container top-info-bar-inner">
          <div className="top-info-left">
            <span className="top-info-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              {settings?.address?.split(',').slice(0, 2).join(',') || "Near Sri Venkateswara Swamy Temple, Vadapalli"}
            </span>
            <span className="top-info-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              {settings?.email || "svsgrands@gmail.com"}
            </span>
            <span className="top-info-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              {settings?.phoneNumber || "+91-8341199779"}
            </span>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Overlay & Drawer */}
      <div 
        className={`navbar-overlay ${menuOpen ? 'open' : ''}`} 
        onClick={() => setMenuOpen(false)}
      ></div>

      <div className={`navbar-drawer ${menuOpen ? 'open' : ''}`}>
        <div className="drawer-header">
          <button className="drawer-close" onClick={() => setMenuOpen(false)}>
            <i className="fas fa-times"></i>
          </button>
          <div className="drawer-logo">
            <img src={settings?.logo || "/assets/logo.png"} alt={settings?.hotelName || "SVS Grands"} />
            <span className="logo-text">SVS Grands</span>
          </div>
        </div>

        <div className="drawer-nav">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={location.pathname === link.to ? 'active' : ''}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="drawer-footer">
          <div className="drawer-contact">
            <a href={`mailto:${settings?.email || "svsgrands@gmail.com"}`} className="contact-item">
              <span className="icon-circle"><i className="fas fa-envelope"></i></span>
              {settings?.email || "svsgrands@gmail.com"}
            </a>
            <a href={`tel:${settings?.phoneNumber || "+918341199779"}`} className="contact-item">
              <span className="icon-circle"><i className="fas fa-phone"></i></span>
              {settings?.phoneNumber || "+91-8341199779"}
            </a>
          </div>
          <div className="drawer-socials">
            <a href={settings?.facebookLink || "#"}><i className="fab fa-facebook-f"></i></a>
            <a href="#"><i className="fab fa-x-twitter"></i></a>
            <a href={settings?.instagramLink || "#"}><i className="fab fa-instagram"></i></a>
            <a href="#"><i className="fab fa-youtube"></i></a>
          </div>
        </div>
      </div>

      {/* Desktop Main Navbar */}
      <nav className={`navbar ${scrolled ? 'scrolled' : ''} ${hidden ? 'hidden' : ''}`}>
        <div className="container">
          <Link to="/" className="navbar-logo">
            <img src={settings?.logo || "/assets/logo.png"} alt={settings?.hotelName || "SVS Grands"} />
            <span className="navbar-logo-text">SVS Grands</span>
          </Link>

          {/* Desktop Links */}
          <div className="navbar-links">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={location.pathname === link.to ? 'active' : ''}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="navbar-right">
            <a href={`tel:${settings?.phoneNumber || "+918341199779"}`} className="navbar-phone">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              <div className="navbar-phone-text">
                <small>Call Anytime</small>
                <span>{settings?.phoneNumber || "+91-8341199779"}</span>
              </div>
            </a>
            <button
  className="navbar-book-btn"
  onClick={() =>
    window.open(
      "https://asiatech.in/booking_engine/index3?token=MTA4NTA=",
      "_blank"
    )
  }
>
  Book Now
</button>
          </div>

          <button className={`hamburger ${menuOpen ? 'open' : ''}`} onClick={() => setMenuOpen(!menuOpen)}>
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </nav>
    </>
  );
}
