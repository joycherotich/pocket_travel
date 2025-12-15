import express from "express";
import {
  createPackage,
  getPackages,
  updatePackage,
  deletePackage,
} from "../controllers/packageController.js";

import { protect, restrictTo } from "../middleware/auth.js";

const router = express.Router();

router.get("/", protect, getPackages);
router.post("/", protect, createPackage);
router.put("/:id", protect, updatePackage);
router.delete("/:id", protect, deletePackage);


export default router;
