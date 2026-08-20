import React, { useEffect, useState } from 'react';
import { useBooking } from '../context/BookingContext';
import { useAuth } from '../context/AuthContext';
import { IndianRupee, ShieldAlert, Car, Calendar, ClipboardList, RefreshCw, Check, UserCheck, Search, Filter } from 'lucide-react';

const AdminDashboard = () => {
  const { bookings, fetchBookings, updateBookingStatus } = useBooking();
  const { user } = useAuth();
  
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [refreshing, setRefreshing] = useState(false);
  const [editingDriverId, setEditingDriverId] = useState(null);
  const [tempDriverName, setTempDriverName] = useState('');

  const loadData = async () => {
    setRefreshing(true);
    await fetchBookings();
    setRefreshing(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStatusChange = async (id, nextStatus) => {
    await updateBookingStatus(id, nextStatus, null);
  };

  const handleStartEditDriver = (booking) => {
    setEditingDriverId(booking.id);
    setTempDriverName(booking.driverName === 'Not Assigned' ? '' : booking.driverName);
  };

  const handleSaveDriver = async (id) => {
    const driverVal = tempDriverName.trim() || 'Not Assigned';
    await updateBookingStatus(id, null, driverVal);
    setEditingDriverId(null);
  };

  const handleAssignSelf = async (id) => {
    const selfName = user ? `${user.username} (Self)` : 'Admin Driver';
    await updateBookingStatus(id, null, selfName);
    setEditingDriverId(null);
  };

  // Calculations
  const totalRevenue = bookings
    .filter(b => b.status !== 'Cancelled')
    .reduce((sum, b) => sum + b.totalPrice, 0);

  const pendingCount = bookings.filter(b => b.status === 'Pending').length;
  const activeCount = bookings.filter(b => b.status === 'Confirmed' || b.status === 'In Progress').length;
  const completedCount = bookings.filter(b => b.status === 'Completed').length;

  // Filter & Search logic
  const filteredBookings = bookings.filter(b => {
    const passengerName = `${b.passengerInfo.name} ${b.passengerInfo.surname}`.toLowerCase();
    const carName = b.carName.toLowerCase();
    const id = b.id.toLowerCase();
    const matchesSearch = passengerName.includes(search.toLowerCase()) || 
                          carName.includes(search.toLowerCase()) || 
                          id.includes(search.toLowerCase());
                          
    const matchesFilter = statusFilter === 'All' || b.status === statusFilter;
    
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return { bg: 'rgba(236, 201, 75, 0.1)', border: '1px solid rgba(236, 201, 75, 0.3)', text: '#ecc94b' };
      case 'Confirmed': return { bg: 'rgba(66, 153, 225, 0.1)', border: '1px solid rgba(66, 153, 225, 0.3)', text: '#4299e1' };
      case 'In Progress': return { bg: 'rgba(159, 122, 234, 0.1)', border: '1px solid rgba(159, 122, 234, 0.3)', text: '#9f7aea' };
      case 'Completed': return { bg: 'rgba(72, 187, 120, 0.1)', border: '1px solid rgba(72, 187, 120, 0.3)', text: '#48bb78' };
      case 'Cancelled': return { bg: 'rgba(245, 101, 101, 0.1)', border: '1px solid rgba(245, 101, 101, 0.3)', text: '#f56565' };
      default: return { bg: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', text: '#fff' };
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }} className="animate-fade-in">
      
      {/* Top Header Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Admin & Driver Dispatch Control</h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
            Manage client bookings, assign yourself or other drivers, and log status transitions
          </p>
        </div>
        <button
          onClick={loadData}
          disabled={refreshing}
          className="btn-secondary"
          style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', padding: '10px 18px' }}
        >
          <RefreshCw size={16} className={refreshing ? 'spin-animation' : ''} />
          {refreshing ? 'Refreshing...' : 'Refresh Board'}
        </button>
      </div>

      {/* Analytics widgets */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '20px',
        marginBottom: '40px'
      }}>
        {/* Earnings */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ background: 'rgba(0, 229, 255, 0.1)', padding: '14px', borderRadius: '12px' }}>
            <IndianRupee size={24} color="var(--accent-cyan)" />
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Earnings</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '4px' }}>
              ₹{totalRevenue}
            </div>
          </div>
        </div>

        {/* Pending Requests */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ background: 'rgba(236, 201, 75, 0.1)', padding: '14px', borderRadius: '12px' }}>
            <ClipboardList size={24} color="#ecc94b" />
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Pending Requests</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '4px' }}>
              {pendingCount}
            </div>
          </div>
        </div>

        {/* Active Rides */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ background: 'rgba(159, 122, 234, 0.1)', padding: '14px', borderRadius: '12px' }}>
            <Car size={24} color="#9f7aea" />
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Active / Confirmed</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '4px' }}>
              {activeCount}
            </div>
          </div>
        </div>

        {/* Completed Trips */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ background: 'rgba(72, 187, 120, 0.1)', padding: '14px', borderRadius: '12px' }}>
            <Check size={24} color="#48bb78" />
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Completed Trips</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '4px' }}>
              {completedCount}
            </div>
          </div>
        </div>
      </div>

      {/* Filters and search panel */}
      <div className="glass-panel" style={{
        padding: '16px 24px',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '20px',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '24px'
      }}>
        {/* Search */}
        <div style={{ position: 'relative', minWidth: '280px', flexGrow: 1 }}>
          <input
            type="text"
            className="form-control"
            placeholder="Search by Booking ID, passenger name, car model..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: '100%', paddingLeft: '44px', paddingTop: '10px', paddingBottom: '10px', fontSize: '0.9rem' }}
          />
          <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
        </div>

        {/* Status filters */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            <Filter size={15} />
            <span>Filter Status:</span>
          </div>
          <select
            className="form-control"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              padding: '6px 12px',
              fontSize: '0.85rem',
              borderRadius: '8px',
              background: 'var(--bg-secondary)',
              cursor: 'pointer'
            }}
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Bookings Table list */}
      <div className="glass-panel" style={{ overflowX: 'auto', borderRadius: '16px' }}>
        {filteredBookings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-secondary)' }}>
            <ClipboardList size={40} color="var(--text-muted)" style={{ marginBottom: '12px' }} />
            <h4 style={{ fontWeight: 600 }}>No Bookings Listed</h4>
            <p style={{ fontSize: '0.85rem', marginTop: '4px' }}>There are no bookings matching the search criteria.</p>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '950px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--card-border)', background: 'rgba(255,255,255,0.01)' }}>
                <th style={{ padding: '16px 20px', fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>ID</th>
                <th style={{ padding: '16px 20px', fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Passenger</th>
                <th style={{ padding: '16px 20px', fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Car</th>
                <th style={{ padding: '16px 20px', fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Schedule Details</th>
                <th style={{ padding: '16px 20px', fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Price</th>
                <th style={{ padding: '16px 20px', fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Driver Assigned</th>
                <th style={{ padding: '16px 20px', fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Status</th>
                <th style={{ padding: '16px 20px', fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((booking) => {
                const colors = getStatusColor(booking.status);
                return (
                  <tr key={booking.id} style={{ borderBottom: '1px solid var(--card-border)', transition: 'all 0.2s' }} className="table-row-hover">
                    {/* ID */}
                    <td style={{ padding: '18px 20px', fontWeight: 'bold', color: 'var(--accent-cyan)', fontSize: '0.9rem' }}>
                      {booking.id}
                    </td>

                    {/* Passenger */}
                    <td style={{ padding: '18px 20px' }}>
                      <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>
                        {booking.passengerInfo.name} {booking.passengerInfo.surname}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                        {booking.passengerInfo.email}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {booking.passengerInfo.contact}
                      </div>
                    </td>

                    {/* Car */}
                    <td style={{ padding: '18px 20px', fontSize: '0.9rem', fontWeight: 500 }}>
                      {booking.carName}
                    </td>

                    {/* Schedule */}
                    <td style={{ padding: '18px 20px', fontSize: '0.85rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>From:</span>
                        <span>{booking.pickupLocation}</span>
                      </div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '2px' }}>
                        {booking.pickupDate} @ {booking.pickupTime}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>To:</span>
                        <span>{booking.dropLocation}</span>
                      </div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '2px' }}>
                        {booking.dropDate} @ {booking.dropTime}
                      </div>
                    </td>

                    {/* Price */}
                    <td style={{ padding: '18px 20px', fontWeight: 'bold', color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                      ₹{booking.totalPrice}
                    </td>

                    {/* Driver */}
                    <td style={{ padding: '18px 20px' }}>
                      {editingDriverId === booking.id ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <input
                            type="text"
                            value={tempDriverName}
                            placeholder="Enter Driver Name"
                            className="form-control"
                            onChange={(e) => setTempDriverName(e.target.value)}
                            style={{ padding: '6px 10px', fontSize: '0.8rem', width: '130px' }}
                          />
                          <div style={{ display: 'flex', gap: '4px' }}>
                            <button
                              onClick={() => handleSaveDriver(booking.id)}
                              style={{ background: 'var(--accent-purple)', border: 'none', color: '#fff', fontSize: '0.7rem', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}
                            >
                              Save
                            </button>
                            <button
                              onClick={() => handleAssignSelf(booking.id)}
                              style={{ background: 'var(--accent-cyan)', border: 'none', color: '#000', fontSize: '0.7rem', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                            >
                              Self
                            </button>
                            <button
                              onClick={() => setEditingDriverId(null)}
                              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--card-border)', color: 'var(--text-primary)', fontSize: '0.7rem', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}
                            >
                              x
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}>
                          <span style={{ color: booking.driverName === 'Not Assigned' ? 'var(--text-muted)' : 'var(--text-primary)' }}>
                            {booking.driverName}
                          </span>
                          <button
                            onClick={() => handleStartEditDriver(booking)}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: 'var(--accent-cyan)',
                              fontSize: '0.75rem',
                              cursor: 'pointer',
                              textDecoration: 'underline',
                              padding: 0
                            }}
                          >
                            Assign
                          </button>
                        </div>
                      )}
                    </td>

                    {/* Status Tag */}
                    <td style={{ padding: '18px 20px' }}>
                      <span style={{
                        display: 'inline-block',
                        padding: '4px 10px',
                        borderRadius: '20px',
                        fontSize: '0.75rem',
                        fontWeight: 'bold',
                        textAlign: 'center',
                        textTransform: 'uppercase',
                        backgroundColor: colors.bg,
                        border: colors.border,
                        color: colors.text
                      }}>
                        {booking.status}
                      </span>
                    </td>

                    {/* Actions dropdown/buttons */}
                    <td style={{ padding: '18px 20px', textAlign: 'right' }}>
                      {booking.status !== 'Completed' && booking.status !== 'Cancelled' ? (
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px' }}>
                          {booking.status === 'Pending' && (
                            <button
                              onClick={() => handleStatusChange(booking.id, 'Confirmed')}
                              style={{
                                background: 'rgba(66, 153, 225, 0.1)',
                                border: '1px solid rgba(66, 153, 225, 0.3)',
                                color: '#4299e1',
                                fontSize: '0.75rem',
                                padding: '6px 10px',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                              }}
                              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(66, 153, 225, 0.2)'}
                              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(66, 153, 225, 0.1)'}
                            >
                              Confirm
                            </button>
                          )}
                          {booking.status === 'Confirmed' && (
                            <button
                              onClick={() => handleStatusChange(booking.id, 'In Progress')}
                              style={{
                                background: 'rgba(159, 122, 234, 0.1)',
                                border: '1px solid rgba(159, 122, 234, 0.3)',
                                color: '#9f7aea',
                                fontSize: '0.75rem',
                                padding: '6px 10px',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                              }}
                              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(159, 122, 234, 0.2)'}
                              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(159, 122, 234, 0.1)'}
                            >
                              Start Trip
                            </button>
                          )}
                          {booking.status === 'In Progress' && (
                            <button
                              onClick={() => handleStatusChange(booking.id, 'Completed')}
                              style={{
                                background: 'rgba(72, 187, 120, 0.1)',
                                border: '1px solid rgba(72, 187, 120, 0.3)',
                                color: '#48bb78',
                                fontSize: '0.75rem',
                                padding: '6px 10px',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                              }}
                              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(72, 187, 120, 0.2)'}
                              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(72, 187, 120, 0.1)'}
                            >
                              Complete
                            </button>
                          )}
                          
                          <button
                            onClick={() => handleStatusChange(booking.id, 'Cancelled')}
                            style={{
                              background: 'rgba(245, 101, 101, 0.1)',
                              border: '1px solid rgba(245, 101, 101, 0.2)',
                              color: '#f56565',
                              fontSize: '0.75rem',
                              padding: '6px 10px',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(245, 101, 101, 0.2)'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(245, 101, 101, 0.1)'}
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>No actions</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
      
      {/* Custom Styles for hovering on rows */}
      <style>{`
        .table-row-hover:hover {
          background-color: rgba(255, 255, 255, 0.02);
        }
        .spin-animation {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
