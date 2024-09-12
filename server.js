const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors=require('cors')
const bodyParser = require('body-parser');
const events = require('./Routes/events.js');
const User = require('./models/Useres.js');
const Useres = require('./models/Useres.js');
const app = express();
const port = process.env.PORT || 5000;

// Body parser middleware
app.use(bodyParser.json());
// app.use(express.json());
app.use(cors())


const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});
// Import routes
// Register route
app.post('/api/user', async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Login route
app.post('/api/user/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await Useres.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, 'your_jwt_secret', { expiresIn: '1h' });

    res.status(200).json({ token,user });
  } catch (err) {
    res.status(5000).json({ message: 'Server error' });
  }
});

app.use('/api/events',events)

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  mongoose.connect('mongodb+srv://daneshkumar580:danipetfinn12@cluster0.i1jbs.mongodb.net/', {
    // useNewUrlParser: true,
    
  }).then(() => {
    console.log('MongoDB connected');
  }).catch(err => {
    console.log('MongoDB connection error:', err);
  });

});

