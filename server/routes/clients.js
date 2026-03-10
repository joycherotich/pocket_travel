import express from "express";
import Client from "../models/Client.js";

const router = express.Router();

/* ── GET /api/clients ── list all clients ── */
router.get("/", async (req, res) => {
  try {
    const clients = await Client.find()
      .populate("assignedTo", "name email")
      .sort({ createdAt: -1 });
    res.json(clients);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ── GET /api/clients/:id ── single client ── */
router.get("/:id", async (req, res) => {
  try {
    const client = await Client.findById(req.params.id).populate("assignedTo", "name email");
    if (!client) return res.status(404).json({ message: "Client not found" });
    res.json(client);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ── POST /api/clients ── create client ── */
router.post("/", async (req, res) => {
  try {
    const { name, email, phone, destination, notes, assignedTo } = req.body;

    if (!name) return res.status(400).json({ message: "Name is required" });

    const client = await Client.create({
      name,
      email,
      phone,
      destination,
      notes,
      assignedTo: assignedTo || null,
    });

    res.status(201).json({ message: "Client created", client });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ── PUT /api/clients/:id ── update client ── */
router.put("/:id", async (req, res) => {
  try {
    const client = await Client.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!client) return res.status(404).json({ message: "Client not found" });
    res.json({ message: "Client updated", client });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ── DELETE /api/clients/:id ── delete client ── */
router.delete("/:id", async (req, res) => {
  try {
    const client = await Client.findByIdAndDelete(req.params.id);
    if (!client) return res.status(404).json({ message: "Client not found" });
    res.json({ message: "Client deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;