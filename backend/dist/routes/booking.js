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
router.get("/", middleware_1.authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //@ts-ignore
    const userId = req.userId;
    if (!userId) {
        res.status(400).json({ error: "User ID is required" });
        return;
    }
    try {
        const allBookings = yield prisma.booking.findMany({
            where: { userId: userId },
        });
        console.log("Bookings fetched:", allBookings);
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
exports.default = router;
