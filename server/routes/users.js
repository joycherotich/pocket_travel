import express from "express";
import crypto from "crypto";          // ← THIS is likely missing
import User from "../models/User.js";
import Role from "../models/Role.js";
import { sendWelcomeEmail } from "../config/mailer.js";
// import bcrypt from "bcryptjs";   // ← THIS was missing
import bcrypt from "bcryptjs";


const router = express.Router();

/* ── GET /api/users ── */
router.get("/", async (req, res) => {
  try {
    const users = await User.find().populate("role", "name privileges");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ── POST /api/users ── admin creates user */
router.post("/", async (req, res) => {
  try {
    console.log("REQ BODY:", req.body); // ← remove after debugging

    const { name, email, roleId } = req.body;

    if (!name || !email || !roleId)
      return res.status(400).json({ message: "Name, email, and role are required" });

    if (await User.findOne({ email }))
      return res.status(400).json({ message: "User already exists" });

    const role = await Role.findById(roleId);
    if (!role)
      return res.status(400).json({ message: "Role not found" });

    // Generate BEFORE .create() — pre-save hook hashes it
    const tempPassword = crypto.randomBytes(8).toString("base64").slice(0, 10);

    console.log("tempPassword:", tempPassword); // ← remove after debugging

    const user = await User.create({
      name,
      email,
      password: tempPassword,
      role: role._id,
      mustChangePassword: true,
    });

    await sendWelcomeEmail({
      name,
      email,
      password: tempPassword,
      role: role.name,
    });

    res.status(201).json({
      message: "User created & credentials sent to email 📧",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: { id: role._id, name: role.name },
      },
    });
  } catch (err) {
    console.error("CREATE USER ERROR:", err.message); // ← shows exact cause
    res.status(500).json({ message: err.message });
  }
});

/* ── PUT /api/users/:id/role ── reassign role */
router.put("/:id/role", async (req, res) => {
  try {
    const { roleId } = req.body;

    const role = await Role.findById(roleId);
    if (!role)
      return res.status(400).json({ message: "Invalid role" });

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role: role._id },
      { new: true }
    ).populate("role", "name privileges");

    if (!user)
      return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /api/auth/change-password
router.put("/change-password", async (req, res) => {
  try {
    const { email, tempPassword, newPassword, confirmPassword } = req.body;

    if (!email || !tempPassword || !newPassword || !confirmPassword)
      return res.status(400).json({ message: "All fields are required" });

    if (newPassword !== confirmPassword)
      return res.status(400).json({ message: "Passwords do not match" });

    if (newPassword.length < 6)
      return res.status(400).json({ message: "Password must be at least 6 characters" });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "User not found" });

    // Verify temp password
    const isMatch = await bcrypt.compare(tempPassword, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Incorrect temporary password" });

    // Update password — pre-save hook will hash it
    user.password = newPassword;
    user.mustChangePassword = false;
    await user.save();

    res.json({ message: "Password changed successfully. Please log in." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;