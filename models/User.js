const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  paidPerMonth: {
    type: Array,
    required: false,
    default: undefined
  },
  yearlyCosts: {
    type: Array,
    required: false,
    default: undefined
  },
  yearlyNonReocurringCosts: {
    type: Array,
    required: false,
    default: undefined
  },
  password: {
    type: String,
    required: true
  },
  initialized: {
    type: Boolean,
    required: true,
    default: false
  },
  date: {
    type: Date,
    default: Date.now
  },
  theme: {
    type: String,
    default: '/css/themes/black-style.css'
  }
});

mongoose.model('users', UserSchema);