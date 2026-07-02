import { prisma } from "../db.js";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";
import NotFoundError from "../utils/NotFoundError.js";
import ValidationError from "../utils/ValidationError.js";

// GET /api/genres
export const getGenres = asyncHandler(async (req, res) => {
  const genres = await prisma.genre.findMany({
    include: { movies: true },
  });
  res.json(genres);
});

// POST /api/genres
export const createGenre = asyncHandler(async (req, res, next) => {
  const { name } = req.body;

  if (!name || name.trim() === "") {
    return next(new ValidationError("El nombre del género es obligatorio"));
  }

  const existingGenre = await prisma.genre.findUnique({
    where: { name: name.trim() },
  });

  if (existingGenre) {
    return next(new ValidationError(`El género '${name}' ya existe`));
  }

  try {
    const genre = await prisma.genre.create({
      data: { name: name.trim() },
    });

    res.status(201).json(genre);
  } catch (error) {
    if (error?.code === "P2002") {
      return next(new ValidationError(`El género '${name}' ya existe`));
    }
    throw error;
  }
});

// DELETE /api/genres/:id
export const deleteGenre = asyncHandler(async (req, res, next) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return next(new ValidationError("El id del género debe ser un número entero positivo"));
  }

  const existingGenre = await prisma.genre.findUnique({
    where: { id },
  });

  if (!existingGenre) {
    return next(new NotFoundError(`Género con id ${id} no existe`));
  }

  await prisma.genre.delete({ where: { id } });

  res.json({ message: `Género '${existingGenre.name}' eliminado correctamente` });
});