import { Router } from "express";
import { prisma } from "../db.js";
import validateFields from "../middlewares/validateFields.js";
import AppError from "../utils/AppError.js";
import { genreNotFound, movieNotFound, movieAlreadyExists } from "../utils/movieErrors.js";
import {
  createMovieValidators,
  updateMovieValidators,
  validateMovieId,
} from "../validators/movie.validators.js";

const router = Router();

// GET /api/movies — obtiene todas las películas con su género
router.get("/movies", async (req, res, next) => {
  try {
    const movies = await prisma.movie.findMany({
      include: {
        genre: true,
      },
    });
    res.json(movies);
  } catch (error) {
    next(error);
  }
});

// POST /api/movies — crea una nueva película
router.post("/movies", createMovieValidators, validateFields, async (req, res, next) => {
  try {
    const { title, director, year, duration, genreId } = req.body;

    const genre = await prisma.genre.findUnique({
      where: { id: Number(genreId) },
    });

    if (!genre) {
      return next(genreNotFound(genreId));
    }

    const existingMovie = await prisma.movie.findUnique({
      where: { title },
    });

    if (existingMovie) {
      return next(movieAlreadyExists(title));
    }

    const movie = await prisma.movie.create({
      data: {
        title,
        director,
        year: Number(year),
        duration: Number(duration),
        genreId: Number(genreId),
      },
    });

    res.status(201).json(movie);
  } catch (error) {
    if (error?.code === "P2002") {
      return next(movieAlreadyExists(req.body?.title || ""));
    }
    next(error);
  }
});

// GET /api/movies/:id — obtiene una película por ID
router.get("/movies/:id", validateMovieId, validateFields, async (req, res, next) => {
  try {
    const movie = await prisma.movie.findUnique({
      where: { id: Number(req.params.id) },
      include: { genre: true },
    });

    if (!movie) {
      return next(movieNotFound(req.params.id));
    }

    res.json(movie);
  } catch (error) {
    next(error);
  }
});

// PATCH /api/movies/:id — actualiza una película parcialmente
router.patch("/movies/:id", updateMovieValidators, validateFields, async (req, res, next) => {
  try {
    const { title, director, year, duration, genreId } = req.body;

    const existingMovie = await prisma.movie.findUnique({
      where: { id: Number(req.params.id) },
    });

    if (!existingMovie) {
      return next(movieNotFound(req.params.id));
    }

    if (genreId != null) {
      const genre = await prisma.genre.findUnique({
        where: { id: Number(genreId) },
      });

      if (!genre) {
        return next(genreNotFound(genreId));
      }
    }

    const movie = await prisma.movie.update({
      where: { id: Number(req.params.id) },
      data: req.body,
      include: { genre: true },
    });

    res.json(movie);
  } catch (error) {
    if (error?.code === "P2002") {
      return next(movieAlreadyExists(req.body?.title || ""));
    }
    next(error);
  }
});

// DELETE /api/movies/:id — elimina una película
router.delete("/movies/:id", validateMovieId, validateFields, async (req, res, next) => {
  try {
    const existingMovie = await prisma.movie.findUnique({
      where: { id: Number(req.params.id) },
    });

    if (!existingMovie) {
      return next(movieNotFound(req.params.id));
    }

    const movie = await prisma.movie.delete({
      where: { id: Number(req.params.id) },
    });

    res.json({ message: `Película '${movie.title}' eliminada correctamente` });
  } catch (error) {
    next(error);
  }
});

export default router;