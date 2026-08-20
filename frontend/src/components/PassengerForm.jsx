import React, { useState, useEffect } from 'react';
import { useBooking } from '../context/BookingContext';
import { useAuth } from '../context/AuthContext';
import { User, Phone, Mail, ChevronLeft, CreditCard, Calendar } from 'lucide-react';

const PassengerForm = ({ onSuccess, onBack }) => {
  const { bookingDetails, createBooking, error: bookingError } = useBooking();
  const { user } = useAuth();

  const [name, setName] = useState(user ? user.username.split(/[._-]/)[0] : '');
  const [surname, setSurname] = useState(user ? user.username.split(/[._-]/)[1] || '' : '');
  const [contact, setContact] = useState('');
  const [email, setEmail] = useState(user ? user.email : '');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Update email if user logs in later or changes
  useEffect(() => {
    if (user) {
      if (!name) setName(user.username.split(/[._-]/)[0]);
      if (!email) setEmail(user.email);
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !surname || !contact || !email) {
      setError('Please fill in all passenger details.');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setError('');
    setLoading(true);

    const passengerDetails = { name, surname, contact, email };
    
    // Create booking in the backend & trigger EmailJS
    const result = await createBooking(passengerDetails, user?.id);
    
    setLoading(false);
    
    if (result.success) {
      onSuccess(result.booking, result.emailMode);
    } else {
      setError(result.error || 'Failed to complete booking');
    }
  };

  const { selectedCar } = bookingDetails;

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px' }} className="animate-fade-in">
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
          marginBottom: '20px',
          padding: 0
        }}
      >
        <ChevronLeft size={18} />
        Back to Car Catalog
      </button>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '30px'
      }}>
        {/* Passenger Information form panel */}
        <div className="glass-panel" style={{ padding: '30px', position: 'relative' }}>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 600, marginBottom: '20px' }}>Passenger Details</h3>
          
          {(error || bookingError) && (
            <div style={{
              background: 'rgba(255, 64, 129, 0.1)',
              border: '1px solid rgba(255, 64, 129, 0.2)',
              padding: '12px',
              color: '#ff4081',
              borderRadius: '8px',
              marginBottom: '20px',
              fontSize: '0.9rem'
            }}>
              {error || bookingError}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">First Name</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="John"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{ width: '100%', paddingLeft: '40px' }}
                  />
                  <User size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Surname</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Doe"
                    value={surname}
                    onChange={(e) => setSurname(e.target.value)}
                    style={{ width: '100%', paddingLeft: '40px' }}
                  />
                  <User size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Contact Details</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="tel"
                  className="form-control"
                  placeholder="+1 (555) 019-2834"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  style={{ width: '100%', paddingLeft: '40px' }}
                />
                <Phone size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  className="form-control"
                  placeholder="john.doe@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ width: '100%', paddingLeft: '40px' }}
                />
                <Mail size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                Booking details and confirmation will be sent here.
              </span>
            </div>

            <button 
              type="submit" 
              className="btn-primary" 
              disabled={loading} 
              style={{ width: '100%', justifyContent: 'center', marginTop: '10px', padding: '14px' }}
            >
              {loading ? 'Confirming Reservation...' : 'Reserve Now'}
              {!loading && <CreditCard size={18} />}
            </button>
          </form>
        </div>

        {/* Trip Summary sidebar */}
        {selectedCar && (
          <div className="glass-panel" style={{ padding: '30px', height: 'fit-content' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 600, marginBottom: '20px', borderBottom: '1px solid var(--card-border)', paddingBottom: '10px' }}>
              Rental Summary
            </h3>

            {/* Car visual info */}
            <div style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
              <img 
                src={selectedCar.image} 
                alt={selectedCar.name} 
                style={{ width: '100px', height: '65px', objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--card-border)' }}
              />
              <div>
                <h4 style={{ fontWeight: 600, fontSize: '1.05rem' }}>{selectedCar.name}</h4>
                <div style={{ fontSize: '0.85rem', color: 'var(--accent-cyan)', marginTop: '4px', textTransform: 'uppercase', fontWeight: 600 }}>
                  {selectedCar.type}
                </div>
              </div>
            </div>

            {/* Trip route/date details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
              <div style={{ display: 'flex', gap: '10px' }}>
                <Calendar size={16} color="var(--accent-purple)" style={{ marginTop: '2px' }} />
                <div>
                  <strong>Pickup</strong>
                  <div>{bookingDetails.pickupLocation}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    {bookingDetails.pickupDate} @ {bookingDetails.pickupTime}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <Calendar size={16} color="var(--accent-purple)" style={{ marginTop: '2px' }} />
                <div>
                  <strong>Return</strong>
                  <div>{bookingDetails.dropLocation}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    {bookingDetails.dropDate} @ {bookingDetails.dropTime}
                  </div>
                </div>
              </div>
            </div>

            {/* Price Calculations */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid var(--card-border)',
              borderRadius: '10px',
              padding: '16px',
              fontSize: '0.9rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span>Daily Rental Cost:</span>
                <span>₹{selectedCar.pricePerDay}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span>Rental Duration:</span>
                <span>
                  {bookingDetails.pickupDate && bookingDetails.dropDate ? (
                    `${Math.max(1, Math.ceil((new Date(bookingDetails.dropDate) - new Date(bookingDetails.pickupDate)) / (1000 * 60 * 60 * 24)))} days`
                  ) : (
                    '1 day'
                  )}
                </span>
              </div>
              
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontWeight: 'bold',
                fontSize: '1.15rem',
                borderTop: '1px dashed var(--card-border)',
                paddingTop: '12px',
                color: 'var(--accent-cyan)'
              }}>
                <span>Total Amount:</span>
                <span>
                  ₹{
                    selectedCar.pricePerDay * Math.max(1, Math.ceil((new Date(bookingDetails.dropDate || new Date()) - new Date(bookingDetails.pickupDate || new Date())) / (1000 * 60 * 60 * 24)))
                  }
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PassengerForm;
