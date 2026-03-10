import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // ← populate role to get name string
   
   const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // ← verify these print correctly in terminal
    console.log("role name:", user.role?.name);
    console.log("mustChangePassword:", user.mustChangePassword);

    res.json({
      token,
      user: {
        id:                  user._id,
        name:                user.name,
        email:               user.email,
        role:                user.role ?? null,        // ← "admin" not ObjectId
        mustChangePassword:  user.mustChangePassword ?? false, // ← true/false
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
