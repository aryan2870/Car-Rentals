const bcrypt = require('bcryptjs');

async function registerUser({ username, email, password, UserModel, storage = [] }) {
  const existingUser = await UserModel.findOne({ email });
  if (existingUser) {
    return { status: 400, payload: { message: 'Email is already registered' } };
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const doc = { username, email, password: hashedPassword };

  if (typeof UserModel.create === 'function') {
    await UserModel.create(doc);
  } else {
    storage.push(doc);
  }

  return { status: 201, payload: { message: 'User registered successfully' } };
}

async function authenticateUser({ email, password, UserModel }) {
  const user = await UserModel.findOne({ email });
  if (!user) {
    return { status: 401, payload: { message: 'Invalid email or password' } };
  }

  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    return { status: 401, payload: { message: 'Invalid email or password' } };
  }

  return {
    status: 200,
    payload: {
      message: 'Login successful',
      user: {
        username: user.username,
        email: user.email,
      },
    },
  };
}

module.exports = { registerUser, authenticateUser };
