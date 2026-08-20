import React, { useState } from 'react';
import { Car, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Send, ShieldCheck } from 'lucide-react';

const Footer = ({ setActiveTab }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email || !/\S+@\S+\.\S+/.test(email)) return;
    setSubscribed(true);
    setTimeout(() => {
      setEmail('');
    }, 2000);
  };

  return (
    <footer className="glass-panel animate-fade-in" style={{
      marginTop: '80px',
      borderLeft: 'none',
      borderRight: 'none',
      borderBottom: 'none',
      borderRadius: '24px 24px 0 0',
      background: 'rgba(15, 18, 37, 0.85)',
      backdropFilter: 'var(--glass-blur)',
      padding: '60px 40px 30px',
      borderTop: '1px solid var(--card-border)'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '40px',
        marginBottom: '50px'
      }}>
        {/* Brand Info Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div 
            onClick={() => setActiveTab('booking')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              cursor: 'pointer',
              background: 'linear-gradient(135deg, #fff, var(--accent-cyan))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 800,
              fontSize: '1.4rem',
              letterSpacing: '1px',
              width: 'fit-content'
            }}
          >
            <Car size={26} color="#00e5ff" style={{ filter: 'drop-shadow(0 0 5px rgba(0,229,255,0.5))' }} />
            <span style={{ fontWeight: 800 }}>VELOCE RENTALS</span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.6 }}>
            Drive premium, arrive safely. Experience Pune and Hinjewadi with our premium high-performance cars and city motorcycles at unbeatable rates.
          </p>
          {/* Social Icons */}
          <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
            {[
              { icon: <Facebook size={16} />, color: '#1877F2' },
              { icon: <Twitter size={16} />, color: '#1DA1F2' },
              { icon: <Instagram size={16} />, color: '#E1306C' },
              { icon: <Linkedin size={16} />, color: '#0077B5' }
            ].map((social, idx) => (
              <a
                key={idx}
                href="#"
                onClick={(e) => e.preventDefault()}
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid var(--card-border)',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'var(--transition)',
                  color: 'var(--text-secondary)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--accent-cyan)';
                  e.currentTarget.style.color = '#fff';
                  e.currentTarget.style.boxShadow = '0 0 10px rgba(0, 229, 255, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--card-border)';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h4 style={{ fontSize: '1rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: '#fff' }}>Quick Links</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { id: 'booking', label: 'Book a Ride' },
              { id: 'fleet', label: 'Our Fleet catalog' },
              { id: 'how-it-works', label: 'How it works flow' },
              { id: 'support', label: 'Contact & support' }
            ].map((link) => (
              <button
                key={link.id}
                onClick={() => setActiveTab(link.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'var(--transition)',
                  padding: 0,
                  width: 'fit-content'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--accent-cyan)';
                  e.currentTarget.style.transform = 'translateX(4px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--text-secondary)';
                  e.currentTarget.style.transform = 'translateX(0)';
                }}
              >
                {link.label}
              </button>
            ))}
          </div>
        </div>

        {/* Contact Info Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h4 style={{ fontSize: '1rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: '#fff' }}>Contact Info</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <MapPin size={16} color="var(--accent-cyan)" />
              <span>Hinjewadi Phase 1, Pune, MH, India</span>
            </div>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <Mail size={16} color="var(--accent-purple)" />
              <span>support@velocerentals.com</span>
            </div>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <Phone size={16} color="var(--accent-pink)" />
              <span>+91 98765 43210</span>
            </div>
          </div>
        </div>

        {/* Newsletter Subscription Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h4 style={{ fontSize: '1rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: '#fff' }}>Newsletter</h4>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5 }}>
            Subscribe to get notifications about exclusive discounts and new vehicles arrival.
          </p>
          {subscribed ? (
            <div className="animate-fade-in" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: 'var(--accent-cyan)',
              fontSize: '0.9rem',
              fontWeight: 600,
              background: 'rgba(0, 229, 255, 0.05)',
              padding: '10px 14px',
              borderRadius: '8px',
              border: '1px solid rgba(0, 229, 255, 0.1)'
            }}>
              <ShieldCheck size={16} />
              <span>Subscribed Successfully!</span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} style={{ display: 'flex', gap: '8px', position: 'relative' }}>
              <input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="form-control"
                style={{
                  flexGrow: 1,
                  padding: '10px 14px',
                  borderRadius: '10px',
                  fontSize: '0.85rem',
                  height: '42px',
                  paddingRight: '45px'
                }}
              />
              <button
                type="submit"
                style={{
                  position: 'absolute',
                  right: '6px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'var(--accent-gradient)',
                  border: 'none',
                  borderRadius: '8px',
                  width: '30px',
                  height: '30px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#fff',
                  transition: 'var(--transition)'
                }}
                onMouseEnter={(e) => e.currentTarget.style.filter = 'brightness(1.1)'}
                onMouseLeave={(e) => e.currentTarget.style.filter = 'none'}
              >
                <Send size={14} />
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Footer Bottom bar */}
      <div style={{
        borderTop: '1px solid var(--card-border)',
        paddingTop: '25px',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '15px',
        maxWidth: '1200px',
        margin: '0 auto',
        fontSize: '0.85rem',
        color: 'var(--text-muted)'
      }}>
        <span>© 2026 Veloce Car Rentals Pvt Ltd. All rights reserved.</span>
        <div style={{ display: 'flex', gap: '20px' }}>
          <a href="#" onClick={(e) => e.preventDefault()} style={{ transition: 'var(--transition)' }} onMouseEnter={(e) => e.currentTarget.style.color = '#fff'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}>Privacy Policy</a>
          <a href="#" onClick={(e) => e.preventDefault()} style={{ transition: 'var(--transition)' }} onMouseEnter={(e) => e.currentTarget.style.color = '#fff'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}>Terms of Service</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
