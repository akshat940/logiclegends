const Admin = require('./admin.model');
const User = require('../auth/auth.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config');

async function authenticateAdmin({ email, password }) {
  const admin = await Admin.findOne({ email });
  if (!admin) throw new Error('Invalid credentials');

  const valid = await admin.validatePassword(password);
  if (!valid) throw new Error('Invalid credentials');

  const payload = {
    id: admin._id,
    roles: admin.roles,
  };
  const token = jwt.sign(payload, config.JWT_SECRET, { expiresIn: '1d' });
  return { admin, token };
}

async function getAllUsers() {
  return User.find({}, '-passwordHash');
}

async function banUser(userId) {
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');
  user.roles = user.roles.filter(r => r !== 'athlete' && r !== 'coach' && r !== 'family');
  user.roles.push('banned');
  await user.save();
  return user;
}

module.exports = {
  authenticateAdmin,
  getAllUsers,
  banUser,
};
