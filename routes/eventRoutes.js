// import modules
import express from "express";

const router = express.Router();

// import files
import {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  joinEvent,
  uploadEventGallery,
  getAllEventsGallery,
} from "../controllers/eventController.js";
import upload from "../config/multerConfig.js";
import protect from "../middlewares/authMiddleware.js";

// Routes
router.post("/", protect, createEvent);
router.post(
  "/upload-event-gallery/:id",
  protect,
  upload.array("profileImage", 6),
  uploadEventGallery
);
router.post("/join/:eventId", joinEvent);
router.get("/", protect, getAllEvents);
router.get("/blog-gallery", getAllEventsGallery);
router.get("/:id", protect, getEventById);
router.put("/:id", protect, updateEvent);
router.delete("/:id", protect, deleteEvent);

export default router;
