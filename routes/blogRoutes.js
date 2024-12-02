// import modules
import express from "express";

const router = express.Router();

// import files
import {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
  uploadBlogGallery,
} from "../controllers/blogController.js";
import upload from "../config/multerConfig.js";
import protect from "../middlewares/authMiddleware.js";

// Routes
router.post("/", protect, createBlog);
router.post(
  "/upload-blog-gallery/:id",
  protect,
  upload.array("profileImage", 6),
  uploadBlogGallery
);
router.get("/", protect, getAllBlogs);
router.get("/:id", protect, getBlogById);
router.put("/:id", protect, updateBlog);
router.delete("/:id", protect, deleteBlog);

export default router;
