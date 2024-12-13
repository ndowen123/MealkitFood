// Import Mongoose
const mongoose = require('mongoose');

// Define the Food Ingredient Schema
const foodIngredientSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  category: { type: String, enum: ['vegetable', 'spice', 'protein', 'grain', 'fruit'], required: true },
  price_per_unit: { type: Number, required: true, min: 0 },
  stock: { type: Number, required: true, min: 0 },
  supplier: { type: String, required: true },
  image: {type: String },
  added_date: { type: String}

});


// Create the Food Ingredient Model
const FoodIngredient = mongoose.model('foodingredients', foodIngredientSchema);

module.exports = FoodIngredient;
