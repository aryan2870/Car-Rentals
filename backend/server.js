// Trigger re-seed on cars data update
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();
const bcrypt = require('bcryptjs');

// Import Models
const User = require('./models/User');
const Car = require('./models/Car');
const Booking = require('./models/Booking');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB Atlas
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB Atlas successfully');
    seedCarsFleet();
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });

// Seed Cars catalog from JSON - clears and updates the database to reflect cars + bikes catalog
const seedCarsFleet = async () => {
  try {
    console.log('Refreshing vehicles fleet collection in MongoDB...');
    await Car.deleteMany({});
    const carsJsonPath = path.join(__dirname, 'data', 'cars.json');
    if (fs.existsSync(carsJsonPath)) {
      const carsData = JSON.parse(fs.readFileSync(carsJsonPath, 'utf8'));
      await Car.insertMany(carsData);
      console.log(`Database seeded with ${carsData.length} vehicles (cars & bikes) successfully!`);
    } else {
      console.warn('cars.json file not found, skipping seeding.');
    }
  } catch (error) {
    console.error('Error seeding vehicle collection:', error);
  }
};


// --- AUTHENTICATION ROUTES ---

// 1. Register User
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password, role, shopName, shopLicense } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Username, email, and password are required' });
    }

    // Check if username already exists
    const userExists = await User.findOne({ username: { $regex: new RegExp(`^${username}$`, 'i') } });
    if (userExists) {
      return res.status(400).json({ error: 'Username is already taken' });
    }

    // Check if email already exists
    const emailExists = await User.findOne({ email: { $regex: new RegExp(`^${email}$`, 'i') } });
    if (emailExists) {
      return res.status(400).json({ error: 'Email is already registered' });
    }

    // Auto-assign admin role if username includes driver/admin keywords or if explicitly requested in body
    let finalRole = req.body.role || 'user';
    if (username.toLowerCase().includes('admin') || username.toLowerCase().includes('driver')) {
      finalRole = 'admin';
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role: finalRole,
      shopName: finalRole === 'admin' ? (shopName || '') : '',
      shopLicense: finalRole === 'admin' ? (shopLicense || '') : ''
    });

    await newUser.save();

    // Exclude password from response
    const userResponse = {
      id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      role: newUser.role,
      shopName: newUser.shopName,
      shopLicense: newUser.shopLicense
    };

    res.status(201).json({ message: 'User registered successfully', user: userResponse });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ error: 'Internal Server Error during registration' });
  }
});

// 2. Login User
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    // Query user by username or email
    const user = await User.findOne({
      $or: [
        { username: { $regex: new RegExp(`^${username}$`, 'i') } },
        { email: { $regex: new RegExp(`^${username}$`, 'i') } }
      ]
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid username/email or password' });
    }

    let isMatch = false;
    try {
      isMatch = await bcrypt.compare(password, user.password);
    } catch (e) {
      isMatch = false;
    }
    // Fallback support for pre-existing plain text credentials to avoid breaking active accounts
    if (!isMatch && user.password === password) {
      isMatch = true;
    }

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid username/email or password' });
    }

    const userResponse = {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role
    };

    res.status(200).json({ message: 'Login successful', user: userResponse });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Internal Server Error during login' });
  }
});

// 3. Forgot Password Request
app.post('/api/auth/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email address is required' });
    }

    const user = await User.findOne({ email: { $regex: new RegExp(`^${email}$`, 'i') } });

    if (!user) {
      return res.status(404).json({ error: 'No user registered with this email address' });
    }

    // Generate a reset code and a temporary password
    const resetCode = `RST-${Math.floor(100000 + Math.random() * 900000)}`;
    const tempPassword = Math.random().toString(36).substring(2, 10);

    const hashedPassword = await bcrypt.hash(tempPassword, 10);
    user.password = hashedPassword;
    await user.save();

    console.log(`[MONGO PASSWORD RESET] Reset code for ${email}: ${resetCode}`);

    res.status(200).json({
      message: 'Reset instructions generated successfully.',
      resetCode,
      email: user.email,
      username: user.username,
      tempPassword: tempPassword
    });
  } catch (error) {
    console.error('Error during forgot password request:', error);
    res.status(500).json({ error: 'Internal Server Error during reset request' });
  }
});


// --- CAR CATALOG ROUTES ---

// Get all cars
app.get('/api/cars', async (req, res) => {
  try {
    const cars = await Car.find();
    res.json(cars);
  } catch (error) {
    console.error('Error fetching cars:', error);
    res.status(500).json({ error: 'Internal Server Error fetching cars' });
  }
});


// --- BOOKING ROUTES ---

// Get all bookings
app.get('/api/bookings', async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ error: 'Internal Server Error fetching bookings' });
  }
});

// Create new booking
app.post('/api/bookings', async (req, res) => {
  try {
    const {
      userId,
      pickupLocation,
      dropLocation,
      pickupDate,
      pickupTime,
      dropDate,
      dropTime,
      carId,
      carName,
      totalPrice,
      passengerInfo
    } = req.body;

    if (!pickupLocation || !dropLocation || !pickupDate || !pickupTime || !carId || !passengerInfo) {
      return res.status(400).json({ error: 'Missing required booking parameters' });
    }

    const bookingId = `BK-${Math.floor(1000 + Math.random() * 9000)}`;

    const newBooking = new Booking({
      id: bookingId,
      userId: userId || 'guest',
      pickupLocation,
      dropLocation,
      pickupDate,
      pickupTime,
      dropDate: dropDate || pickupDate,
      dropTime: dropTime || pickupTime,
      carId,
      carName,
      totalPrice,
      passengerInfo,
      status: 'Pending',
      driverName: (carName.toLowerCase().includes('activa') || 
                   carName.toLowerCase().includes('classic') || 
                   carName.toLowerCase().includes('r15') || 
                   carName.toLowerCase().includes('bike') || 
                   carName.toLowerCase().includes('scooty')) 
                   ? 'Self-Ride (No Driver)' 
                   : 'Not Assigned'
    });

    await newBooking.save();

    res.status(201).json({ message: 'Booking created successfully', booking: newBooking });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ error: 'Internal Server Error creating booking' });
  }
});

// Update booking status or assign driver (Admin/Driver dashboard route)
app.patch('/api/bookings/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, driverName } = req.body;

    const updateFields = {};
    if (status) updateFields.status = status;
    if (driverName) updateFields.driverName = driverName;

    const updatedBooking = await Booking.findOneAndUpdate(
      { id: id },
      { $set: updateFields },
      { new: true } // Returns the modified document rather than original
    );

    if (!updatedBooking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.status(200).json({ message: 'Booking updated successfully', booking: updatedBooking });
  } catch (error) {
    console.error('Error updating booking:', error);
    res.status(500).json({ error: 'Internal Server Error updating booking' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Car Rentals API Server with MongoDB is running on port ${PORT}`);
});
