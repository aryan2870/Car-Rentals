import React from 'react';
import { CalendarRange, CarFront, UserCheck, Sparkles, ArrowRight } from 'lucide-react';

const HowItWorks = ({ onStartBooking }) => {
  const steps = [
    {
      icon: <CalendarRange size={32} color="var(--accent-cyan)" />,
      step: "01",
      title: "Configure Trip",
      desc: "Specify pickup & return locations, select dates, and choose your preferred travel times."
    },
    {
      icon: <CarFront size={32} color="var(--accent-purple)" />,
      step: "02",
      title: "Select Vehicle",
      desc: "Browse our premium fleet of SUVs, luxury sedans, sports coupes, and agile city motorcycles."
    },
    {
      icon: <UserCheck size={32} color="var(--accent-pink)" />,
      step: "03",
      title: "Provide Info",
      desc: "Fill in passenger information and contact details. Account users bypass this instantly."
    },
    {
      icon: <Sparkles size={32} color="var(--accent-cyan)" />,
      step: "04",
      title: "Instant Booking",
      desc: "Confirm and receive an instant email receipt. Your high-performance ride is fully locked in!"
    }
  ];

  return (
    <div className="animate-fade-in" style={{ maxWidth: '1000px', margin: '0 auto', padding: '10px 0' }}>
      {/* Header section */}
      <div style={{ textAlign: 'center', marginBottom: '50px' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '12px' }}>
          How <span style={{ background: 'var(--accent-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Veloce Rentals</span> Works
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
          Rent premium vehicles in 4 simple steps. Seamless configuration, instant lock-in, and zero hidden fees.
        </p>
      </div>

      {/* Grid of Steps */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '24px',
        marginBottom: '60px'
      }}>
        {steps.map((item, idx) => (
          <div
            key={idx}
            className="glass-panel"
            style={{
              padding: '30px 24px',
              borderRadius: '16px',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              transition: 'var(--transition)',
              border: '1px solid var(--card-border)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.borderColor = 'var(--accent-cyan)';
              e.currentTarget.style.boxShadow = 'var(--shadow-neon-cyan)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.borderColor = 'var(--card-border)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            {/* Step badge */}
            <span style={{
              position: 'absolute',
              top: '20px',
              right: '24px',
              fontSize: '1.8rem',
              fontWeight: 800,
              opacity: 0.15,
              color: 'var(--text-secondary)'
            }}>
              {item.step}
            </span>

            {/* Icon container */}
            <div style={{
              background: 'rgba(255,255,255,0.02)',
              width: '60px',
              height: '60px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid var(--card-border)'
            }}>
              {item.icon}
            </div>

            {/* Content info */}
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '8px' }}>{item.title}</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                {item.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* CTA Box */}
      <div className="glass-panel" style={{
        padding: '40px',
        borderRadius: '20px',
        textAlign: 'center',
        background: 'linear-gradient(135deg, rgba(124, 77, 255, 0.05), rgba(0, 229, 255, 0.05))',
        border: '1px solid var(--card-border)',
        boxShadow: 'var(--shadow-neon)'
      }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '10px' }}>Ready to Get Behind the Wheel?</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '1rem', maxWidth: '500px', margin: '0 auto 24px' }}>
          Schedule your dates and search through Pune's premium vehicle catalog immediately.
        </p>
        <button
          onClick={onStartBooking}
          className="btn-primary"
          style={{
            padding: '14px 32px',
            fontSize: '1rem',
            borderRadius: '12px'
          }}
        >
          Book Your Ride Now
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default HowItWorks;
