import express from "express";
import { signup, signin, forgotPassword, resetPassword, getUserById } from "../controllers/userController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.get("/user/:id", protect, getUserById);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;
