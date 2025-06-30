"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const middleware_1 = require("../middleware");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
// POST   /api/bookings            # Book tickets
// GET    /api/bookings            # Get all bookings of logged-in user
// GET    /api/bookings/:id        # Get one booking
// DELETE /api/bookings/:id        # Cancel booking
//User route
router.get("/", middleware_1.authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //@ts-ignore
    const userId = req.userId;
    try {
        const allBookings = yield prisma.booking.findMany({
            where: { userId: userId },
        });
        res.status(200).json({
            message: "Bookings fetched successfully",
            bookings: allBookings,
        });
    }
    catch (error) {
        console.error("Error fetching bookings:", error);
        res.status(500).json({ error: "Unable to fetch bookings" });
    }
}));
//User route
router.get("/:id", middleware_1.authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //@ts-ignore
    const userId = req.userId;
    const bookingId = req.params.id;
    try {
        const booking = yield prisma.booking.findUnique({
            where: { id: bookingId, userId: userId },
        });
        res
            .status(200)
            .json({ message: "Booking fetched successfully", booking });
    }
    catch (error) { }
}));
//User route
router.post("/", middleware_1.authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, showId, seatCount, total, status } = req.body;
    try {
        const newBooking = yield prisma.booking.create({
            data: { userId, showId, seatCount, total, status },
        });
        res
            .status(201)
            .json({ message: "Booking created successfully", booking: newBooking });
    }
    catch (error) {
        console.error("Error creating booking:", error);
        res.status(500).json({ error: "Unable to create booking" });
    }
}));
//User route
router.delete("/:id", middleware_1.authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const bookingId = req.params.id;
    if (!bookingId) {
        res.status(400).json({ error: "Booking ID is required" });
        return;
    }
    try {
        const deletedBooking = yield prisma.booking.delete({
            where: { id: bookingId },
        });
        res.status(200).json({
            message: "Booking deleted successfully",
            booking: deletedBooking,
        });
    }
    catch (error) {
        console.error("Error deleting booking:", error);
        res.status(500).json({ error: "Unable to delete booking" });
    }
}));
exports.default = router;
