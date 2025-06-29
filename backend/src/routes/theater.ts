import { Router } from "express";
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { authenticate } from "../middleware";

const router = Router();
const prisma = new PrismaClient();

//public route
router.get("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const theaters = await prisma.theater.findMany();
    res.status(200).json(theaters);
  } catch (error) {
    console.error("Error fetching theaters:", error);
    res.status(500).json({ error: "Unable to fetch theaters" });
  }
});

//public route
router.get("/:id", async (req: Request, res: Response): Promise<void> => {
  const id = req.params.id;
  try {
    const theater = await prisma.theater.findUnique({
      where: { id },
    });
    console.log("Theater fetched:", theater);
    res.status(200).json({ message: "Theater fetched successfully", theater });
  } catch (error) {
    console.error("Error fetching theater:", error);
    res.status(500).json({ error: "Unable to fetch theater" });
  }
});

// Admin route
router.post(
  "/",
  authenticate,
  async (req: Request, res: Response): Promise<void> => {
    //@ts-ignore
    const userRole = req.role;
    const { name, location } = req.body;
    try {
      if (userRole !== "ADMIN") {
        res.status(403).json({ message: "Access denied. Admins only." });
        return;
      }
      const theater = await prisma.theater.create({
        data: { name, location },
      });
      res
        .status(201)
        .json({ message: "Theater created successfully", theater });
    } catch (error) {
      console.error("Error creating theater:", error);
      res.status(500).json({ error: "Unable to create theater" });
    }
  },
);

// Admin route
router.delete(
  "/:id",
  authenticate,
  async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id;
    //@ts-ignore
    const userRole = req.role;
    try {
      if (userRole !== "ADMIN") {
        res.status(403).json({ message: "Access denied. Admins only." });
        return;
      }
      const deletedTheater = await prisma.theater.delete({
        where: { id },
      });

      res.status(200).json({
        message: "Theater deleted successfully",
        theater: deletedTheater,
      });
    } catch (error) {
      console.error("Error deleting theater:", error);
      res.status(500).json({ error: "Unable to delete theater" });
    }
  },
);

export default router;
