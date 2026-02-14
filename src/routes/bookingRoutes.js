import { Router } from "express";
import {
  cancelBooking,
  createBooking,
  getBookingById,
  getMyBookings
} from "../controllers/bookingController.js";
import { authMiddleware } from "../middleware/auth.js";

const router = Router();

// Admin Routes
import { getAllBookings, updateBookingStatus } from "../controllers/bookingController.js";
import { adminMiddleware } from "../middleware/auth.js";

router.get("/all", authMiddleware, adminMiddleware, getAllBookings);
router.patch("/:bookingId/status", authMiddleware, adminMiddleware, updateBookingStatus);

// User Routes
router.use(authMiddleware);
router.post("/", createBooking);
router.get("/my", getMyBookings);
router.get("/:bookingId", getBookingById);
router.patch("/:bookingId/cancel", cancelBooking);

export default router;
