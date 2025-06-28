import { Router } from "express";
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

router.get("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const theaters = await prisma.theater.findMany();
    res.status(200).json(theaters);
  } catch (error) {
    console.error("Error fetching theaters:", error);
    res.status(500).json({ error: "Unable to fetch theaters" });
  }
});

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

router.post("/", async (req: Request, res: Response): Promise<void> => {
  const { name, location } = req.body;
  try {
    const theater = await prisma.theater.create({
      data: { name, location },
    });
    res.status(201).json({ message: "Theater created successfully", theater });
  } catch (error) {
    console.error("Error creating theater:", error);
    res.status(500).json({ error: "Unable to create theater" });
  }
});

router.delete("/:id", async (req: Request, res: Response): Promise<void> => {
  const id = req.params.id;
  try {
    const deletedTheater = await prisma.theater.delete({
      where: { id },
    });
    res
      .status(200)
      .json({
        message: "Theater deleted successfully",
        theater: deletedTheater,
      });
  } catch (error) {
    console.error("Error deleting theater:", error);
    res.status(500).json({ error: "Unable to delete theater" });
  }
});

export default router;
