import express from "express";
import { setGetInTouch, getGetInTouch } from "../controllers/getInTouchController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { adminOnly } from "../middlewares/adminMiddleware.js";

const router = express.Router();

router.get("/", getGetInTouch);
router.post("/", protect, adminOnly, setGetInTouch);

export default router;
