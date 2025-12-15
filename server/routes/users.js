import express from "express";
import User from "../models/User.js";
import Role from "../models/Role.js";
import bcrypt from "bcryptjs";

const router = express.Router();

// Get all users with role info
router.get("/", async (req, res) => {
  const users = await User.find().populate("role", "name privileges");
  res.json(users);
});

// Create user with assigned role
router.post("/", async (req, res) => {
  try {
    const { name, email, password, roleId } = req.body;

    // Check if user exists
    if (await User.findOne({ email })) {
      return res.status(400).json({ message: "User already exists" });
    }

    const role = await Role.findById(roleId);
    if (!role) return res.status(400).json({ message: "Invalid role" });

    const user = new User({ name, email, password, role: role._id });
    await user.save();

    res.status(201).json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: { id: role._id, name: role.name, privileges: role.privileges },
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update user role
router.put("/:id/role", async (req, res) => {
  try {
    const { roleId } = req.body;
    const role = await Role.findById(roleId);
    if (!role) return res.status(400).json({ message: "Invalid role" });

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role: role._id },
      { new: true }
    ).populate("role", "name privileges");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
