import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserPlus, LogIn, Key, Mail, Lock, ShieldCheck, AlertCircle } from 'lucide-react';

const AuthPortal = ({ onAuthSuccess, initialView = 'login' }) => {
  const { signUp, logIn, logOut, forgotPassword, error, clearError } = useAuth();
  
  // Tabs: 'login' | 'signup' | 'forgot'
  const [view, setView] = useState(initialView);
  
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [signUpType, setSignUpType] = useState('user'); // 'user' | 'owner'
  const [shopName, setShopName] = useState('');
  const [shopLicense, setShopLicense] = useState('');
  const [loginType, setLoginType] = useState('user'); // 'user' | 'owner'
  
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [localError, setLocalError] = useState('');

  // Sync view state if initialView changes externally
  React.useEffect(() => {
    setView(initialView);
    clearError();
    setLocalError('');
    setSuccessMessage('');
  }, [initialView]);

  const handleSwitchView = (newView) => {
    setView(newView);
    clearError();
    setLocalError('');
    setSuccessMessage('');
    setPassword('');
    setConfirmPassword('');
    setShopName('');
    setShopLicense('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setLocalError('Please fill in all fields.');
      return;
    }
    
    setLoading(true);
    setLocalError('');
    const result = await logIn(username, password);
    setLoading(false);
    
    if (result.success) {
      // Role validation matching login toggle option
      if (loginType === 'owner' && result.user.role !== 'admin') {
        logOut();
        setLocalError('This account does not have Shop Owner permissions. Please register as an Owner.');
        return;
      }
      onAuthSuccess();
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!username || !email || !password || !confirmPassword) {
      setLocalError('All fields are required.');
      return;
    }

    if (signUpType === 'owner') {
      if (!shopName.trim()) {
        setLocalError('Please enter your rental shop name.');
        return;
      }
      if (!shopLicense.trim()) {
        setLocalError('Please enter your rental shop address.');
        return;
      }
    }

    if (password !== confirmPassword) {
      setLocalError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setLocalError('Password must be at least 6 characters long.');
      return;
    }
    
    setLoading(true);
    setLocalError('');
    const result = await signUp(
      username, 
      email, 
      password, 
      signUpType === 'owner' ? 'admin' : 'user',
      shopName,
      shopLicense
    );
    setLoading(false);
    
    if (result.success) {
      onAuthSuccess();
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!email) {
      setLocalError('Please enter your email address.');
      return;
    }
    
    setLoading(true);
    setLocalError('');
    setSuccessMessage('');
    const result = await forgotPassword(email);
    setLoading(false);
    
    if (result.success) {
      setSuccessMessage('A recovery confirmation alert has been generated and sent to your email address.');
      setEmail('');
    } else {
      setLocalError(result.error);
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '40px 20px',
      minHeight: '70vh'
    }}>
      <div className="glass-panel animate-fade-in" style={{
        width: '100%',
        maxWidth: '450px',
        padding: '36px',
        position: 'relative'
      }}>
        {/* Decorative Top Accent Line */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: '10%',
          right: '10%',
          height: '3px',
          background: 'var(--accent-gradient)',
          borderRadius: '0 0 8px 8px'
        }} />

        {/* View Titles */}
        {view === 'login' && (
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '6px' }}>Welcome Back</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Sign in to manage bookings and hire vehicles</p>
          </div>
        )}

        {view === 'signup' && (
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '6px' }}>Create Account</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Register a new customer profile in seconds</p>
          </div>
        )}

        {view === 'forgot' && (
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '6px' }}>Password Recovery</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Get a recovery link or reset credentials</p>
          </div>
        )}

        {/* Global/Local Error banner */}
        {(error || localError) && (
          <div style={{
            background: 'rgba(255, 64, 129, 0.1)',
            border: '1px solid rgba(255, 64, 129, 0.2)',
            borderRadius: '10px',
            padding: '12px 16px',
            color: '#ff4081',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '20px',
            fontSize: '0.9rem'
          }}>
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{localError || error}</span>
          </div>
        )}

        {/* Success message banner */}
        {successMessage && (
          <div style={{
            background: 'rgba(0, 229, 255, 0.1)',
            border: '1px solid rgba(0, 229, 255, 0.2)',
            borderRadius: '10px',
            padding: '12px 16px',
            color: 'var(--accent-cyan)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '20px',
            fontSize: '0.9rem'
          }}>
            <ShieldCheck size={18} style={{ flexShrink: 0 }} />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Forms */}
        {view === 'login' && (
          <form onSubmit={handleLogin}>
            {/* Split Login Toggles */}
            <div style={{
              display: 'flex',
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid var(--card-border)',
              borderRadius: '10px',
              padding: '4px',
              marginBottom: '24px'
            }}>
              <button
                type="button"
                onClick={() => { setLoginType('user'); clearError(); setLocalError(''); }}
                style={{
                  flex: 1,
                  background: loginType === 'user' ? 'var(--accent-purple)' : 'transparent',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '8px 12px',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                Customer Login
              </button>
              <button
                type="button"
                onClick={() => { setLoginType('owner'); clearError(); setLocalError(''); }}
                style={{
                  flex: 1,
                  background: loginType === 'owner' ? 'var(--accent-gradient)' : 'transparent',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '8px 12px',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                Shop Owner Login
              </button>
            </div>

            <div className="form-group">
              <label className="form-label">Username or Email</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  style={{ width: '100%', paddingLeft: '44px' }}
                />
                <Key size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="form-label">Password</label>
                <span 
                  onClick={() => handleSwitchView('forgot')}
                  style={{ color: 'var(--accent-cyan)', fontSize: '0.85rem', cursor: 'pointer', fontWeight: 500 }}
                >
                  Forgot password?
                </span>
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  type="password"
                  className="form-control"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ width: '100%', paddingLeft: '44px' }}
                />
                <Lock size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
            </div>

            <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', justifyContent: 'center', marginTop: '10px' }}>
              {loading ? 'Authenticating...' : 'Sign In'}
              {!loading && <LogIn size={18} />}
            </button>

            <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Don't have an account?{' '}
              <span 
                onClick={() => handleSwitchView('signup')}
                style={{ color: 'var(--accent-purple)', cursor: 'pointer', fontWeight: 600 }}
              >
                Sign Up
              </span>
            </div>
          </form>
        )}

        {view === 'signup' && (
          <form onSubmit={handleSignUp}>
            {/* Split Register Toggles */}
            <div style={{
              display: 'flex',
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid var(--card-border)',
              borderRadius: '10px',
              padding: '4px',
              marginBottom: '24px'
            }}>
              <button
                type="button"
                onClick={() => { setSignUpType('user'); clearError(); setLocalError(''); }}
                style={{
                  flex: 1,
                  background: signUpType === 'user' ? 'var(--accent-purple)' : 'transparent',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '8px 12px',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                Customer Sign Up
              </button>
              <button
                type="button"
                onClick={() => { setSignUpType('owner'); clearError(); setLocalError(''); }}
                style={{
                  flex: 1,
                  background: signUpType === 'owner' ? 'var(--accent-gradient)' : 'transparent',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '8px 12px',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                Shop Owner Sign Up
              </button>
            </div>

            <div className="form-group">
              <label className="form-label">Username</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  className="form-control"
                  placeholder="johndoe"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  style={{ width: '100%', paddingLeft: '44px' }}
                />
                <Key size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  className="form-control"
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ width: '100%', paddingLeft: '44px' }}
                />
                <Mail size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Min. 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ width: '100%', paddingLeft: '44px' }}
                />
                <Lock size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  style={{ width: '100%', paddingLeft: '44px' }}
                />
                <Lock size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
            </div>

            {/* Shop Owner additional data fields */}
            {signUpType === 'owner' && (
              <div className="animate-fade-in" style={{
                background: 'rgba(124, 77, 255, 0.05)',
                border: '1px dashed rgba(124, 77, 255, 0.3)',
                padding: '18px',
                borderRadius: '12px',
                marginBottom: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px'
              }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--accent-purple)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Shop Credentials
                </div>
                
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.8rem' }}>Shop Name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Pune Moto Rentals"
                    value={shopName}
                    onChange={(e) => setShopName(e.target.value)}
                    style={{ width: '100%' }}
                  />
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.8rem' }}>Shop Address</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Hinjewadi Phase 1, IT Park, Pune"
                    value={shopLicense}
                    onChange={(e) => setShopLicense(e.target.value)}
                    style={{ width: '100%' }}
                  />
                </div>
              </div>
            )}

            <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', justifyContent: 'center', marginTop: '10px' }}>
              {loading ? 'Registering...' : 'Create Account'}
              {!loading && <UserPlus size={18} />}
            </button>

            <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Already have an account?{' '}
              <span 
                onClick={() => handleSwitchView('login')}
                style={{ color: 'var(--accent-purple)', cursor: 'pointer', fontWeight: 600 }}
              >
                Log In
              </span>
            </div>
          </form>
        )}

        {view === 'forgot' && (
          <form onSubmit={handleForgotPassword}>
            <div style={{ marginBottom: '20px', fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Enter your registered email address below. We will send a confirmation code alert to reset your password.
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  className="form-control"
                  placeholder="Enter registered email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ width: '100%', paddingLeft: '44px' }}
                />
                <Mail size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
            </div>

            <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', justifyContent: 'center', marginTop: '10px' }}>
              {loading ? 'Sending Request...' : 'Recover Password'}
            </button>

            <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.9rem' }}>
              <span 
                onClick={() => handleSwitchView('login')}
                style={{ color: 'var(--accent-cyan)', cursor: 'pointer', fontWeight: 600 }}
              >
                Back to Sign In
              </span>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AuthPortal;
