import express from "express";
import Role from "../models/Role.js";

const router = express.Router();

// GET /api/roles - get all roles
router.get("/", async (req, res) => {
  try {
    const roles = await Role.find().sort({ createdAt: -1 }); // latest first
    res.json(roles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error fetching roles" });
  }
});

// POST /api/roles - create new role
router.post("/", async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Role name is required" });
    }

    // Check if role exists
    const existingRole = await Role.findOne({ name: name.trim() });
    if (existingRole) {
      return res.status(400).json({ message: "Role already exists" });
    }

    const newRole = new Role({ name: name.trim() });
    await newRole.save();

    res.status(201).json(newRole);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error creating role" });
  }
});

export default router;
