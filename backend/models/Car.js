const mongoose = require('mongoose');

const CarSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  vehicleType: {
    type: String,
    enum: ['car', 'bike'],
    default: 'car'
  },
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  pricePerDay: {
    type: Number,
    required: true
  },
  seats: {
    type: Number,
    required: true
  },
  luggage: {
    type: Number,
    required: true
  },
  transmission: {
    type: String,
    required: true
  },
  features: {
    type: [String],
    default: []
  },
  image: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Car', CarSchema);
