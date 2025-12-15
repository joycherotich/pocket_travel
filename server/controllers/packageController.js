import Package from "../models/Package.js";

// Create
export const createPackage = async (req, res) => {
  try {
    const pkg = await Package.create(req.body);
    res.json({ message: "Package created", data: pkg });
  } catch (err) {
    res.status(500).json({ message: "Error creating package", error: err });
  }
};

// Get all
export const getPackages = async (req, res) => {
  try {
    const pkgs = await Package.find().sort({ createdAt: -1 });
    res.json(pkgs);
  } catch (err) {
    res.status(500).json({ message: "Error fetching packages" });
  }
};

// Update
export const updatePackage = async (req, res) => {
  try {
    const updated = await Package.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.json({ message: "Updated", data: updated });
  } catch (err) {
    res.status(500).json({ message: "Error updating package" });
  }
};

// Delete
export const deletePackage = async (req, res) => {
  try {
    await Package.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting package" });
  }
};
