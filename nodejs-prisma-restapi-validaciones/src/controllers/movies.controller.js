import { prisma } from "../db.js";
import asyncHandler from "../utils/asyncHandler.js";
import { genreNotFound, movieNotFound, movieAlreadyExists } from "../utils/movieErrors.js";

// GET /api/movies
export const getMovies = asyncHandler(async (req, res) => {
  const movies = await prisma.movie.findMany({
    include: { genre: true },
  });
  res.json(movies);
});

// GET /api/movies/:id
export const getMovieById = asyncHandler(async (req, res, next) => {
  const movie = await prisma.movie.findUnique({
    where: { id: Number(req.params.id) },
    include: { genre: true },
  });

  if (!movie) {
    return next(movieNotFound(req.params.id));
  }

  res.json(movie);
});

// POST /api/movies
export const createMovie = asyncHandler(async (req, res, next) => {
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

  try {
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
      return next(movieAlreadyExists(title));
    }
    throw error;
  }
});

// PATCH /api/movies/:id
export const updateMovie = asyncHandler(async (req, res, next) => {
  const { genreId } = req.body;

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

  try {
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
    throw error;
  }
});

// DELETE /api/movies/:id
export const deleteMovie = asyncHandler(async (req, res, next) => {
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
});