import emailjs from '@emailjs/browser';

// EmailJS keys config
// Fill in your specific EmailJS credentials here to run real email sending
export const EMAILJS_CONFIG = {
  SERVICE_ID: '', // E.g., 'service_xxxxxx'
  TEMPLATE_ID_BOOKING: '', // E.g., 'template_booking'
  TEMPLATE_ID_RESET: '', // E.g., 'template_reset'
  PUBLIC_KEY: '' // E.g., 'user_xxxxxxxxx'
};

// Check if credentials are fully configured
const isConfigured = () => {
  return (
    EMAILJS_CONFIG.SERVICE_ID &&
    (EMAILJS_CONFIG.TEMPLATE_ID_BOOKING || EMAILJS_CONFIG.TEMPLATE_ID_RESET) &&
    EMAILJS_CONFIG.PUBLIC_KEY
  );
};

// Custom event to dispatch email visual mockups to the UI
export const triggerMockEmailModal = (emailData) => {
  const event = new CustomEvent('show-mock-email', { detail: emailData });
  window.dispatchEvent(event);
};

/**
 * Sends a booking confirmation email
 * @param {Object} booking 
 * @returns {Promise}
 */
export const sendBookingConfirmationEmail = async (booking) => {
  const templateParams = {
    to_name: `${booking.passengerInfo.name} ${booking.passengerInfo.surname}`,
    to_email: booking.passengerInfo.email,
    booking_id: booking.id,
    pickup_location: booking.pickupLocation,
    drop_location: booking.dropLocation,
    pickup_date: booking.pickupDate,
    pickup_time: booking.pickupTime,
    drop_date: booking.dropDate,
    drop_time: booking.dropTime,
    car_name: booking.carName,
    total_price: `$${booking.totalPrice}`,
    contact_phone: booking.passengerInfo.contact
  };

  console.log('[EmailJS] Attempting to send booking email...', templateParams);

  if (isConfigured()) {
    try {
      const response = await emailjs.send(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.TEMPLATE_ID_BOOKING,
        templateParams,
        EMAILJS_CONFIG.PUBLIC_KEY
      );
      console.log('[EmailJS] Booking confirmation email sent successfully:', response.status, response.text);
      return { success: true, mode: 'real', response };
    } catch (error) {
      console.error('[EmailJS] Failed to send real email, falling back to mock UI:', error);
      triggerMockEmailModal({ type: 'booking', params: templateParams });
      return { success: true, mode: 'fallback_error', error };
    }
  } else {
    // Visual Mockup Trigger
    console.warn('[EmailJS] Keys not configured. Displaying simulated email window...');
    triggerMockEmailModal({ type: 'booking', params: templateParams });
    return { success: true, mode: 'mock' };
  }
};

/**
 * Sends a password reset verification email
 * @param {String} email 
 * @param {String} username 
 * @param {String} resetCode 
 * @param {String} tempPassword 
 * @returns {Promise}
 */
export const sendForgotPasswordEmail = async (email, username, resetCode, tempPassword) => {
  const templateParams = {
    to_email: email,
    username: username,
    reset_code: resetCode,
    temp_password: tempPassword,
    reset_link: `${window.location.origin}/reset-password?code=${resetCode}`
  };

  console.log('[EmailJS] Attempting to send password reset email...', templateParams);

  if (isConfigured()) {
    try {
      const response = await emailjs.send(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.TEMPLATE_ID_RESET,
        templateParams,
        EMAILJS_CONFIG.PUBLIC_KEY
      );
      console.log('[EmailJS] Reset email sent successfully:', response.status, response.text);
      return { success: true, mode: 'real', response };
    } catch (error) {
      console.error('[EmailJS] Failed to send real reset email, falling back to mock UI:', error);
      triggerMockEmailModal({ type: 'reset', params: templateParams });
      return { success: true, mode: 'fallback_error', error };
    }
  } else {
    // Visual Mockup Trigger
    console.warn('[EmailJS] Keys not configured. Displaying simulated reset email...');
    triggerMockEmailModal({ type: 'reset', params: templateParams });
    return { success: true, mode: 'mock' };
  }
};
