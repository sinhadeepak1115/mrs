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
        const show = yield prisma.show.findMany();
        res.status(200).json(show);
    }
    catch (error) {
        console.error("Error fetching show:", error);
        res.status(500).json({ error: "Erro getting show " });
    }
}));
router.get("/id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    if (!id) {
        res.status(400).json({ error: "Show ID is required" });
        return;
    }
    try {
        const show = yield prisma.show.findUnique({
            where: { id },
        });
        res.status(200).json({ message: "Show fetched successfully", show });
    }
    catch (error) {
        console.error("Error fetching show by ID:", error);
        res.status(500).json({ error: "Error getting show by ID" });
    }
}));
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { movieId, screenId, price, startTime } = req.body;
    try {
        const show = yield prisma.show.create({
            data: { movieId, screenId, price, startTime },
        });
        res.status(201).json({ message: "Show fetched successfully", show });
    }
    catch (error) {
        console.error("Error creating show", error);
        res.status(500).json({ error: "Error getting show by ID" });
    }
}));
router.put("/id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const { movieId, screenId, price, startTime } = req.body;
    if (!id) {
        res.status(400).json({ error: "Show ID is required" });
        return;
    }
    try {
        const show = yield prisma.show.update({
            where: { id },
            data: { movieId, screenId, price, startTime },
        });
        res.status(200).json({ message: "Show updated successfully", show });
    }
    catch (error) {
        console.error("Error updateing show by ID:", error);
        res.status(500).json({ error: "Error getting show by ID" });
    }
}));
router.delete("/id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    if (!id) {
        res.status(400).json({ error: "Show ID is required" });
        return;
    }
    try {
        const deletedShow = yield prisma.show.delete({
            where: { id },
        });
        res
            .status(204)
            .json({ message: "Show deleted successfully", show: deletedShow });
    }
    catch (error) {
        console.error("Error deleting show by ID:", error);
        res.status(500).json({ error: "Error deleting show by ID" });
    }
}));
exports.default = router;
