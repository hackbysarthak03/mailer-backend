import express from "express";
import { addToCart, getUserWithCart, removeFromCart, updateCartItem, updateCartQuantity } from "../controllers/cartController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/add", protect, addToCart);
router.post("/remove", protect, removeFromCart);
router.post("/update", protect, updateCartQuantity);
router.post("/update-item", protect, updateCartItem); 
router.get("/user-cart", protect, getUserWithCart); // Get cart for logged-in user

export default router;
