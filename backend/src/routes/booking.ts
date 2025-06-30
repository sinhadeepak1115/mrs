import { Router } from "express";
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { authenticate } from "../middleware";

const router = Router();
const prisma = new PrismaClient();

// POST   /api/bookings            # Book tickets
// GET    /api/bookings            # Get all bookings of logged-in user
// GET    /api/bookings/:id        # Get one booking
// DELETE /api/bookings/:id        # Cancel booking

//User route
router.get(
  "/",
  authenticate,
  async (req: Request, res: Response): Promise<void> => {
    //@ts-ignore
    const userId = req.userId;
    try {
      const allBookings = await prisma.booking.findMany({
        where: { userId: userId },
      });
      console.log("Bookings fetched:", allBookings);
      res.status(200).json({
        message: "Bookings fetched successfully",
        bookings: allBookings,
      });
    } catch (error) {
      console.error("Error fetching bookings:", error);
      res.status(500).json({ error: "Unable to fetch bookings" });
    }
  },
);

router.get(
  "/:id",
  authenticate,
  async (req: Request, res: Response): Promise<void> => {
    //@ts-ignore
    const userId = req.userId;
    const bookingId = req.params.id;
    try {
      const booking = await prisma.booking.findUnique({
        where: { id: bookingId, userId: userId },
      });
      res
        .status(200)
        .json({ message: "Booking fetched successfully", booking });
    } catch (error) {}
  },
);

router.post(
  "/",
  authenticate,
  async (req: Request, res: Response): Promise<void> => {
    const { userId, showId, seatCount, total, status } = req.body;
    try {
      const newBooking = await prisma.booking.create({
        data: { userId, showId, seatCount, total, status },
      });
      res
        .status(201)
        .json({ message: "Booking created successfully", booking: newBooking });
    } catch (error) {
      console.error("Error creating booking:", error);
      res.status(500).json({ error: "Unable to create booking" });
    }
  },
);

router.delete(
  "/:id",
  authenticate,
  async (req: Request, res: Response): Promise<void> => {
    const bookingId = req.params.id;
    if (!bookingId) {
      res.status(400).json({ error: "Booking ID is required" });
      return;
    }
    try {
      const deletedBooking = await prisma.booking.delete({
        where: { id: bookingId },
      });
    } catch (error) {
      console.error("Error deleting booking:", error);
      res.status(500).json({ error: "Unable to delete booking" });
    }
  },
);

export default router;
