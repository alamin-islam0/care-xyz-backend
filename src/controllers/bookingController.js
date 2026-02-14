import { Booking } from "../models/Booking.js";
import { Service } from "../models/Service.js";
import { sendBookingInvoiceEmail } from "../utils/email.js";

export async function createBooking(req, res) {
  try {
    const { serviceId, durationType, durationValue, location } = req.body;

    if (!serviceId || !durationType || !durationValue || !location) {
      return res.status(400).json({ message: "Missing required booking fields" });
    }

    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    const unitCharge = durationType === "days" ? service.chargePerDay : service.chargePerHour;
    const totalCost = unitCharge * Number(durationValue);

    const booking = await Booking.create({
      user: req.user._id,
      service: service._id,
      durationType,
      durationValue,
      location,
      totalCost,
      status: "pending"
    });

    try {
      await sendBookingInvoiceEmail({
        to: req.user.email,
        customerName: req.user.name,
        booking,
        service
      });
    } catch (emailError) {
      console.warn("Failed to send invoice email:", emailError.message);
    }

    const populated = await Booking.findById(booking._id).populate("service");
    return res.status(201).json({ booking: populated });
  } catch (error) {
    return res.status(500).json({ message: "Failed to create booking", error: error.message });
  }
}

export async function getMyBookings(req, res) {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate("service")
      .sort({ createdAt: -1 });

    return res.status(200).json({ bookings });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch bookings", error: error.message });
  }
}

export async function getBookingById(req, res) {
  try {
    const booking = await Booking.findOne({
      _id: req.params.bookingId,
      user: req.user._id
    }).populate("service");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    return res.status(200).json({ booking });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch booking", error: error.message });
  }
}

export async function cancelBooking(req, res) {
  try {
    const booking = await Booking.findOne({
      _id: req.params.bookingId,
      user: req.user._id
    });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.status === "completed") {
      return res.status(400).json({ message: "Completed booking cannot be cancelled" });
    }

    booking.status = "cancelled";
    await booking.save();

    return res.status(200).json({ booking });
  } catch (error) {
    return res.status(500).json({ message: "Failed to cancel booking", error: error.message });
  }
}

export async function getAllBookings(req, res) {
  try {
    const bookings = await Booking.find()
      .populate("service")
      .populate("user", "name email contact")
      .sort({ createdAt: -1 });

    return res.status(200).json({ bookings });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch all bookings", error: error.message });
  }
}

export async function updateBookingStatus(req, res) {
  try {
    const { status } = req.body;
    if (!["pending", "confirmed", "completed", "cancelled"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const booking = await Booking.findById(req.params.bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    booking.status = status;
    await booking.save();

    return res.status(200).json({ booking });
  } catch (error) {
    return res.status(500).json({ message: "Failed to update booking status", error: error.message });
  }
}
