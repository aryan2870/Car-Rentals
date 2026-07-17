const express = require('express');
const router = express.Router();
const User = require('../../models/User');
const { registerUser, authenticateUser } = require('../../authService');

const handleUserRegistration = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Please provide username, email, and password' });
    }

    const result = await registerUser({ username, email, password, UserModel: User });
    return res.status(result.status).json(result.payload);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Registration failed. Please try again.', error: error.message });
  }
};

const handleUserLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const result = await authenticateUser({ email, password, UserModel: User });
    return res.status(result.status).json(result.payload);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Login failed. Please try again.', error: error.message });
  }
};

router.post('/', handleUserRegistration);
router.post('/register', handleUserRegistration);
router.post('/login', handleUserLogin);

module.exports = router;