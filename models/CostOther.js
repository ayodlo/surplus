const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const CostOtherSchema = new Schema({
  price: {
    type: Number,
    required: true
  },
  user: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  userid: {
    type: String,
    required: true
  }
});

mongoose.model('costOther', CostOtherSchema);