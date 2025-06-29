import { Router } from "express";
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { authenticate } from "../middleware";

const router = Router();
const prisma = new PrismaClient();

router.get(
  "/",
  authenticate,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const movies = await prisma.movie.findMany();
      if (!movies || movies.length === 0) {
        res.status(404).json({ error: "No movies found" });
      }
      res.status(200).json(movies);
    } catch (error) {
      console.error("Error fetching movies:", error);
      res.status(500).json({ error: "Unable to fetch movies" });
    }
  },
);

router.get("/:id", async (req: Request, res: Response): Promise<void> => {
  const id = req.params.id;
  try {
    if (!id) {
      res.status(400).json({ error: "Movie ID is required" });
    }
    const movie = await prisma.movie.findUnique({
      where: { id },
    });
    console.log("Movie fetched:", movie);
    res.status(200).json({ message: "Movie fetched successfully", movie });
  } catch (error) {
    console.error("Error fetching movie:", error);
    res.status(500).json({ error: "Unable to fetch movie" });
  }
});

//TODO: add Admin logic
router.post("/", async (req: Request, res: Response): Promise<void> => {
  const { title, genre, time, language } = req.body;
  try {
    const createdMovie = await prisma.movie.create({
      data: { title, genre, time, language },
    });
    res
      .status(201)
      .json({ message: "Movie created successfully", movie: createdMovie });
  } catch (error) {
    console.error("Error creating movie:", error);
    res.status(500).json({ error: "Unable to create movie" });
  }
});

//TODO: add Admin logic
router.put("/:id", async (req: Request, res: Response): Promise<void> => {
  const id = req.params.id;
  const { title, genre, time, language } = req.body;
  try {
    const updatedMovie = await prisma.movie.update({
      where: { id },
      data: { title, genre, time, language },
    });
    res
      .status(200)
      .json({ message: "Movie updated successfully", movie: updatedMovie });
  } catch (error) {
    console.error("Error updating movie:", error);
    res.status(500).json({ error: "Unable to update movie" });
  }
});

//TODO: add Admin logic
router.delete("/:id", async (req: Request, res: Response): Promise<void> => {
  const id = req.params.id;
  try {
    const deletedMovie = await prisma.movie.delete({
      where: { id },
    });
    console.log("Movie deleted:", deletedMovie);
    res
      .status(200)
      .json({ message: "Movie deleted successfully", movie: deletedMovie });
  } catch (error) {
    console.error("Error deleting movie:", error);
    res.status(500).json({ error: "Unable to delete movie" });
  }
});

export default router;
