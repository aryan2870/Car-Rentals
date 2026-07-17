const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  carType: { type: String, required: true },
  pickUp: { type: String, required: true },
  dropOff: { type: String, required: true },
  pickTime: { type: String, required: true },
  dropTime: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phone: { type: String, required: true },
  age: { type: Number, required: true },
  email: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  zipcode: { type: String, required: true },
});

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;