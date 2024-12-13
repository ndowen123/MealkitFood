const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = 3000;

// Middleware to parse JSON data
app.use(cors());
app.use(express.json());

// MongoDB connection using Mongoose

mongoose
  .connect("mongodb://localhost:27017/myCrudApp",{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    authSource: "admin",
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("Could not connect to MongoDB:", error));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

const FoodIngredients = require("./models/FoodIngredient");
const Customer = require("./models/customer");
const Order = require("./models/order");
const Payment = require("./models/payment");

app.post("/foodingredients", async (req, res) => {
  console.log(req.body); // Check received data
  try {
    const foodingredient = new FoodIngredients(req.body);
    await foodingredient.save();
    res.status(201).send(foodingredient);
  } catch (error) {
    console.error('Error occurred:', error);
    res.status(400).send({
      message: "Failed to create food ingredient",
      error: error.message,
    });
  }
});

app.put("/foodingredients/:id", async (req, res) => {
  try {
    const foodingredient = await FoodIngredients.findByIdAndUpdate(
      req.params.id,
      req.body
    );
    res.status(200).send(foodingredient);
  } catch (error) {
    console.error(error);
    res.status(400).send({
      message: "Failed to update food ingredient",
      error: error.message,
    });
  }
});

app.delete("/foodingredients/:id", async (req, res) => {
  try {
    const food = await FoodIngredients.findByIdAndDelete(req.params.id);
    res.status(200).send(food);
  } catch (error) {
    console.error(error);
    res.status(400).send({
      message: "Failed to delete food ingredient",
      error: error.message,
    });
  }
});
// Read Food FoodIngredients

app.get("/foodingredients", async (req, res) => {
  try {
    const foods = await FoodIngredients.find({});
    res.send(foods);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

app.get("/Customer", async (req, res) => {
  try {
    const customer = await Customer.find({});
    res.send(customer);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

app.post("/customer", async (req, res) => {
  console.log(req.body); // Check received data
  try {
    const customer = new Customer(req.body);
    await customer.save();
    res.status(201).send(customer);
  } catch (error) {
    console.error('Error occurred:', error);
    res.status(400).send({
      message: "Failed to create customer",
      error: error.message,
    });
  }
});

app.delete("/customer/:id", async (req, res) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);
    res.status(200).send(customer);
  } catch (error) {
    console.error(error);
    res.status(400).send({
      message: "Failed to delete customer",
      error: error.message,
    });
  }
});


app.get("/order", async (req, res) => {
  try {
    const orders = await Order.aggregate([
      {
        $lookup: {
          from: 'customers',
          let: { customerId: { $toObjectId: '$customer_id' } },
          pipeline: [
            { 
              $match: { 
                $expr: { 
                  $eq: ['$_id', '$$customerId'] 
                } 
              } 
            }
          ],
          as: 'customer'
        }
      },
      {
        $lookup: {
          from: 'payments',
          let: { orderId: '$_id' },
          pipeline: [
            { 
              $match: { 
                $expr: { 
                  $eq: ['$order_id', { $toString: '$$orderId' }] 
                } 
              } 
            }
          ],
          as: 'payment'
        }
      },
      {
        $unwind: {
          path: '$customer',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $unwind: {
          path: '$payment',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          created_at: 1,
          total_price: 1,
          status: 1,
          delivery_address: 1,
          customer_id: 1,
          order_id: '$_id',
          customer: {
            name: '$customer.name',
            email: '$customer.email',
            phone_number: '$customer.phone_number',
            customer_addr: '$customer.customer_addr'
          },
          payment: {
            id: '$payment._id',
            payment_date: '$payment.payment_date',
            amount: '$payment.amount',
            payment_method: '$payment.payment_method',
            status: '$payment.status'
          }
        }
      }
    ]);
    
    res.send(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

app.post("/order", async (req, res) => {
  try {
    const {payment_method, ...input } = req.body
    const orders = new Order({...input, created_at: new Date().getTime()});
    await orders.save();

    const payment = new Payment({
      order_id: orders.id,
      customer_id: orders.customer_id,
      amount: orders.total_price,
      payment_method,
      status: 'pending'
    });

    await payment.save();

    res.status(201).send(orders);
  } catch (error) {
    res.status(400).send({ message: "Failed to create order", error: error.message });
  }
});


app.get("/payments", async (req, res) => {
  try {
    const payments = await Payment.find({});
    res.send(payments);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
}); 

app.put('/payments/:id', async (req, res) => {
  try {
    // Validate the payment ID format
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid payment ID.' });
    }

    // Update the payment record
    const payment = await Payment.findByIdAndUpdate(
      req.params.id, // Find the payment by ID
      req.body,      // Update data from the request body
      { new: true, runValidators: true } // Return the updated document and apply validation
    );

    // Check if the payment exists
    if (!payment) {
      return res.status(404).json({ error: 'Payment record not found.' });
    }

    // Respond with the updated payment
    res.status(200).json(payment);
  } catch (error) {
    // Catch and handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ error: messages.join(', ') });
    }
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// UPDATE: Update a order's information
app.put("/Order/:id", async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      req.body
    );
    res.status(200).send(order);
  } catch (error) {
    console.error(error);
    res.status(400).send({
      message: "Failed to update food ingredient",
      error: error.message,
    });
  }
});

app.delete("/Order/:id", async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    res.status(200).send(order);
  } catch (error) {
    console.error(error);
    res.status(400).send({
      message: "Failed to delete food ingredient",
      error: error.message,
    });
  }
});