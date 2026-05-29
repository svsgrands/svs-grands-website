import { Outlet, useNavigate, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { client, SETTINGS_QUERY } from '../lib/sanity';
import Navbar from './Navbar';
import FloatingContact from './FloatingContact';
import './Footer.css';

export default function Layout() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await client.fetch(SETTINGS_QUERY);
        if (data) setSettings(data);
      } catch (error) {
        console.error('Sanity settings fetch error:', error);
      }
    };
    fetchSettings();
  }, []);

  const openBooking = (roomType?: string) => {
    const params = new URLSearchParams();
    if (roomType) {
      if (roomType === 'AC') params.set('roomType', 'SINGLE_AC_TV');
      else if (roomType === 'Non-AC') params.set('roomType', 'SINGLE_NONAC');
      else params.set('roomType', roomType);
    }
    navigate(`/checkout?${params.toString()}`);
  };

  return (
    <>
      <Navbar settings={settings} />
      <main className="page-content">
        <Outlet context={{ openBooking }} />
      </main>

      <footer className="luxury-footer">
        <div className="container">
          <div className="footer-grid">
            {/* Branding & Description */}
            <div className="footer-brand">
              <Link to="/" className="footer-logo-wrap">
                <img src={settings?.logo || "/assets/logo.webp"} alt={settings?.hotelName || "SVS Grands"} className="footer-logo" />
                <span className="footer-logo-text">SVS Grands</span>
              </Link>
              <p className="footer-desc">
                {settings?.footerDescription || "SVS Grands offers peaceful and comfortable stays near Sri Venkateswara Swamy Temple, Vadapalli — designed for pilgrims, families, and travelers seeking comfort and convenience."}
              </p>
            </div>

            {/* Quick Navigation */}
            <div className="footer-nav">
              <h4>Navigation</h4>
              <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/rooms">Our Rooms</Link></li>
                <li><Link to="/discover-vadapalli">Discover Vadapalli</Link></li>
                <li><Link to="/gallery">Gallery</Link></li>
                <li><Link to="/contact">Contact Us</Link></li>
              </ul>
            </div>

            {/* Contact Details */}
            <div className="footer-contact">
              <h4>Contact</h4>
              <p>{settings?.address || "Opp. Grama Panchayathi Office,\nLolla, Vadapalli, AP - 533237"}</p>
              <a href={`tel:${settings?.phoneNumber || "+918341199779"}`} className="footer-link">{settings?.phoneNumber || "+91 83411 99779"}</a>
              <a href={`mailto:${settings?.email || "svsgrands@gmail.com"}`} className="footer-link">{settings?.email || "svsgrands@gmail.com"}</a>
            </div>

            {/* Social Media */}
            <div className="footer-social">
              <h4>Follow Us</h4>
              <div className="social-icons">
                <a href={settings?.instagramLink || "https://www.instagram.com/svs_grands_vadapalli"} target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-instagram"></i>
                </a>
                <a href={settings?.facebookLink || "https://www.facebook.com/svsgrands"} target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href={settings?.googleMapsLink || "https://maps.app.goo.gl/bitA8qQ6YdLP5PCc9?g_st=ac"} target="_blank" rel="noopener noreferrer">
                  <i className="fas fa-map-marker-alt"></i>
                </a>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <div className="footer-copyright">
              © {new Date().getFullYear()} {settings?.copyrightText || "SVS Grands Boutique Hotel. All rights reserved."}
            </div>
            <div className="footer-legal">
              <Link to="/terms">Terms & Conditions</Link>
              <Link to="/privacy">Privacy Policy</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Modern Interactive Support Widget */}
      <FloatingContact settings={settings} />
    </>
  );
}
