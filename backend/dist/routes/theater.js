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
//public route
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const theaters = yield prisma.theater.findMany();
        res.status(200).json(theaters);
    }
    catch (error) {
        console.error("Error fetching theaters:", error);
        res.status(500).json({ error: "Unable to fetch theaters" });
    }
}));
//public route
router.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const theater = yield prisma.theater.findUnique({
            where: { id },
        });
        console.log("Theater fetched:", theater);
        res.status(200).json({ message: "Theater fetched successfully", theater });
    }
    catch (error) {
        console.error("Error fetching theater:", error);
        res.status(500).json({ error: "Unable to fetch theater" });
    }
}));
// Admin route
router.post("/", middleware_1.authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //@ts-ignore
    const userRole = req.role;
    const { name, location } = req.body;
    try {
        if (userRole !== "ADMIN") {
            res.status(403).json({ message: "Access denied. Admins only." });
            return;
        }
        const theater = yield prisma.theater.create({
            data: { name, location },
        });
        res
            .status(201)
            .json({ message: "Theater created successfully", theater });
    }
    catch (error) {
        console.error("Error creating theater:", error);
        res.status(500).json({ error: "Unable to create theater" });
    }
}));
// Admin route
router.delete("/:id", middleware_1.authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    //@ts-ignore
    const userRole = req.role;
    try {
        if (userRole !== "ADMIN") {
            res.status(403).json({ message: "Access denied. Admins only." });
            return;
        }
        const deletedTheater = yield prisma.theater.delete({
            where: { id },
        });
        res.status(200).json({
            message: "Theater deleted successfully",
            theater: deletedTheater,
        });
    }
    catch (error) {
        console.error("Error deleting theater:", error);
        res.status(500).json({ error: "Unable to delete theater" });
    }
}));
exports.default = router;
