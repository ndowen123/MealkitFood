// Import Mongoose
const mongoose = require('mongoose');

// Define the Food Ingredient Schema
const paymentSchema = new mongoose.Schema({
  order_id: {
    type: String,
    required: true,
    unique: true
  },
  customer_id: {
    type: String,
    required: true
  },
  payment_date: {
    type: String
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  payment_method: {
    type: String,
    enum: ['Cash', 'Bank Transfer'],
    required: [true, 'Payment method is required.']
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    required: true
  }

}
  
);

// Create the Food Ingredient Model
const Payment = mongoose.model('payment', paymentSchema);

module.exports = Payment;
