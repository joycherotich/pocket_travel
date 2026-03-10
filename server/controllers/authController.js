import User from "../models/User.js";
import Role from "../models/Role.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { sendWelcomeEmail } from "../config/mailer.js";

/* ─────────────────────────────────────────────
   HELPER: Sign JWT
───────────────────────────────────────────── */
const signToken = (user) =>
  jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

/* ─────────────────────────────────────────────
   HELPER: Generate readable temp password
   e.g.  "Xk9#mP2qLa"
───────────────────────────────────────────── */
const generateTempPassword = () => {
  return crypto.randomBytes(8).toString("base64").slice(0, 10);
};

/* ─────────────────────────────────────────────
   REGISTER  (public self-signup — optional)
───────────────────────────────────────────── */
export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!email || !password || !name)
      return res.status(400).json({ message: "Missing fields" });

    const exists = await User.findOne({ email });
    if (exists)
      return res.status(400).json({ message: "Email already registered" });

    const user = await User.create({ name, email, password, role });

    const token = signToken(user);
    res.json({
      message: "Registered",
      token,
      user: { id: user._id, name, email, role },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", err: err.message });
  }
};

/* ─────────────────────────────────────────────
   LOGIN
───────────────────────────────────────────── */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Missing fields" });

    const user = await User.findOne({ email }).populate("role");
    if (!user)
      return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = signToken(user);
    res.json({
      message: "Login success",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role?.name ?? user.role, // works whether populated or not
        mustChangePassword: user.mustChangePassword,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", err: err.message });
  }
};

/* ─────────────────────────────────────────────
   CREATE USER  (admin only)
   - Generates temp password
   - Emails credentials to user
───────────────────────────────────────────── */
export const createUser = async (req, res) => {
  try {
    const { name, email, role: roleId } = req.body;

    if (!name || !email || !roleId)
      return res.status(400).json({ message: "Name, email, and role are required" });

    const exists = await User.findOne({ email });
    if (exists)
      return res.status(400).json({ message: "Email already registered" });

    const roleDoc = await Role.findById(roleId);
    if (!roleDoc)
      return res.status(400).json({ message: "Role not found" });

    // ⚠️  Capture BEFORE .create() — the pre-save hook will hash it
    const tempPassword = generateTempPassword();

    const user = await User.create({
      name,
      email,
      password: tempPassword,   // hashed automatically by pre-save hook
      role: roleId,
      mustChangePassword: true,
    });

    // Send plain tempPassword (before it was hashed) to user's email
    await sendWelcomeEmail({
      name,
      email,
      password: tempPassword,
      role: roleDoc.name,
    });

    res.status(201).json({
      message: "User created & credentials sent to email 📧",
      user: { id: user._id, name, email, role: roleDoc.name },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", err: err.message });
  }
};