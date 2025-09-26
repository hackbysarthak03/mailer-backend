import express from "express";
import { setPromotionalBanner, getPromotionalBanner } from "../controllers/promotionalBannerController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { adminOnly } from "../middlewares/adminMiddleware.js";

const router = express.Router();

router.get("/", getPromotionalBanner);
router.post("/", protect, adminOnly, setPromotionalBanner);

export default router;
