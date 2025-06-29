import { Router } from "express";
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const router = Router();

const prisma = new PrismaClient();

router.post("/signin", async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email, password } });
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    if (user.password !== password) {
      res.status(401).json({ error: "Invalid password" });
      return;
    }
    //TODO: Add jwt logic
    const token = jwt.sign(
      { id: user?.id, role: user?.role },
      process.env.JWT_SECRET!,
      { expiresIn: "1d" },
    );
    res
      .status(200)
      .json({ message: "User signed in successfully!", user, token });
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

//to be removed
//add admin logic
router.get("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
  }
});

export default router;
