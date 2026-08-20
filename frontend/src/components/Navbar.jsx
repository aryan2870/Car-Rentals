import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Car, User, LogOut, ShieldAlert, Menu, X, HelpCircle, BookOpen, Layers } from 'lucide-react';

const Navbar = ({ activeTab, setActiveTab, onSelectAuth }) => {
  const { user, logOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'booking', label: 'Book a Ride', icon: <Car size={16} />, show: !user || user.role === 'user' },
    { id: 'admin', label: 'Owner Dashboard', icon: <ShieldAlert size={16} />, show: user?.role === 'admin' },
    { id: 'fleet', label: 'Our Fleet', icon: <Layers size={16} />, show: true },
    { id: 'how-it-works', label: 'How It Works', icon: <BookOpen size={16} />, show: true },
    { id: 'support', label: 'Support', icon: <HelpCircle size={16} />, show: true }
  ];

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="glass-panel" style={{
      margin: '20px auto',
      maxWidth: '1200px',
      width: 'calc(100% - 40px)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '16px 28px',
      zIndex: 1000,
      position: 'relative'
    }}>
      {/* Brand logo */}
      <div 
        onClick={() => handleTabClick('booking')}
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
          letterSpacing: '1px'
        }}
      >
        <Car size={26} color="#00e5ff" style={{ filter: 'drop-shadow(0 0 5px rgba(0,229,255,0.5))' }} />
        <span style={{ fontWeight: 800 }}>VELOCE RENTALS</span>
      </div>

      {/* Desktop Navigation Links */}
      <div className="desktop-menu" style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
        {navItems.map((item) => {
          if (!item.show) return null;
          const isActive = activeTab === item.id;
          const isSpecial = item.id === 'admin';
          
          return (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              style={{
                background: isActive 
                  ? (isSpecial ? 'rgba(124, 77, 255, 0.15)' : 'rgba(0, 229, 255, 0.08)') 
                  : 'transparent',
                color: isActive 
                  ? (isSpecial ? 'var(--accent-purple)' : 'var(--accent-cyan)') 
                  : 'var(--text-primary)',
                border: isActive 
                  ? `1px solid ${isSpecial ? 'var(--accent-purple)' : 'var(--accent-cyan)'}` 
                  : '1px solid transparent',
                padding: '8px 16px',
                borderRadius: '10px',
                fontSize: '0.92rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                transition: 'var(--transition)'
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.color = isSpecial ? 'var(--accent-purple)' : 'var(--accent-cyan)';
                  e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.color = 'var(--text-primary)';
                  e.currentTarget.style.background = 'transparent';
                }
              }}
            >
              {item.icon}
              {item.label}
              {isSpecial && (
                <span style={{
                  background: 'var(--accent-cyan)',
                  color: '#000',
                  fontSize: '0.65rem',
                  padding: '1px 5px',
                  borderRadius: '4px',
                  fontWeight: 'bold',
                  marginLeft: '2px'
                }}>Owner</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Desktop Authentication Controls */}
      <div className="desktop-menu" style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(255, 255, 255, 0.04)',
              padding: '6px 14px',
              borderRadius: '10px',
              border: '1px solid var(--card-border)'
            }}>
              <User size={16} color="var(--accent-cyan)" />
              <span style={{ fontSize: '0.92rem', fontWeight: 500 }}>
                {user.username}
              </span>
            </div>
            <button
              onClick={logOut}
              style={{
                background: 'rgba(255, 64, 129, 0.1)',
                border: '1px solid rgba(255, 64, 129, 0.2)',
                color: '#ff4081',
                padding: '8px 12px',
                borderRadius: '10px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.9rem',
                fontWeight: 600,
                transition: 'all 0.2s'
              }}
              title="Logout"
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 64, 129, 0.2)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 64, 129, 0.1)'}
            >
              <LogOut size={15} />
              <span>Logout</span>
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              className="btn-secondary"
              onClick={() => onSelectAuth('login')}
              style={{
                padding: '8px 16px',
                fontSize: '0.9rem',
                borderRadius: '10px'
              }}
            >
              Sign In
            </button>
            <button
              className="btn-primary"
              onClick={() => onSelectAuth('signup')}
              style={{
                padding: '8px 16px',
                fontSize: '0.9rem',
                borderRadius: '10px'
              }}
            >
              Sign Up
            </button>
          </div>
        )}
      </div>

      {/* Hamburger Menu Toggle (Mobile view only) */}
      <button
        className="mobile-toggle"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid var(--card-border)',
          color: '#fff',
          borderRadius: '8px',
          padding: '8px',
          cursor: 'pointer',
          display: 'none',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'var(--transition)'
        }}
      >
        {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile Collapsible Dropdown Navigation Menu */}
      {mobileMenuOpen && (
        <div 
          className="glass-panel mobile-dropdown animate-fade-in"
          style={{
            position: 'absolute',
            top: 'calc(100% + 10px)',
            left: 0,
            right: 0,
            zIndex: 999,
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            border: '1px solid var(--card-border)',
            background: 'rgba(15, 18, 37, 0.98)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
          }}
        >
          {navItems.map((item) => {
            if (!item.show) return null;
            const isActive = activeTab === item.id;
            const isSpecial = item.id === 'admin';

            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                style={{
                  background: isActive 
                    ? (isSpecial ? 'rgba(124, 77, 255, 0.15)' : 'rgba(0, 229, 255, 0.08)') 
                    : 'transparent',
                  color: isActive 
                    ? (isSpecial ? 'var(--accent-purple)' : 'var(--accent-cyan)') 
                    : 'var(--text-primary)',
                  border: isActive 
                    ? `1px solid ${isSpecial ? 'var(--accent-purple)' : 'var(--accent-cyan)'}` 
                    : '1px solid transparent',
                  padding: '10px 16px',
                  borderRadius: '8px',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  cursor: 'pointer',
                  width: '100%',
                  textAlign: 'left'
                }}
              >
                {item.icon}
                <span>{item.label}</span>
                {isSpecial && (
                  <span style={{
                    background: 'var(--accent-cyan)',
                    color: '#000',
                    fontSize: '0.6rem',
                    padding: '1px 5px',
                    borderRadius: '4px',
                    fontWeight: 'bold',
                    marginLeft: 'auto'
                  }}>Owner</span>
                )}
              </button>
            );
          })}

          <div style={{ height: '1px', background: 'var(--card-border)', margin: '4px 0' }} />

          {/* Mobile Auth actions */}
          {user ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 12px',
                color: 'var(--text-secondary)'
              }}>
                <User size={16} color="var(--accent-cyan)" />
                <span style={{ fontSize: '0.95rem' }}>{user.username}</span>
              </div>
              <button
                onClick={() => {
                  logOut();
                  setMobileMenuOpen(false);
                }}
                style={{
                  background: 'rgba(255, 64, 129, 0.1)',
                  border: '1px solid rgba(255, 64, 129, 0.2)',
                  color: '#ff4081',
                  padding: '10px',
                  borderRadius: '8px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                className="btn-secondary"
                onClick={() => {
                  onSelectAuth('login');
                  setMobileMenuOpen(false);
                }}
                style={{ flexGrow: 1, padding: '10px', fontSize: '0.9rem' }}
              >
                Sign In
              </button>
              <button
                className="btn-primary"
                onClick={() => {
                  onSelectAuth('signup');
                  setMobileMenuOpen(false);
                }}
                style={{ flexGrow: 1, padding: '10px', fontSize: '0.9rem', justifyContent: 'center' }}
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
      )}

      {/* Embedded CSS style overrides for mobile responsive menu */}
      <style>{`
        @media (max-width: 768px) {
          .desktop-menu {
            display: none !important;
          }
          .mobile-toggle {
            display: flex !important;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
