import express from "express";
import {
  addBlog,
  getAllBlogs,
  getBlog,
  updateBlog,
  deleteBlog,
  addComment,
  deleteComment,
} from "../controllers/blogController.js";
import { adminOnly } from "../middlewares/adminMiddleware.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Blog routes
router.post("/", protect, adminOnly, addBlog);
router.get("/", getAllBlogs);
router.get("/:slug", getBlog);
router.put("/:slug", protect, adminOnly, updateBlog);
router.delete("/:slug", protect, adminOnly, deleteBlog);

// Comment routes
router.post("/:slug/comments", protect, addComment);
router.delete("/:slug/comments/:commentId", protect, adminOnly, deleteComment);

export default router;
