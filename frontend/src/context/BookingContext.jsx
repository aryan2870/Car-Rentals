import React, { createContext, useState, useEffect, useContext } from 'react';
import { sendBookingConfirmationEmail } from '../config/emailjs';

const BookingContext = createContext();

const API_BASE_URL = 'http://localhost:5000/api';

export const BookingProvider = ({ children }) => {
  const [cars, setCars] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Active user's booking workflow state
  const [bookingDetails, setBookingDetails] = useState({
    vehicleType: 'car', // 'car' | 'bike'
    pickupLocation: '',
    dropLocation: '',
    pickupDate: '',
    pickupTime: '10:00',
    dropDate: '',
    dropTime: '10:00',
    selectedCar: null,
    passengerInfo: {
      name: '',
      surname: '',
      contact: '',
      email: ''
    }
  });

  // Fetch cars catalog on mount
  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/cars`);
      const data = await response.json();
      setCars(data);
    } catch (err) {
      console.error('Error fetching cars:', err);
      setError('Could not load car catalogs. Ensure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const fetchBookings = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/bookings`);
      const data = await response.json();
      setBookings(data);
    } catch (err) {
      console.error('Error fetching bookings:', err);
    }
  };

  const updateBookingDetails = (fields) => {
    setBookingDetails(prev => ({
      ...prev,
      ...fields
    }));
  };

  const calculateDuration = () => {
    const { pickupDate, dropDate } = bookingDetails;
    if (!pickupDate || !dropDate) return 1;
    
    const start = new Date(pickupDate);
    const end = new Date(dropDate);
    const diffTime = end - start;
    
    if (diffTime < 0) return 1; // End date is before start date, default to 1 day
    
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays === 0 ? 1 : diffDays;
  };

  const calculatePrice = (pricePerDay) => {
    const days = calculateDuration();
    return days * pricePerDay;
  };

  // Submit Booking
  const createBooking = async (passengerDetails, userId = 'guest') => {
    setLoading(true);
    setError(null);
    try {
      const days = calculateDuration();
      const totalPrice = days * (bookingDetails.selectedCar ? bookingDetails.selectedCar.pricePerDay : 0);

      const bookingPayload = {
        userId,
        pickupLocation: bookingDetails.pickupLocation,
        dropLocation: bookingDetails.dropLocation,
        pickupDate: bookingDetails.pickupDate,
        pickupTime: bookingDetails.pickupTime,
        dropDate: bookingDetails.dropDate || bookingDetails.pickupDate,
        dropTime: bookingDetails.dropTime || bookingDetails.pickupTime,
        carId: bookingDetails.selectedCar.id,
        carName: bookingDetails.selectedCar.name,
        totalPrice,
        passengerInfo: passengerDetails
      };

      const response = await fetch(`${API_BASE_URL}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingPayload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit booking');
      }

      // Update bookings list
      setBookings(prev => [...prev, data.booking]);

      // Trigger Email sending via EmailJS
      const emailResult = await sendBookingConfirmationEmail(data.booking);

      return { 
        success: true, 
        booking: data.booking,
        emailMode: emailResult.mode
      };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Admin/Driver Dashboard: Update Status/Driver
  const updateBookingStatus = async (bookingId, status, driverName) => {
    try {
      const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, driverName })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update booking status');
      }

      // Update local state bookings list
      setBookings(prev => 
        prev.map(b => b.id === bookingId ? data.booking : b)
      );

      return { success: true, booking: data.booking };
    } catch (err) {
      console.error('Error updating booking status:', err);
      return { success: false, error: err.message };
    }
  };

  const resetBookingFlow = () => {
    setBookingDetails({
      vehicleType: 'car',
      pickupLocation: '',
      dropLocation: '',
      pickupDate: '',
      pickupTime: '10:00',
      dropDate: '',
      dropTime: '10:00',
      selectedCar: null,
      passengerInfo: {
        name: '',
        surname: '',
        contact: '',
        email: ''
      }
    });
  };

  return (
    <BookingContext.Provider
      value={{
        cars,
        bookings,
        bookingDetails,
        loading,
        error,
        updateBookingDetails,
        fetchBookings,
        calculateDuration,
        calculatePrice,
        createBooking,
        updateBookingStatus,
        resetBookingFlow
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => useContext(BookingContext);
