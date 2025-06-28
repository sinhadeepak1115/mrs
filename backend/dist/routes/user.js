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
router.post("/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield prisma.user.findUnique({ where: { email, password } });
        //TODO: Add jwt logic
        res.status(200).json({ message: "User signed in successfully!", user });
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
exports.default = router;
