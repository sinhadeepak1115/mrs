import { Router } from "express";
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

router.get("/", async (req: Request, res: Response) => {
  try {
    const show = await prisma.show.findMany();
    res.status(200).json(show);
  } catch (error) {
    console.error("Error fetching show:", error);
    res.status(500).json({ error: "Erro getting show " });
  }
});

router.get("/id", async (req: Request, res: Response) => {
  const id = req.params.id;
  if (!id) {
    res.status(400).json({ error: "Show ID is required" });
    return;
  }
  try {
    const show = await prisma.show.findUnique({
      where: { id },
    });
    res.status(200).json({ message: "Show fetched successfully", show });
  } catch (error) {
    console.error("Error fetching show by ID:", error);
    res.status(500).json({ error: "Error getting show by ID" });
  }
});

router.post("/", async (req: Request, res: Response) => {
  const { movieId, screenId, price, startTime } = req.body;
  try {
    const show = await prisma.show.create({
      data: { movieId, screenId, price, startTime },
    });
    res.status(201).json({ message: "Show fetched successfully", show });
  } catch (error) {
    console.error("Error creating show", error);
    res.status(500).json({ error: "Error getting show by ID" });
  }
});

router.put("/id", async (req: Request, res: Response) => {
  const id = req.params.id;
  const { movieId, screenId, price, startTime } = req.body;
  if (!id) {
    res.status(400).json({ error: "Show ID is required" });
    return;
  }
  try {
    const show = await prisma.show.update({
      where: { id },
      data: { movieId, screenId, price, startTime },
    });
    res.status(200).json({ message: "Show updated successfully", show });
  } catch (error) {
    console.error("Error updateing show by ID:", error);
    res.status(500).json({ error: "Error getting show by ID" });
  }
});

router.delete("/id", async (req: Request, res: Response) => {
  const id = req.params.id;
  if (!id) {
    res.status(400).json({ error: "Show ID is required" });
    return;
  }
  try {
    const deletedShow = await prisma.show.delete({
      where: { id },
    });
    res
      .status(204)
      .json({ message: "Show deleted successfully", show: deletedShow });
  } catch (error) {
    console.error("Error deleting show by ID:", error);
    res.status(500).json({ error: "Error deleting show by ID" });
  }
});

export default router;
