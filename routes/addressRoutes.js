import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import {
  getAddresses,
  updateAddress,
  deleteAddress,addAddress
} from "../controllers/addressController.js";

const router = express.Router();

// Get all addresses
router.get("/", protect, getAddresses);

// Add new address
router.post("/", protect, addAddress);

// Edit address by index
router.put("/:index", protect, updateAddress);

// Delete address by index
router.delete("/:index", protect, deleteAddress);

export default router;
