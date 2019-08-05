const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const Surplus = new Schema({
  surplus:{
    type: Number,
    required: true
  }
});

mongoose.model('surplus', Surplus);