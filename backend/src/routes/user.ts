import { Router } from "express";
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();

const prisma = new PrismaClient();

router.post("/signin", async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email, password } });
    //TODO: Add jwt logic
    res.status(200).json({ message: "User signed in successfully!", user });
  } catch (error) {
    console.error("Error during sign-in:", error);
    res.status(500).json({ error: "Unable to signin" });
  }
});

router.post("/signup", async (req, res): Promise<void> => {
  const { email, password, name, role = "USER" } = req.body;
  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      res.status(409).json({ error: "User already exists" });
    }
    const user = await prisma.user.create({
      data: { email, password, name, role },
    });

    res.status(200).json({ message: "User signed in successfully!", user });
  } catch (error) {
    console.error("Error during sign-up:", error);
    res.status(500).json({ error: "Unable to signup" });
  }
});

export default router;
