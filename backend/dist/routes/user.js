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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
router.post("/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield prisma.user.findUnique({ where: { email, password } });
        if (!user) {
            res.status(404).json({ error: "User not found" });
            return;
        }
        if (user.password !== password) {
            res.status(401).json({ error: "Invalid password" });
            return;
        }
        //TODO: Add jwt logic
        const token = jsonwebtoken_1.default.sign({ id: user === null || user === void 0 ? void 0 : user.id, role: user === null || user === void 0 ? void 0 : user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });
        res
            .status(200)
            .json({ message: "User signed in successfully!", user, token });
    }
    catch (error) {
        console.error("Error during sign-in:", error);
        res.status(500).json({ error: "Unable to signin" });
    }
}));
router.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, name, role = "USER" } = req.body;
    try {
        const existingUser = yield prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            res.status(409).json({ error: "User already exists" });
        }
        const user = yield prisma.user.create({
            data: { email, password, name, role },
        });
        res.status(200).json({ message: "User signed in successfully!", user });
    }
    catch (error) {
        console.error("Error during sign-up:", error);
        res.status(500).json({ error: "Unable to signup" });
    }
}));
//to be removed
//add admin logic
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield prisma.user.findMany();
        res.status(200).json(users);
    }
    catch (error) {
        console.error("Error fetching users:", error);
    }
}));
exports.default = router;
