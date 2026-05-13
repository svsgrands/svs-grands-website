import { useState, useEffect } from 'react';
import { client, SETTINGS_QUERY } from '../lib/sanity';

interface SanitySettings {
  hotelName?: string;
  address?: string;
  phoneNumber?: string;
  email?: string;
  whatsappLink?: string;
  instagramLink?: string;
}

export default function ContactPage() {
  const [fromLocation, setFromLocation] = useState('');
  const [settings, setSettings] = useState<SanitySettings | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await client.fetch<SanitySettings>(SETTINGS_QUERY);
        if (data) setSettings(data);
      } catch (error) {
        console.error('Sanity settings fetch error:', error);
      }
    };
    fetchSettings();
  }, []);
  
  const handleDirections = () => {
    const destination = settings?.address || "SVS Grands, Vadapalli, Andhra Pradesh 533237";
    const url = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(fromLocation)}&destination=${encodeURIComponent(destination)}&travelmode=driving`;
    window.open(url, '_blank');
  };

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Enquiry Submitted:", formData);
    alert("Thank you for your enquiry. Our team will get back to you shortly.");
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
  };

  const handleSaveContact = () => {
    const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${settings?.hotelName || "SVS Grands"}
ORG:${settings?.hotelName || "SVS Grands"}
TEL;TYPE=WORK,VOICE:${settings?.phoneNumber || "+918341199779"}
EMAIL;TYPE=PREF,INTERNET:${settings?.email || "svsgrands@gmail.com"}
ADR;TYPE=WORK:;;${settings?.address || "Opp. Grama Panchayathi Office, Lolla, Vadapalli;Konaseema;AP;533237;India"}
URL:https://svsgrands.com
END:VCARD`;

    const blob = new Blob([vcard], { type: 'text/vcard' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'SVS_Grands_Contact.vcf');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="contact-page">
      {/* SECTION 1: Immersive Dark Map Experience */}
      <section className="contact-hero-immersive">
        <div className="immersive-map-container">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1000!2d81.8094954!3d16.8136096!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a37bf93a8aae9b3%3A0x3d1fdecb0c83b2f!2sSVS+Grands+-+Rooms+in+Vadapalli!5e0!3m2!1sen!2sin!4v1680000000000!5m2!1sen!2sin&iwloc=near&gestureHandling=greedy"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="SVS Grands Location"
            style={{ touchAction: 'pan-x pan-y' }}
          ></iframe>
        </div>

        {/* Floating Direction Card */}
        <div className="direction-card-float">
          <h3>How to get from</h3>
          
          <div className="direction-input-group">
            <div className="direction-row">
              <div className="dir-dot" />
              <div className="direction-input-field">
                <input 
                  type="text" 
                  placeholder="Your Location" 
                  value={fromLocation}
                  onChange={(e) => setFromLocation(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleDirections()}
                />
              </div>
            </div>
            
            <div className="direction-row">
              <i className="fas fa-location-dot dir-flag"></i>
              <div className="direction-input-field prefilled">
                <input type="text" value={`${settings?.hotelName || "SVS Grands"}, Vadapalli`} disabled />
              </div>
            </div>
          </div>

          <button className="btn-get-directions" onClick={handleDirections}>
            DIRECTIONS
          </button>
        </div>
      </section>

      {/* SECTION 2: Premium Contact Layout */}
      <section className="contact-premium-section">
        <div className="container">
          <div className="contact-luxury-grid">
            
            {/* LEFT PANEL: FIXED-STYLE INFO */}
            <aside className="luxury-info-panel">
              <span className="luxury-breadcrumb">Get in Touch</span>
              <h2 className="info-panel-heading">We are here to help.</h2>

              <div className="info-item">
                <label>The Address</label>
                <p>{settings?.address || "Opp. Grama Panchayathi Office, Lolla, Vadapalli, Konaseema, AP - 533237"}</p>
              </div>

              <div className="info-item">
                <label>Direct Contact</label>
                <a href={`tel:${settings?.phoneNumber || "+918341199779"}`}>{settings?.phoneNumber || "+91 83411 99779"}</a>
                <a href={settings?.whatsappLink || "https://wa.me/918341199779"} target="_blank" rel="noopener noreferrer">WhatsApp Chat</a>
              </div>

              <div className="info-item">
                <label>Online Reach</label>
                <a href={`mailto:${settings?.email || "svsgrands@gmail.com"}`}>{settings?.email || "svsgrands@gmail.com"}</a>
                <a href={settings?.instagramLink || "https://www.instagram.com/svs_grands_vadapalli"} target="_blank" rel="noopener noreferrer">Instagram</a>
              </div>

              <button className="btn-save-contact" onClick={handleSaveContact}>
                <i className="fas fa-download"></i> SAVE CONTACT
              </button>
            </aside>

            {/* RIGHT PANEL: LUXURY ENQUIRY FORM */}
            <main className="luxury-form-panel">
              <h1 className="form-heading">ENQUIRE NOW</h1>
              <p className="form-subheading">
                Have questions about room availability, group stays, temple visits, or flexible check-in options? 
                Send us your enquiry and our team will get back to you shortly.
              </p>

              <form className="contact-luxury-form" onSubmit={handleFormSubmit}>
                <div className="form-row">
                  <div className="luxury-form-group">
                    <label>Full Name</label>
                    <input 
                      type="text" 
                      name="name"
                      placeholder="Your Name" 
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="luxury-form-group">
                    <label>Email Address</label>
                    <input 
                      type="email" 
                      name="email"
                      placeholder="email@example.com" 
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="luxury-form-group">
                    <label>Phone Number</label>
                    <input 
                      type="tel" 
                      name="phone"
                      placeholder="+91 00000 00000" 
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="luxury-form-group">
                    <label>Subject</label>
                    <input 
                      type="text" 
                      name="subject"
                      placeholder="Room Inquiry / Group Stay" 
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="luxury-form-group">
                  <label>Message</label>
                  <textarea 
                    name="message"
                    placeholder="Write your message here..." 
                    rows={6}
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                  ></textarea>
                </div>

                <div className="form-footer">
                  <button type="submit" className="btn-form-submit">
                    SEND ENQUIRY
                  </button>
                </div>
              </form>
            </main>

          </div>
        </div>
      </section>
    </div>
  );
}
