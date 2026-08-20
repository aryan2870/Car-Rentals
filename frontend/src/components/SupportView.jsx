import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2 } from 'lucide-react';

const SupportView = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, email, subject, message } = formData;

    if (!name || !email || !subject || !message) {
      setError('Please fill in all fields.');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setError('');
    setLoading(true);

    // Simulate sending message API request
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 1500);
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '1000px', margin: '0 auto', padding: '10px 0' }}>
      {/* Header section */}
      <div style={{ textAlign: 'center', marginBottom: '45px' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '12px' }}>
          Contact <span style={{ background: 'var(--accent-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Support</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
          Have questions or need assistance? Reach out to our customer care team anytime.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '40px',
        alignItems: 'start'
      }}>
        {/* Contact Info Side Card */}
        <div className="glass-panel" style={{
          padding: '30px',
          borderRadius: '16px',
          border: '1px solid var(--card-border)',
          display: 'flex',
          flexDirection: 'column',
          gap: '28px'
        }}>
          <div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '8px' }}>Get In Touch</h3>
            <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              For queries regarding security deposits, driver requirements, or custom fleets.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Phone */}
            <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
              <div style={{
                background: 'rgba(0, 229, 255, 0.1)',
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Phone size={18} color="var(--accent-cyan)" />
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Call Us</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 600 }}>+91 98765 43210</div>
              </div>
            </div>

            {/* Email */}
            <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
              <div style={{
                background: 'rgba(124, 77, 255, 0.1)',
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Mail size={18} color="var(--accent-purple)" />
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Email Support</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 600 }}>support@velocerentals.com</div>
              </div>
            </div>

            {/* Office */}
            <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
              <div style={{
                background: 'rgba(255, 64, 129, 0.1)',
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <MapPin size={18} color="var(--accent-pink)" />
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Main Hub</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 600 }}>Hinjewadi Phase 1, Pune, MH</div>
              </div>
            </div>

            {/* Hours */}
            <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
              <div style={{
                background: 'rgba(0, 229, 255, 0.1)',
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Clock size={18} color="var(--accent-cyan)" />
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Operations Hours</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 600 }}>24/7 Availability</div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form Card */}
        <div className="glass-panel" style={{
          padding: '30px',
          borderRadius: '16px',
          border: '1px solid var(--card-border)',
          position: 'relative'
        }}>
          {success ? (
            <div className="animate-fade-in" style={{
              textAlign: 'center',
              padding: '40px 10px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '16px'
            }}>
              <div style={{
                background: 'rgba(0, 229, 255, 0.1)',
                padding: '16px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'var(--shadow-neon-cyan)'
              }}>
                <CheckCircle2 size={36} color="var(--accent-cyan)" />
              </div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 700 }}>Message Sent Successfully!</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.5, maxWidth: '350px' }}>
                Thank you for reaching out. A Veloce customer executive will review your ticket and reply to your email within <strong>2 hours</strong>.
              </p>
              <button
                className="btn-secondary"
                onClick={() => setSuccess(false)}
                style={{ marginTop: '16px', padding: '10px 24px', borderRadius: '10px' }}
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 700 }}>Send Us a Message</h3>

              {error && (
                <div style={{
                  background: 'rgba(255, 64, 129, 0.1)',
                  border: '1px solid rgba(255, 64, 129, 0.2)',
                  padding: '12px',
                  color: '#ff4081',
                  borderRadius: '8px',
                  fontSize: '0.88rem'
                }}>
                  {error}
                </div>
              )}

              {/* Name field */}
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  placeholder="e.g. Rohan Sharma"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              {/* Email field */}
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  placeholder="e.g. rohan@domain.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              {/* Subject field */}
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Subject</label>
                <input
                  type="text"
                  name="subject"
                  className="form-control"
                  placeholder="How can we help you?"
                  value={formData.subject}
                  onChange={handleChange}
                />
              </div>

              {/* Message field */}
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Message Details</label>
                <textarea
                  name="message"
                  className="form-control"
                  rows={4}
                  placeholder="Describe your issue or custom rental query in details..."
                  value={formData.message}
                  onChange={handleChange}
                  style={{ resize: 'vertical', minHeight: '100px' }}
                />
              </div>

              <button
                type="submit"
                className="btn-primary"
                disabled={loading}
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  padding: '14px',
                  borderRadius: '12px',
                  marginTop: '10px'
                }}
              >
                {loading ? 'Sending Request...' : 'Send Message'}
                {!loading && <Send size={16} />}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default SupportView;
