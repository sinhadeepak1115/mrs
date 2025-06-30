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
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const screens = yield prisma.screen.findMany();
        res.status(200).json(screens);
    }
    catch (error) {
        console.error("Error fetching screens:", error);
        res.status(500).json({ error: "Unable to fetch screens" });
    }
}));
router.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const screen = yield prisma.screen.findUnique({
            where: { id },
        });
        res.status(200).json(screen);
    }
    catch (error) {
        console.error("Error fetching theaters:", error);
        res.status(500).json({ error: "Unable to fetch theaters" });
    }
}));
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, theaterId, capacity } = req.body;
    try {
        const screen = yield prisma.screen.create({
            data: { name, theaterId, capacity },
        });
        res.status(201).json({ message: "Screen created successfully", screen });
    }
    catch (error) {
        console.error("Error creating screen:", error);
        res.status(500).json({ error: "Unable to create screen" });
    }
}));
router.put("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    if (!id) {
        res.status(400).json({ error: "Screen ID is required" });
        return;
    }
    const { name, theaterId, capacity } = req.body;
    try {
        const updateScreen = yield prisma.screen.update({
            where: { id },
            data: { name, theaterId, capacity },
        });
        res
            .status(200)
            .json({ message: "Screen updated successfully", screen: updateScreen });
    }
    catch (error) {
        console.error("Error updating screen:", error);
        res.status(500).json({ error: "Unable to update screen" });
    }
}));
router.delete("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    if (!id) {
        res.status(400).json({ error: "Screen ID is required" });
        return;
    }
    try {
        const deletedScreen = yield prisma.screen.delete({
            where: { id },
        });
        res
            .status(200)
            .json({ message: "Screen deleted successfully", screen: deletedScreen });
    }
    catch (error) {
        console.error("Error deleting screen:", error);
        res.status(500).json({ error: "Unable to delete screen" });
    }
}));
exports.default = router;
