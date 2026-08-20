const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  userId: {
    type: String,
    default: 'guest'
  },
  pickupLocation: {
    type: String,
    required: true
  },
  dropLocation: {
    type: String,
    required: true
  },
  pickupDate: {
    type: String,
    required: true
  },
  pickupTime: {
    type: String,
    required: true
  },
  dropDate: {
    type: String,
    required: true
  },
  dropTime: {
    type: String,
    required: true
  },
  carId: {
    type: String,
    required: true
  },
  carName: {
    type: String,
    required: true
  },
  totalPrice: {
    type: Number,
    required: true
  },
  passengerInfo: {
    name: { type: String, required: true },
    surname: { type: String, required: true },
    contact: { type: String, required: true },
    email: { type: String, required: true }
  },
  status: {
    type: String,
    default: 'Pending'
  },
  driverName: {
    type: String,
    default: 'Not Assigned'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Booking', BookingSchema);
