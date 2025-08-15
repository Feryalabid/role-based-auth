const express = require('express');
const { checkToken, checkAdmin } = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

// PROFILE (any logged-in user)
router.get('/profile', checkToken, (req, res) => {
  res.json({ message: `Welcome back, user ${req.user.id}`, role: req.user.role });
});

// ADMIN ACCESS CHECK
router.get('/admin', checkAdmin, (req, res) => {
  res.json({ message: 'You are an admin! Full access granted.' });
});

// GET ALL USERS (ADMIN ONLY)
router.get('/all', checkAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password'); // hide passwords
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Could not fetch users, try again later' });
  }
});

// DELETE USER (ADMIN ONLY)
router.delete('/:id', checkAdmin, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete user' });
  }
});

// CHANGE USER ROLE (ADMIN ONLY)
router.patch('/:id/role', checkAdmin, async (req, res) => {
  try {
    const { role } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select('-password');
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: 'Could not update role' });
  }
});

module.exports = router;
