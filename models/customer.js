// Import Mongoose
const mongoose = require('mongoose');

// Define the Customer's Schema
const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true },
  email: {
    type: String,
    required: true },
  phone_number: {
    type: Number,
    required: true, },
  customer_addr: {
    type: String,
    required: true, },
  registered_date: {
    type: String,
    required: true },
}  
);
// Create the Food Ingredient Model
const Customer = mongoose.model('customers', customerSchema);

module.exports = Customer;
