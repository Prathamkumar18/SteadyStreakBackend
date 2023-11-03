const authService = require('../services/authService');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const secretKey = process.env.JWT_SECRET || 'SteadyStride';

const authController = {
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await authService.authenticate(email, password);
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      const token = jwt.sign(
        { id: user._id, email: user.email },
        secretKey,
        { expiresIn: '24h' }
      );
      return res.status(200).json({ token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'An error occurred' });
    }
  },

  signup: async (req, res) => {
    try {
      const { name, email, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({ name, email, password: hashedPassword });
      await newUser.save();
      res.status(200).json({ message: 'User registered successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = authController;

//When you declare a function as async, it means that this function can contain asynchronous operations. 
//Asyncronous operation are those operation that takes some time to complete.
//await make entire async function to pause the execution until the promise is either fulfilled or rejected.
//Authentication is used to identify the user..
//Authorization is used to check what are the resources that are accesseble to the user.