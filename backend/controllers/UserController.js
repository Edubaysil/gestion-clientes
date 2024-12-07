// backend/controllers/UserController.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');

exports.registerUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = new User({ username, password });
    await user.save();
    res.status(201).send(user);
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).send('Invalid credentials');
    }
    const token = jwt.sign({ id: user._id }, 'secret', { expiresIn: '1h' });
    res.status(200).send({ token });
  } catch (error) {
    res.status(400).send(error);
  }
};