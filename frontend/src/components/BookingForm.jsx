import React, { useState, useEffect } from 'react';
import { useBooking } from '../context/BookingContext';
import { MapPin, Calendar, Clock, ArrowRight, Check } from 'lucide-react';

const SUGGESTIONS = [
  'Pune Airport (Lohegaon - PNQ)',
  'Pune Central Railway Station',
  'Shivajinagar Bus Stand & Station',
  'Swargate Bus Terminus',
  'Hinjewadi Phase 1 (IT Park)',
  'Hinjewadi Phase 3 (Tech Center)',
  'Koregaon Park (Osho Ashram Area)',
  'Viman Nagar (Phoenix Mall Area)',
  'Baner Balewadi High Street',
  'Kothrud (Karve Road Depot)',
  'Hadapsar (Magarpatta City)',
  'Deccan Gymkhana (F.C. Road)',
  'Kalyani Nagar (Cerebrum IT Park)',
  'Wakad (Chowk Terminal)',
  'Pimpri Chinchwad (PCMC Center)'
];

const BookingForm = ({ onNext }) => {
  const { bookingDetails, updateBookingDetails } = useBooking();

  const [vehicleType, setVehicleType] = useState(bookingDetails.vehicleType || 'car');
  const [pickup, setPickup] = useState(bookingDetails.pickupLocation);
  const [drop, setDrop] = useState(bookingDetails.dropLocation);

  // Set default dates if not already configured
  const getTodayDateString = () => new Date().toISOString().split('T')[0];
  const getTomorrowDateString = () => new Date(Date.now() + 86400000).toISOString().split('T')[0];

  const [pickupDate, setPickupDate] = useState(bookingDetails.pickupDate || getTodayDateString());
  const [pickupTime, setPickupTime] = useState(bookingDetails.pickupTime || '10:00');
  const [dropDate, setDropDate] = useState(bookingDetails.dropDate || getTomorrowDateString());
  const [dropTime, setDropTime] = useState(bookingDetails.dropTime || '10:00');

  const [sameLocation, setSameLocation] = useState(true);
  const [error, setError] = useState('');

  // Suggestions toggles
  const [showPickupList, setShowPickupList] = useState(false);
  const [showDropList, setShowDropList] = useState(false);

  // Dynamic Date constraints handlers (Drop Date cannot be before Pickup Date and vice versa)
  const handlePickupDateChange = (val) => {
    setPickupDate(val);
    const start = new Date(val);
    const end = new Date(dropDate);
    if (end < start) {
      setDropDate(val);
    }
  };

  const handleDropDateChange = (val) => {
    setDropDate(val);
    const start = new Date(pickupDate);
    const end = new Date(val);
    if (end < start) {
      setPickupDate(val);
    }
  };

  useEffect(() => {
    if (sameLocation) {
      setDrop(pickup);
    }
  }, [pickup, sameLocation]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!pickup) {
      setError('Please choose a pickup location.');
      return;
    }
    if (!drop) {
      setError('Please choose a drop-off location.');
      return;
    }
    if (!pickupDate || !dropDate) {
      setError('Please select trip dates.');
      return;
    }

    // Check dates logic
    const start = new Date(`${pickupDate}T${pickupTime}`);
    const end = new Date(`${dropDate}T${dropTime}`);

    if (end <= start) {
      setError('Return date/time must be after pickup date/time.');
      return;
    }

    setError('');

    // Update booking context state
    updateBookingDetails({
      vehicleType,
      pickupLocation: pickup,
      dropLocation: drop,
      pickupDate,
      pickupTime,
      dropDate,
      dropTime
    });

    onNext();
  };

  return (
    <div className="glass-panel animate-fade-in" style={{
      maxWidth: '850px',
      width: '100%',
      margin: '0 auto',
      padding: '30px',
      position: 'relative'
    }}>
      {/* Glow highlight */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        borderRadius: '16px',
        boxShadow: 'inset 0 0 15px rgba(0, 229, 255, 0.05)',
        pointerEvents: 'none'
      }} />

      {/* Vehicle Category Selector Toggle */}
      <div style={{
        display: 'flex',
        background: 'rgba(255, 255, 255, 0.02)',
        border: '1px solid var(--card-border)',
        borderRadius: '12px',
        padding: '6px',
        marginBottom: '28px',
        width: 'fit-content',
        margin: '0 auto 28px'
      }}>
        <button
          type="button"
          onClick={() => setVehicleType('car')}
          style={{
            background: vehicleType === 'car' ? 'var(--accent-gradient)' : 'transparent',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            padding: '10px 24px',
            fontWeight: 600,
            fontSize: '0.95rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'var(--transition)'
          }}
        >
          <span>Rent a Car</span>
        </button>
        <button
          type="button"
          onClick={() => setVehicleType('bike')}
          style={{
            background: vehicleType === 'bike' ? 'var(--accent-gradient)' : 'transparent',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            padding: '10px 24px',
            fontWeight: 600,
            fontSize: '0.95rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'var(--transition)'
          }}
        >
          <span>Rent a Bike</span>
        </button>
      </div>

      <h3 style={{
        fontSize: '1.4rem',
        fontWeight: 600,
        marginBottom: '20px',
        background: 'linear-gradient(135deg, #fff, var(--text-secondary))',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
      }}>
        {vehicleType === 'car' ? 'Search Premium Car Rentals' : 'Search Scooties & Motorcycles (Duo Package)'}
      </h3>

      {error && (
        <div style={{
          background: 'rgba(255, 64, 129, 0.1)',
          border: '1px solid rgba(255, 64, 129, 0.2)',
          padding: '12px',
          color: '#ff4081',
          borderRadius: '8px',
          marginBottom: '20px',
          fontSize: '0.9rem'
        }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '24px',
          marginBottom: '24px'
        }}>
          {/* Pickup location search */}
          <div className="form-group" style={{ position: 'relative' }}>
            <label className="form-label">Pickup Location</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                className="form-control"
                placeholder="Enter Pickup Location"
                value={pickup}
                onChange={(e) => {
                  setPickup(e.target.value);
                  setShowPickupList(true);
                }}
                onFocus={() => setShowPickupList(true)}
                onBlur={() => setTimeout(() => setShowPickupList(false), 200)}
                style={{ width: '100%', paddingLeft: '44px' }}
              />
              <MapPin size={18} color="var(--accent-cyan)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
            </div>

            {showPickupList && (
              <div className="glass-panel" style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                zIndex: 10,
                marginTop: '6px',
                borderRadius: '12px',
                overflowY: 'auto',
                maxHeight: '220px',
                background: 'rgba(15, 18, 37, 0.95)',
                border: '1px solid var(--card-border)'
              }}>
                {SUGGESTIONS.filter(item => item.toLowerCase().includes(pickup.toLowerCase())).map((item) => (
                  <div
                    key={item}
                    onMouseDown={() => {
                      setPickup(item);
                      setShowPickupList(false);
                    }}
                    style={{
                      padding: '12px 16px',
                      cursor: 'pointer',
                      fontSize: '0.95rem',
                      transition: 'all 0.2s',
                      color: 'var(--text-primary)'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(0, 229, 255, 0.1)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    {item}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Dropoff location search */}
          <div className="form-group" style={{ position: 'relative' }}>
            <label className="form-label">Drop-off Location</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                className="form-control"
                placeholder="Enter Drop-off Location"
                value={sameLocation ? pickup : drop}
                disabled={sameLocation}
                onChange={(e) => {
                  setDrop(e.target.value);
                  setShowDropList(true);
                }}
                onFocus={() => setShowDropList(true)}
                onBlur={() => setTimeout(() => setShowDropList(false), 200)}
                style={{
                  width: '100%',
                  paddingLeft: '44px',
                  opacity: sameLocation ? 0.6 : 1
                }}
              />
              <MapPin size={18} color="var(--accent-purple)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
            </div>

            {!sameLocation && showDropList && (
              <div className="glass-panel" style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                zIndex: 10,
                marginTop: '6px',
                borderRadius: '12px',
                overflowY: 'auto',
                maxHeight: '220px',
                background: 'rgba(15, 18, 37, 0.95)',
                border: '1px solid var(--card-border)'
              }}>
                {SUGGESTIONS.filter(item => item.toLowerCase().includes(drop.toLowerCase())).map((item) => (
                  <div
                    key={item}
                    onMouseDown={() => {
                      setDrop(item);
                      setShowDropList(false);
                    }}
                    style={{
                      padding: '12px 16px',
                      cursor: 'pointer',
                      fontSize: '0.95rem',
                      transition: 'all 0.2s',
                      color: 'var(--text-primary)'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(124, 77, 255, 0.1)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    {item}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Same location checkbox */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
          <div
            onClick={() => setSameLocation(!sameLocation)}
            style={{
              width: '20px',
              height: '20px',
              border: '2px solid var(--accent-cyan)',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              background: sameLocation ? 'rgba(0, 229, 255, 0.1)' : 'transparent',
              transition: 'all 0.2s'
            }}
          >
            {sameLocation && <Check size={14} color="var(--accent-cyan)" />}
          </div>
          <span
            onClick={() => setSameLocation(!sameLocation)}
            style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', cursor: 'pointer', userSelect: 'none' }}
          >
            Return to the same pickup location
          </span>
        </div>

        {/* Date and Time selectors */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '20px',
          marginBottom: '30px'
        }}>
          {/* Pickup Date */}
          <div className="form-group">
            <label className="form-label">Pickup Date</label>
            <div style={{ position: 'relative' }}>
              <input
                type="date"
                className="form-control"
                value={pickupDate}
                min={getTodayDateString()}
                onChange={(e) => handlePickupDateChange(e.target.value)}
                style={{ width: '100%', paddingLeft: '44px' }}
              />
              <Calendar size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
            </div>
          </div>

          {/* Pickup Time */}
          <div className="form-group">
            <label className="form-label">Pickup Time</label>
            <div style={{ position: 'relative' }}>
              <input
                type="time"
                className="form-control"
                value={pickupTime}
                onChange={(e) => setPickupTime(e.target.value)}
                style={{ width: '100%', paddingLeft: '44px' }}
              />
              <Clock size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
            </div>
          </div>

          {/* Dropoff Date */}
          <div className="form-group">
            <label className="form-label">Return Date</label>
            <div style={{ position: 'relative' }}>
              <input
                type="date"
                className="form-control"
                value={dropDate}
                min={pickupDate}
                onChange={(e) => handleDropDateChange(e.target.value)}
                style={{ width: '100%', paddingLeft: '44px' }}
              />
              <Calendar size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
            </div>
          </div>

          {/* Dropoff Time */}
          <div className="form-group">
            <label className="form-label">Return Time</label>
            <div style={{ position: 'relative' }}>
              <input
                type="time"
                className="form-control"
                value={dropTime}
                onChange={(e) => setDropTime(e.target.value)}
                style={{ width: '100%', paddingLeft: '44px' }}
              />
              <Clock size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button type="submit" className="btn-primary" style={{ padding: '14px 28px' }}>
            {vehicleType === 'bike' ? 'Find Available Bikes' : 'Find Available Cars'}
            <ArrowRight size={18} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookingForm;
