const test = require('node:test');
const assert = require('node:assert/strict');
const bcrypt = require('bcryptjs');
const { registerUser, authenticateUser } = require('./authService');

test('registerUser creates a hashed user record', async () => {
  const users = [];
  const fakeUserModel = {
    findOne: async () => null,
    create: async (doc) => {
      users.push(doc);
      return doc;
    },
  };

  const result = await registerUser({
    username: 'Alice',
    email: 'alice@example.com',
    password: 'secret123',
    UserModel: fakeUserModel,
    storage: users,
  });

  assert.equal(result.status, 201);
  assert.equal(users.length, 1);
  assert.notEqual(users[0].password, 'secret123');
});

test('authenticateUser succeeds for valid credentials', async () => {
  const passwordHash = await bcrypt.hash('secret123', 10);
  const fakeUserModel = {
    findOne: async () => ({
      username: 'Bob',
      email: 'bob@example.com',
      password: passwordHash,
    }),
  };

  const result = await authenticateUser({
    email: 'bob@example.com',
    password: 'secret123',
    UserModel: fakeUserModel,
  });

  assert.equal(result.status, 200);
  assert.equal(result.payload.user.email, 'bob@example.com');
});
