import React from 'react';
import { useBooking } from '../context/BookingContext';
import { useAuth } from '../context/AuthContext';
import { Users, Briefcase, Settings, CheckCircle2, ChevronLeft, Bike } from 'lucide-react';

const CarSelector = ({ onNext, onBack, onPromptAuth }) => {
  const { cars, bookingDetails, updateBookingDetails, calculateDuration, calculatePrice } = useBooking();
  const { user } = useAuth();
  const duration = calculateDuration();

  // Filter cars based on vehicleType selection
  const filteredCars = cars.filter(car => car.vehicleType === (bookingDetails.vehicleType || 'car'));

  const handleSelectCar = (car) => {
    updateBookingDetails({ selectedCar: car });
    if (!user) {
      onPromptAuth();
    } else {
      onNext();
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }} className="animate-fade-in">
      {/* Header section */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px'
      }}>
        <div>
          <button 
            onClick={onBack} 
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: 'var(--accent-cyan)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: 500,
              marginBottom: '10px',
              padding: 0
            }}
          >
            <ChevronLeft size={18} />
            Modify Dates & Locations
          </button>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 700 }}>
            {bookingDetails.vehicleType === 'bike' ? 'Choose Your Scooter or Motorcycle' : 'Choose Your Vehicle'}
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
            Showing available {bookingDetails.vehicleType === 'bike' ? 'bikes' : 'cars'} for a <strong>{duration} {duration === 1 ? 'day' : 'days'}</strong> trip
          </p>
        </div>

        {/* Small Booking Details recap widget */}
        <div className="glass-panel" style={{
          padding: '12px 20px',
          fontSize: '0.85rem',
          border: '1px solid rgba(0, 229, 255, 0.2)'
        }}>
          <div><strong>Pickup:</strong> {bookingDetails.pickupLocation}</div>
          <div style={{ marginTop: '4px' }}><strong>Dates:</strong> {bookingDetails.pickupDate} to {bookingDetails.dropDate}</div>
        </div>
      </div>

      {/* Duo / Couple Promo banner for Bike Renting */}
      {bookingDetails.vehicleType === 'bike' && (
        <div className="glass-panel animate-fade-in" style={{
          padding: '20px 24px',
          marginBottom: '32px',
          border: '1px solid rgba(0, 229, 255, 0.3)',
          background: 'linear-gradient(135deg, rgba(124, 77, 255, 0.08), rgba(0, 229, 255, 0.08))',
          borderRadius: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0, 229, 255, 0.1)', padding: '12px', borderRadius: '50%', flexShrink: 0 }}>
            <Bike size={26} color="var(--accent-cyan)" />
          </div>
          <div>
            <h4 style={{ fontWeight: 700, color: 'var(--accent-cyan)' }}>Duo / Couple Bike Rental Specials (2-People Max)</h4>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.5 }}>
              Boongg-inspired duo package: Includes <strong>2 safety helmets</strong>, <strong>zero security deposit</strong>, and breakdown assistance. Save money while navigating heavy city traffic or taking scenic tours!
            </p>
          </div>
        </div>
      )}

      {/* Grid of cars */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '30px'
      }}>
        {filteredCars.map((car) => {
          const totalCost = calculatePrice(car.pricePerDay);
          return (
            <div 
              key={car.id} 
              className="glass-panel-interactive"
              style={{
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                borderRadius: '16px',
                position: 'relative'
              }}
            >
              {/* Car photo */}
              <div style={{ position: 'relative', height: '180px', overflow: 'hidden' }}>
                <img 
                  src={car.image} 
                  alt={car.name} 
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.5s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.08)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                />
                <span style={{
                  position: 'absolute',
                  top: '12px',
                  left: '12px',
                  background: 'var(--accent-purple)',
                  color: '#fff',
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                  padding: '4px 10px',
                  borderRadius: '20px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  {car.type}
                </span>
              </div>

              {/* Details card body */}
              <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '12px' }}>{car.name}</h3>
                
                {/* Tech Specs */}
                <div style={{ 
                  display: 'flex', 
                  gap: '14px', 
                  fontSize: '0.85rem', 
                  color: 'var(--text-secondary)',
                  marginBottom: '16px',
                  borderBottom: '1px solid var(--card-border)',
                  paddingBottom: '12px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Users size={15} color="var(--accent-cyan)" />
                    <span>{car.seats} Seats</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Briefcase size={15} color="var(--accent-cyan)" />
                    <span>{car.luggage} Bags</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Settings size={15} color="var(--accent-cyan)" />
                    <span>{car.transmission}</span>
                  </div>
                </div>

                {/* Features Checklist */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '24px', flexGrow: 1 }}>
                  {car.features.map((feature, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      <CheckCircle2 size={13} color="var(--accent-purple)" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Pricing and Selection */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-end',
                  marginTop: 'auto',
                  borderTop: '1px solid var(--card-border)',
                  paddingTop: '16px'
                }}>
                  <div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Daily Rate</div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      ₹{car.pricePerDay}<span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)' }}>/day</span>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Total Cost ({duration} d)</div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--accent-cyan)', filter: 'drop-shadow(0 0 4px rgba(0,229,255,0.2))' }}>
                      ₹{totalCost}
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => handleSelectCar(car)}
                  className="btn-primary" 
                  style={{
                    width: '100%',
                    justifyContent: 'center',
                    marginTop: '20px',
                    padding: '12px'
                  }}
                >
                  Select vehicle
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CarSelector;
