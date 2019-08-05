const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const CostMonthlySchema = new Schema({
  amount:{
    type: Number,
    required: true
  },
  title:{
    type: String,
    required: true
  },
  userid: {
    type: String,
    required: true
  }
});

mongoose.model('costMonthly', CostMonthlySchema);