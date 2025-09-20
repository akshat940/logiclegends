const User = require('./auth.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config');

async function registerUser({ email, password }) {
  const existing = await User.findOne({ email });
  if (existing) throw new Error('Email already registered');

  const passwordHash = await bcrypt.hash(password, 10);
  const user = new User({ email, passwordHash, roles: ['athlete'] });
  await user.save();
  return user;
}

async function loginUser({ email, password }) {
  const user = await User.findOne({ email });
  if (!user) throw new Error('Invalid credentials');

  const valid = await user.validatePassword(password);
  if (!valid) throw new Error('Invalid credentials');

  return user;
}

function generateJWT(user) {
  const payload = {
    id: user._id,
    roles: user.roles,
  };
  return jwt.sign(payload, config.JWT_SECRET, { expiresIn: '1d' });
}

module.exports = {
  registerUser,
  loginUser,
  generateJWT,
};
