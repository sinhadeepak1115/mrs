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
        const movies = yield prisma.movie.findMany();
        if (!movies || movies.length === 0) {
            res.status(404).json({ error: "No movies found" });
        }
        res.status(200).json(movies);
    }
    catch (error) {
        console.error("Error fetching movies:", error);
        res.status(500).json({ error: "Unable to fetch movies" });
    }
}));
router.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        if (!id) {
            res.status(400).json({ error: "Movie ID is required" });
        }
        const movie = yield prisma.movie.findUnique({
            where: { id },
        });
        console.log("Movie fetched:", movie);
        res.status(200).json({ message: "Movie fetched successfully", movie });
    }
    catch (error) {
        console.error("Error fetching movie:", error);
        res.status(500).json({ error: "Unable to fetch movie" });
    }
}));
//TODO: add Admin logic
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, genre, time, language } = req.body;
    try {
        const createdMovie = yield prisma.movie.create({
            data: { title, genre, time, language },
        });
        res
            .status(201)
            .json({ message: "Movie created successfully", movie: createdMovie });
    }
    catch (error) {
        console.error("Error creating movie:", error);
        res.status(500).json({ error: "Unable to create movie" });
    }
}));
//TODO: add Admin logic
router.put("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const { title, genre, time, language } = req.body;
    try {
        const updatedMovie = yield prisma.movie.update({
            where: { id },
            data: { title, genre, time, language },
        });
        res
            .status(200)
            .json({ message: "Movie updated successfully", movie: updatedMovie });
    }
    catch (error) {
        console.error("Error updating movie:", error);
        res.status(500).json({ error: "Unable to update movie" });
    }
}));
//TODO: add Admin logic
router.delete("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const deletedMovie = yield prisma.movie.delete({
            where: { id },
        });
        console.log("Movie deleted:", deletedMovie);
        res
            .status(200)
            .json({ message: "Movie deleted successfully", movie: deletedMovie });
    }
    catch (error) {
        console.error("Error deleting movie:", error);
        res.status(500).json({ error: "Unable to delete movie" });
    }
}));
exports.default = router;
