import { Router } from "express";
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

router.get("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const screens = await prisma.screen.findMany();
    res.status(200).json(screens);
  } catch (error) {
    console.error("Error fetching screens:", error);
    res.status(500).json({ error: "Unable to fetch screens" });
  }
});

router.get("/:id", async (req: Request, res: Response): Promise<void> => {
  const id = req.params.id;
  try {
    const screen = await prisma.screen.findUnique({
      where: { id },
    });
    res.status(200).json(screen);
  } catch (error) {
    console.error("Error fetching theaters:", error);
    res.status(500).json({ error: "Unable to fetch theaters" });
  }
});

router.post("/", async (req: Request, res: Response): Promise<void> => {
  const { name, theaterId, capacity } = req.body;
  try {
    const screen = await prisma.screen.create({
      data: { name, theaterId, capacity },
    });
    res.status(201).json({ message: "Screen created successfully", screen });
  } catch (error) {
    console.error("Error creating screen:", error);
    res.status(500).json({ error: "Unable to create screen" });
  }
});

router.put("/:id", async (req: Request, res: Response): Promise<void> => {
  const id = req.params.id;
  if (!id) {
    res.status(400).json({ error: "Screen ID is required" });
    return;
  }
  const { name, theaterId, capacity } = req.body;
  try {
    const updateScreen = await prisma.screen.update({
      where: { id },
      data: { name, theaterId, capacity },
    });
    res
      .status(200)
      .json({ message: "Screen updated successfully", screen: updateScreen });
  } catch (error) {
    console.error("Error updating screen:", error);
    res.status(500).json({ error: "Unable to update screen" });
  }
});

router.delete("/:id", async (req: Request, res: Response): Promise<void> => {
  const id = req.params.id;
  if (!id) {
    res.status(400).json({ error: "Screen ID is required" });
    return;
  }
  try {
    const deletedScreen = await prisma.screen.delete({
      where: { id },
    });
    res
      .status(200)
      .json({ message: "Screen deleted successfully", screen: deletedScreen });
  } catch (error) {
    console.error("Error deleting screen:", error);
    res.status(500).json({ error: "Unable to delete screen" });
  }
});

export default router;
