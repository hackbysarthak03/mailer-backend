import express from "express";
import { setBannerImages, getBannerImages } from "../controllers/bannerImagesController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { adminOnly } from "../middlewares/adminMiddleware.js";

const router = express.Router();

router.get("/", getBannerImages);
router.post("/", protect, adminOnly, setBannerImages);

export default router;
