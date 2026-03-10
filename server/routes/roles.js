import express from "express";
import Role from "../models/Role.js";
import { PRIVILEGES } from "../constants/privileges.js";

const router = express.Router();

/* ================= GET ALL ROLES ================= */
router.get("/", async (req, res) => {
  try {
    const roles = await Role.find().sort({ createdAt: -1 });
    res.json(roles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error fetching roles" });
  }
});

/* ================= CREATE ROLE ================= */
router.post("/", async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Role name is required" });
    }

    const existingRole = await Role.findOne({ name: name.trim() });
    if (existingRole) {
      return res.status(400).json({ message: "Role already exists" });
    }

    const newRole = await Role.create({
      name: name.trim(),
      privileges: [], // 👈 start empty
    });

    res.status(201).json(newRole);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error creating role" });
  }
});

/* ================= GET ALL PRIVILEGES ================= */
router.get("/privileges/all", (req, res) => {
  res.json(PRIVILEGES);
});

/* ================= TOGGLE PRIVILEGE (AUTO SAVE) ================= */
router.patch("/:id/privileges", async (req, res) => {
  try {
    const { privilege, enabled } = req.body;

    if (!PRIVILEGES.includes(privilege)) {
      return res.status(400).json({ message: "Invalid privilege" });
    }

    const role = await Role.findById(req.params.id);
    if (!role) {
      return res.status(404).json({ message: "Role not found" });
    }

    if (enabled) {
      if (!role.privileges.includes(privilege)) {
        role.privileges.push(privilege);
      }
    } else {
      role.privileges = role.privileges.filter((p) => p !== privilege);
    }

    await role.save();
    res.json(role);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update privileges" });
  }
});

export default router;
