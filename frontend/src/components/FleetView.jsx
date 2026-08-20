import React, { useState } from 'react';
import { useBooking } from '../context/BookingContext';
import { Users, Briefcase, Settings, CheckCircle2, Car, Bike, Search } from 'lucide-react';

const FleetView = ({ onBookNow }) => {
  const { cars, loading, error } = useBooking();
  const [filterType, setFilterType] = useState('all'); // 'all' | 'car' | 'bike'
  const [searchQuery, setSearchQuery] = useState('');

  const filteredVehicles = cars.filter(vehicle => {
    const matchesFilter = filterType === 'all' || vehicle.vehicleType === filterType;
    const matchesSearch = vehicle.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          vehicle.type.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="animate-fade-in" style={{ maxWidth: '1200px', margin: '0 auto', padding: '10px 0' }}>
      {/* Header section */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '12px' }}>
          Explore Our <span style={{ background: 'var(--accent-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Elite Fleet</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
          From high-performance luxury sportscars to agile city scooties, find the perfect ride for your next journey.
        </p>
      </div>

      {/* Filter and Search controls */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '20px',
        marginBottom: '32px',
        background: 'rgba(255,255,255,0.01)',
        padding: '16px 20px',
        borderRadius: '16px',
        border: '1px solid var(--card-border)'
      }}>
        {/* Category Toggles */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {['all', 'car', 'bike'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              style={{
                background: filterType === type ? 'var(--accent-gradient)' : 'rgba(255,255,255,0.03)',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                padding: '10px 20px',
                fontWeight: 600,
                fontSize: '0.9rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'var(--transition)'
              }}
            >
              {type === 'car' && <Car size={16} />}
              {type === 'bike' && <Bike size={16} />}
              <span style={{ textTransform: 'capitalize' }}>
                {type === 'all' ? 'All Fleet' : type === 'car' ? 'Cars' : 'Bikes / Scooties'}
              </span>
            </button>
          ))}
        </div>

        {/* Search input */}
        <div style={{ position: 'relative', width: '100%', maxWidth: '300px' }}>
          <input
            type="text"
            className="form-control"
            placeholder="Search vehicle model..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '100%', paddingLeft: '44px', paddingRight: '16px', height: '42px' }}
          />
          <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', fontSize: '1.2rem', color: 'var(--accent-cyan)' }}>
          Loading our vehicles fleet catalog...
        </div>
      ) : error ? (
        <div style={{
          background: 'rgba(255, 64, 129, 0.1)',
          border: '1px solid rgba(255, 64, 129, 0.2)',
          padding: '20px',
          color: '#ff4081',
          borderRadius: '12px',
          textAlign: 'center',
          fontSize: '1rem',
          maxWidth: '650px',
          margin: '0 auto'
        }}>
          {error}
        </div>
      ) : filteredVehicles.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-secondary)' }}>
          No vehicles match your filters or search query.
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '30px'
        }}>
          {filteredVehicles.map((vehicle) => (
            <div
              key={vehicle.id}
              className="glass-panel-interactive"
              style={{
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                borderRadius: '16px',
                position: 'relative'
              }}
            >
              {/* Vehicle Image */}
              <div style={{ position: 'relative', height: '200px', overflow: 'hidden' }}>
                <img
                  src={vehicle.image}
                  alt={vehicle.name}
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
                  background: vehicle.vehicleType === 'car' ? 'var(--accent-purple)' : 'var(--accent-cyan)',
                  color: vehicle.vehicleType === 'car' ? '#fff' : '#000',
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                  padding: '4px 10px',
                  borderRadius: '20px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  {vehicle.type}
                </span>
                
                {/* Price Tag badge overlay */}
                <div style={{
                  position: 'absolute',
                  bottom: '12px',
                  right: '12px',
                  background: 'rgba(10, 12, 22, 0.85)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid var(--card-border)',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: '1rem',
                  color: 'var(--accent-cyan)'
                }}>
                  ₹{vehicle.pricePerDay} <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500 }}>/day</span>
                </div>
              </div>

              {/* Specs & Info Body */}
              <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '12px' }}>{vehicle.name}</h3>

                {/* Tech specifications */}
                <div style={{
                  display: 'flex',
                  gap: '14px',
                  fontSize: '0.85rem',
                  color: 'var(--text-secondary)',
                  marginBottom: '20px',
                  borderBottom: '1px solid var(--card-border)',
                  paddingBottom: '14px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Users size={15} color="var(--accent-cyan)" />
                    <span>{vehicle.seats} Seats</span>
                  </div>
                  {vehicle.vehicleType === 'car' && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Briefcase size={15} color="var(--accent-cyan)" />
                      <span>{vehicle.luggage} Bags</span>
                    </div>
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Settings size={15} color="var(--accent-cyan)" />
                    <span>{vehicle.transmission}</span>
                  </div>
                </div>

                {/* Features checklist */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px', flexGrow: 1 }}>
                  {vehicle.features.slice(0, 3).map((feature, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      <CheckCircle2 size={13} color="var(--accent-purple)" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Book this vehicle type trigger button */}
                <button
                  className="btn-primary"
                  onClick={() => onBookNow(vehicle.vehicleType)}
                  style={{
                    width: '100%',
                    justifyContent: 'center',
                    padding: '12px',
                    borderRadius: '10px',
                    fontSize: '0.95rem'
                  }}
                >
                  Book This Type
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FleetView;
