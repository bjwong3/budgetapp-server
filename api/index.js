const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection string (replace with your actual MongoDB Atlas connection string)
const uri = process.env.MONGODB_URL;
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const connection = mongoose.connection;
connection.once('open', () => {
  console.log('MongoDB database connection established successfully');
});

// Define a Mongoose schema for the users collection
const userSchema = new mongoose.Schema({
  email: String,
	budgets: {
    type: Array,
    of: Object
  },
  lastAccessedYear: Number,
  lastAccessedMonth: Number
});

// Define a Mongoose schema for the history collection
const historySchema = new mongoose.Schema({
  email: String,
  history: {
    type: Map,
    of: Object
  }
});

const User = mongoose.model('User', userSchema);
const History = mongoose.model('History', historySchema);

app.get("/", (req, res) => res.send("Express on Vercel"));

// GET endpoint to fetch a specific user by email
app.get('/api/users/:email', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email }); // Find user by email
    if (user) {
      res.send(user); // Send user data to the client
    } else {
      res.status(404).send({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// GET endpoint
app.get('/api/test', async (req, res) => {
  try {
    res.set('Content-Type', 'text/plain');
    const val = req.headers['value'];
    if (val) {
      res.send(val); // Send data to the client
    } else {
      res.status(404).send({ message: 'Value not found' });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// PUT endpoint to update a specific user by email
app.put('/api/users/:email', async (req, res) => {
  try {
    const updatedUser = await User.findOneAndUpdate(
      { email: req.params.email }, // Find user by email
      req.body,                    // Update with request body data
      { new: true }                // Return the updated document
    );

    if (updatedUser) {
      res.send(updatedUser); // Send the updated user data to the client
    } else {
      res.status(404).send({ message: 'User not found' });
    }
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

app.post('/api/users', async (req, res) => {
  const newUser = new User(req.body); // Create a new User document from the request body
  try {
    const savedUser = await newUser.save(); // Save the new user to the collection
    res.status(201).send(savedUser);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

// GET endpoint to fetch a specific history by email
app.get('/api/history/:email', async (req, res) => {
  try {
    const history = await History.findOne({ email: req.params.email }); // Find user by email
    if (history) {
      res.send(history); // Send history data to the client
    } else {
      res.status(404).send({ message: 'History not found' });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// PUT endpoint to update a specific history by email
app.put('/api/history/:email', async (req, res) => {
  try {
    const updatedHistory = await History.findOneAndUpdate(
      { email: req.params.email }, // Find history by email
      req.body,                    // Update with request body data
      { new: true }                // Return the updated document
    );

    if (updatedHistory) {
      res.send(updatedHistory); // Send the updated history data to the client
    } else {
      res.status(404).send({ message: 'History not found' });
    }
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

app.post('/api/history', async (req, res) => {
  const newHistory = new History(req.body); // Create a new History document from the request body
  try {
    const savedHistory = await newHistory.save(); // Save the new history to the collection
    res.status(201).send(savedHistory);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});

export default app