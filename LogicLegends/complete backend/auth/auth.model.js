const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const SALT_ROUNDS = 10;

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  roles: { type: [String], default: ['athlete'] }, // roles like athlete, coach, admin, family
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

userSchema.methods.validatePassword = function (password) {
  return bcrypt.compare(password, this.passwordHash);
};

userSchema.pre('save', async function (next) {
  if (this.isModified('passwordHash')) return next();

  if (this.isModified('password')) {
    this.passwordHash = await bcrypt.hash(this.password, SALT_ROUNDS);
    this.password = undefined;
  }
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
