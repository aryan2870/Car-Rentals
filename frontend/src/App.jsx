import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { BookingProvider, useBooking } from './context/BookingContext';
import Navbar from './components/Navbar';
import BookingForm from './components/BookingForm';
import CarSelector from './components/CarSelector';
import PassengerForm from './components/PassengerForm';
import BookingSuccess from './components/BookingSuccess';
import AuthPortal from './components/AuthPortal';
import AdminDashboard from './components/AdminDashboard';
import FleetView from './components/FleetView';
import HowItWorks from './components/HowItWorks';
import SupportView from './components/SupportView';
import Footer from './components/Footer';
import { Mail, X, Bell, ShieldCheck } from 'lucide-react';

const MainAppContent = () => {
  const [activeTab, setActiveTab] = useState('booking');
  const [bookingStep, setBookingStep] = useState('form'); // 'form' | 'car' | 'passenger' | 'success'
  const [completedBooking, setCompletedBooking] = useState(null);
  const [emailMode, setEmailMode] = useState('mock');
  const [incomingEmailNotification, setIncomingEmailNotification] = useState(null);
  
  // Redirectional auth variables
  const [authView, setAuthView] = useState('login'); // 'login' | 'signup'
  const [pendingRedirect, setPendingRedirect] = useState(false);

  // Sync state with browser history (back/forward navigation support)
  useEffect(() => {
    // Replace initial state with current values
    window.history.replaceState({ activeTab, bookingStep }, '');

    const handlePopState = (event) => {
      if (event.state) {
        const { activeTab: newTab, bookingStep: newStep } = event.state;
        setActiveTab(newTab);
        setBookingStep(newStep);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    const currentState = window.history.state;
    if (!currentState || currentState.activeTab !== activeTab || currentState.bookingStep !== bookingStep) {
      window.history.pushState({ activeTab, bookingStep }, '');
    }
  }, [activeTab, bookingStep]);

  const { bookingDetails, resetBookingFlow, updateBookingDetails } = useBooking();
  const { user } = useAuth();

  const handleSelectAuth = (view) => {
    setAuthView(view);
    setActiveTab('auth');
  };

  const handleBookNow = (vehicleType) => {
    updateBookingDetails({ vehicleType });
    setBookingStep('form');
    setActiveTab('booking');
  };

  const handleStartBooking = () => {
    setBookingStep('form');
    setActiveTab('booking');
  };

  const handlePromptAuth = () => {
    setPendingRedirect(true);
    setAuthView('login');
    setActiveTab('auth');
  };

  const handleAuthSuccess = () => {
    if (pendingRedirect) {
      setPendingRedirect(false);
      setActiveTab('booking');
      setBookingStep('passenger'); // Bypass directly back to Passenger Form step
    } else {
      setActiveTab('booking');
      setBookingStep('form');
    }
  };

  // Listen for simulated email triggers
  useEffect(() => {
    const handleSimulatedEmail = (e) => {
      setIncomingEmailNotification(e.detail);
      
      // Auto-dismiss notification after 8 seconds
      const timer = setTimeout(() => {
        setIncomingEmailNotification(null);
      }, 8000);
      
      return () => clearTimeout(timer);
    };

    window.addEventListener('show-mock-email', handleSimulatedEmail);
    return () => window.removeEventListener('show-mock-email', handleSimulatedEmail);
  }, []);

  // Automatically segregation routing based on active role login state
  useEffect(() => {
    if (user) {
      if (user.role === 'admin') {
        setActiveTab('admin');
      } else {
        setActiveTab('booking');
      }
    } else {
      setActiveTab('booking');
    }
  }, [user]);

  const handleBookingSuccess = (booking, mode) => {
    setCompletedBooking(booking);
    setEmailMode(mode);
    setBookingStep('success');
  };

  const handleResetBooking = () => {
    resetBookingFlow();
    setCompletedBooking(null);
    setBookingStep('form');
  };

  return (
    <div style={{ paddingBottom: '80px' }}>
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} onSelectAuth={handleSelectAuth} />

      {/* Main Content Router */}
      <main style={{ maxWidth: '1200px', margin: '30px auto', padding: '0 20px' }}>
        
        {activeTab === 'booking' && (
          <div>
            {/* Steps indicator */}
            {bookingStep !== 'success' && (
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '12px',
                marginBottom: '40px',
                fontSize: '0.85rem',
                fontWeight: 600
              }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '6px',
                  color: bookingStep === 'form' ? 'var(--accent-cyan)' : 'var(--text-muted)',
                  borderBottom: bookingStep === 'form' ? '2px solid var(--accent-cyan)' : '2px solid transparent',
                  paddingBottom: '6px',
                  transition: 'all 0.3s'
                }}>
                  <span>1. Configure Rental</span>
                </div>
                <div style={{ color: 'var(--text-muted)' }}>&gt;</div>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '6px',
                  color: bookingStep === 'car' ? 'var(--accent-cyan)' : 'var(--text-muted)',
                  borderBottom: bookingStep === 'car' ? '2px solid var(--accent-cyan)' : '2px solid transparent',
                  paddingBottom: '6px',
                  transition: 'all 0.3s'
                }}>
                  <span>2. Select Vehicle</span>
                </div>
                <div style={{ color: 'var(--text-muted)' }}>&gt;</div>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '6px',
                  color: bookingStep === 'passenger' ? 'var(--accent-cyan)' : 'var(--text-muted)',
                  borderBottom: bookingStep === 'passenger' ? '2px solid var(--accent-cyan)' : '2px solid transparent',
                  paddingBottom: '6px',
                  transition: 'all 0.3s'
                }}>
                  <span>3. Passenger Details</span>
                </div>
              </div>
            )}

            {/* Step components */}
            {bookingStep === 'form' && (
              <div className="animate-fade-in" style={{ textAlign: 'center' }}>
                <div style={{ marginBottom: '40px' }}>
                  <h1 style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '0.5px', marginBottom: '8px' }}>
                    Drive Premium. Arrive Safely.
                  </h1>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
                    Select your custom locations, schedule dates, pick a high-performance vehicle, and register details immediately.
                  </p>
                </div>
                <BookingForm onNext={() => setBookingStep('car')} />
              </div>
            )}

            {bookingStep === 'car' && (
              <CarSelector 
                onNext={() => setBookingStep('passenger')} 
                onBack={() => setBookingStep('form')} 
                onPromptAuth={handlePromptAuth}
              />
            )}

            {bookingStep === 'passenger' && (
              <PassengerForm 
                onSuccess={handleBookingSuccess} 
                onBack={() => setBookingStep('car')} 
              />
            )}

            {bookingStep === 'success' && completedBooking && (
              <BookingSuccess 
                booking={completedBooking} 
                emailMode={emailMode} 
                onReset={handleResetBooking} 
              />
            )}
          </div>
        )}

        {activeTab === 'fleet' && (
          <FleetView onBookNow={handleBookNow} />
        )}

        {activeTab === 'how-it-works' && (
          <HowItWorks onStartBooking={handleStartBooking} />
        )}

        {activeTab === 'support' && (
          <SupportView />
        )}

        {activeTab === 'auth' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {pendingRedirect && (
              <div className="glass-panel animate-fade-in" style={{
                maxWidth: '450px',
                width: 'calc(100% - 40px)',
                margin: '20px auto -10px',
                padding: '16px 20px',
                border: '1px solid var(--accent-purple)',
                background: 'rgba(124, 77, 255, 0.05)',
                borderRadius: '12px',
                textAlign: 'center',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                justifyContent: 'center'
              }}>
                <Mail size={18} color="var(--accent-purple)" style={{ flexShrink: 0 }} />
                <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Please Sign In or Create an Account to lock in your vehicle booking.</span>
              </div>
            )}
            <AuthPortal onAuthSuccess={handleAuthSuccess} initialView={authView} />
          </div>
        )}

        {activeTab === 'admin' && (
          <AdminDashboard />
        )}
      </main>
      
      <Footer setActiveTab={setActiveTab} />

      {/* Floating Simulated Inbox Alert notification overlay */}
      {incomingEmailNotification && (
        <div 
          className="glass-panel" 
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            width: '380px',
            zIndex: 1000,
            padding: '20px',
            border: '1px solid var(--accent-purple)',
            boxShadow: '0 10px 40px rgba(124, 77, 255, 0.3)',
            animation: 'slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards'
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Bell size={18} color="var(--accent-purple)" style={{ animation: 'bounce 1s infinite' }} />
              <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--accent-purple)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                New Email Notification
              </span>
            </div>
            <button 
              onClick={() => setIncomingEmailNotification(null)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
            >
              <X size={16} />
            </button>
          </div>

          {/* Email Subject / Header details */}
          <div style={{ display: 'flex', gap: '12px', fontSize: '0.85rem' }}>
            <div style={{
              background: 'rgba(124, 77, 255, 0.1)',
              borderRadius: '8px',
              padding: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '40px',
              width: '40px',
              flexShrink: 0
            }}>
              <Mail size={20} color="var(--accent-purple)" />
            </div>
            
            <div style={{ flexGrow: 1, minWidth: 0 }}>
              {incomingEmailNotification.type === 'booking' ? (
                <>
                  <div style={{ fontWeight: 'bold', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                    Subject: Reservation Confirmation (Ref: {incomingEmailNotification.params.booking_id})
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    To: {incomingEmailNotification.params.to_name} ({incomingEmailNotification.params.to_email})
                  </div>
                  <div style={{
                    marginTop: '8px',
                    fontSize: '0.8rem',
                    background: 'rgba(255, 255, 255, 0.02)',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid var(--card-border)',
                    maxHeight: '120px',
                    overflowY: 'auto'
                  }}>
                    Booking successfully registered for <strong>{incomingEmailNotification.params.car_name}</strong>. Pickup from {incomingEmailNotification.params.pickup_location} is scheduled for {incomingEmailNotification.params.pickup_date} @ {incomingEmailNotification.params.pickup_time}.
                  </div>
                </>
              ) : (
                <>
                  <div style={{ fontWeight: 'bold', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                    Subject: PASSWORD RECOVERY - Reset Alert
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    To: {incomingEmailNotification.params.to_email}
                  </div>
                  <div style={{
                    marginTop: '8px',
                    fontSize: '0.8rem',
                    background: 'rgba(255, 255, 255, 0.02)',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid var(--card-border)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-cyan)', fontWeight: 'bold', marginBottom: '4px' }}>
                      <ShieldCheck size={14} />
                      <span>Security recovery token generated!</span>
                    </div>
                    <div>Hello <strong>{incomingEmailNotification.params.username}</strong>,</div>
                    <div style={{ marginTop: '4px' }}>Your password reset verification code is: <strong style={{ color: 'var(--accent-cyan)', fontSize: '0.9rem' }}>{incomingEmailNotification.params.reset_code}</strong></div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>Your current password is: {incomingEmailNotification.params.temp_password}</div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Slide up animation CSS */}
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
      `}</style>
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <BookingProvider>
        <MainAppContent />
      </BookingProvider>
    </AuthProvider>
  );
};

export default App;
