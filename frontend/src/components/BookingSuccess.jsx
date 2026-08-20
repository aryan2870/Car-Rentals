import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle, Mail, MapPin, Calendar, Clock, IndianRupee, ArrowRight, User } from 'lucide-react';

const BookingSuccess = ({ booking, emailMode, onReset }) => {
  
  useEffect(() => {
    // Fire celebratory confetti!
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    // Fire again 250ms later for double splash
    const timer = setTimeout(() => {
      confetti({
        particleCount: 60,
        spread: 100,
        origin: { y: 0.65 }
      });
    }, 250);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{ maxWidth: '850px', margin: '0 auto', padding: '20px' }} className="animate-fade-in">
      <div className="glass-panel" style={{
        padding: '40px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Confetti container hook */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(0, 229, 255, 0.1)',
          border: '2px solid var(--accent-cyan)',
          borderRadius: '50%',
          width: '80px',
          height: '80px',
          marginBottom: '24px',
          boxShadow: '0 0 25px rgba(0, 229, 255, 0.3)'
        }}>
          <CheckCircle size={40} color="var(--accent-cyan)" />
        </div>

        <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '10px' }}>Booking Reserved!</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: '600px', margin: '0 auto 30px' }}>
          Your rental booking has been registered successfully. Booking Reference ID: <strong>{booking.id}</strong>.
        </p>

        {/* Info Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px',
          textAlign: 'left',
          marginBottom: '40px'
        }}>
          {/* Trip Specifications */}
          <div className="glass-panel" style={{ padding: '20px', background: 'rgba(255,255,255,0.01)' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--accent-cyan)', marginBottom: '16px' }}>Trip Summary</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem' }}>
              <div><strong>Vehicle:</strong> {booking.carName}</div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <MapPin size={15} color="var(--accent-purple)" />
                <div><strong>Pickup:</strong> {booking.pickupLocation}</div>
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <MapPin size={15} color="var(--accent-purple)" />
                <div><strong>Dropoff:</strong> {booking.dropLocation}</div>
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <Calendar size={15} color="var(--accent-purple)" />
                <div><strong>Dates:</strong> {booking.pickupDate} to {booking.dropDate}</div>
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <IndianRupee size={15} color="var(--accent-purple)" />
                <div><strong>Total Amount:</strong> <strong style={{ color: 'var(--accent-cyan)' }}>₹{booking.totalPrice}</strong></div>
              </div>
            </div>
          </div>

          {/* Passenger Information */}
          <div className="glass-panel" style={{ padding: '20px', background: 'rgba(255,255,255,0.01)' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--accent-purple)', marginBottom: '16px' }}>Passenger Details</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem' }}>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <User size={15} color="var(--text-secondary)" />
                <div><strong>Name:</strong> {booking.passengerInfo.name} {booking.passengerInfo.surname}</div>
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <Mail size={15} color="var(--text-secondary)" />
                <div><strong>Email:</strong> {booking.passengerInfo.email}</div>
              </div>
              <div><strong>Contact Phone:</strong> {booking.passengerInfo.contact}</div>
              <div><strong>Trip Status:</strong> <span style={{ color: 'var(--accent-cyan)', fontWeight: 'bold' }}>{booking.status}</span></div>
            </div>
          </div>
        </div>

        {/* Interactive Mock Email Simulation Section */}
        {emailMode !== 'real' && (
          <div className="glass-panel" style={{
            textAlign: 'left',
            padding: '24px',
            background: 'rgba(15, 18, 37, 0.8)',
            border: '1px dashed var(--accent-cyan)',
            borderRadius: '12px',
            marginBottom: '40px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              borderBottom: '1px solid var(--card-border)',
              paddingBottom: '12px',
              marginBottom: '16px'
            }}>
              <Mail size={20} color="var(--accent-cyan)" />
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Simulated Email Client (Testing Simulator)</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  EmailJS keys are empty/unset. Showing the confirmation email payload drafted for transmission.
                </p>
              </div>
            </div>
            
            <div style={{ fontSize: '0.85rem', lineHeight: '1.6', color: 'var(--text-primary)' }}>
              <div><strong>From:</strong> Veloce Car Rentals Support &lt;confirmations@velocerentals.com&gt;</div>
              <div><strong>To:</strong> {booking.passengerInfo.name} {booking.passengerInfo.surname} &lt;{booking.passengerInfo.email}&gt;</div>
              <div style={{ margin: '8px 0 12px', borderBottom: '1px solid var(--card-border)' }} />
              <div><strong>Subject:</strong> Reservation Confirmed - Ref: {booking.id}</div>
              <div style={{ marginTop: '12px', background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '8px', border: '1px solid var(--card-border)' }}>
                <p>Dear {booking.passengerInfo.name},</p>
                <p style={{ marginTop: '8px' }}>
                  Thank you for booking with Veloce Rentals! Your reservation has been locked in. Below are your travel details:
                </p>
                <ul style={{ margin: '12px 0 12px 20px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <li><strong>Booking Reference:</strong> {booking.id}</li>
                  <li><strong>Vehicle Hired:</strong> {booking.carName}</li>
                  <li><strong>Pickup Location:</strong> {booking.pickupLocation} (on {booking.pickupDate} @ {booking.pickupTime})</li>
                  <li><strong>Drop-off Location:</strong> {booking.dropLocation} (on {booking.dropDate} @ {booking.dropTime})</li>
                  <li><strong>Contact Number:</strong> {booking.passengerInfo.contact}</li>
                  <li><strong>Total Paid / Due:</strong> ₹{booking.totalPrice}</li>
                  {(booking.carName.toLowerCase().includes('activa') || 
                    booking.carName.toLowerCase().includes('classic') || 
                    booking.carName.toLowerCase().includes('r15') || 
                    booking.carName.toLowerCase().includes('bike') || 
                    booking.carName.toLowerCase().includes('scooty')) && (
                    <li><strong>Perks Included:</strong> 2 Helmets, Zero Security Deposit, Self-Ride Rental Checklist</li>
                  )}
                </ul>
                <p>
                  {(booking.carName.toLowerCase().includes('activa') || 
                    booking.carName.toLowerCase().includes('classic') || 
                    booking.carName.toLowerCase().includes('r15') || 
                    booking.carName.toLowerCase().includes('bike') || 
                    booking.carName.toLowerCase().includes('scooty')) ? (
                    "This is a self-ride rental. Please bring a valid riding license and identity card. Your keys and safety helmets will be waiting for you at the pickup location counter."
                  ) : (
                    "An admin driver is currently being assigned to your trip. You can monitor your ride details anytime using your email address."
                  )}
                </p>
                <p style={{ marginTop: '12px' }}>Warm regards,<br /><strong>Veloce Rental Team</strong></p>
              </div>
            </div>
          </div>
        )}

        {emailMode === 'real' && (
          <div style={{
            background: 'rgba(0, 229, 255, 0.05)',
            border: '1px solid var(--accent-cyan)',
            padding: '14px',
            borderRadius: '10px',
            color: 'var(--accent-cyan)',
            marginBottom: '30px',
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}>
            <Mail size={16} />
            A real confirmation email has been dispatched via EmailJS to {booking.passengerInfo.email}.
          </div>
        )}

        <button onClick={onReset} className="btn-primary" style={{ padding: '14px 28px' }}>
          Book Another Ride
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default BookingSuccess;
