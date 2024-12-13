// Import Mongoose
const mongoose = require('mongoose');
// Define the Food Ingredient Schema
const orderSchema = new mongoose.Schema({
  customer_id: {
    type: String,
    required: true
  },
  items: [
    {
      food_ingredient: String,
      quantity: Number,
      price_per_unit: Number,
    },
  ],
  total_price: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'delivered', 'unknown', 'failed'],
    required: true,
  },
  delivery_address: {
    type: String,
    required: true,
  },
  created_at: {
    type: Number
  }
});

// Create the Food Ingredient Model
const Order = mongoose.model('orders', orderSchema);

module.exports = Order;
