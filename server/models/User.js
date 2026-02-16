const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  targetRole: {
    type: String,
    trim: true
  },
  password: {
    type: String,
    required: function () {
      return !this.googleId; // Only required if googleId is not present
    },
    select: false
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true // Allows multiple nulls for non-Google users
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Encrypt password using bcrypt
// Encrypt password using bcrypt
userSchema.pre('save', async function () {
  if (!this.isModified('password') || !this.password) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Reverse populate with virtuals
userSchema.virtual('resumes', {
  ref: 'Resume',
  localField: '_id',
  foreignField: 'user',
  justOne: false
});

module.exports = mongoose.model('User', userSchema);