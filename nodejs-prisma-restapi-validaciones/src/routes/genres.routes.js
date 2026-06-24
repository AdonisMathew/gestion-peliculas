import { Router } from "express";
import { prisma } from "../db.js";
import AppError from "../utils/AppError.js";

const router = Router();

// GET /api/genres — obtiene todos los géneros con sus películas
router.get("/genres", async (req, res, next) => {
  try {
    const genres = await prisma.genre.findMany({
      include: {
        movies: true,
      },
    });
    res.json(genres);
  } catch (error) {
    next(error);
  }
});

// POST /api/genres — crea un nuevo género
router.post("/genres", async (req, res, next) => {
  try {
    const { name } = req.body;

    if (!name || name.trim() === "") {
      return next(new AppError("El nombre del género es obligatorio", 400));
    }

    const existingGenre = await prisma.genre.findUnique({
      where: { name: name.trim() },
    });

    if (existingGenre) {
      return next(new AppError(`El género '${name}' ya existe`, 409));
    }

    const genre = await prisma.genre.create({
      data: { name: name.trim() },
    });

    res.status(201).json(genre);
  } catch (error) {
    if (error?.code === "P2002") {
      return next(new AppError(`El género '${req.body?.name}' ya existe`, 409));
    }
    next(error);
  }
});

// DELETE /api/genres/:id — elimina un género
router.delete("/genres/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return next(new AppError("El id del género debe ser un número entero positivo", 400));
    }

    const existingGenre = await prisma.genre.findUnique({
      where: { id },
    });

    if (!existingGenre) {
      return next(new AppError(`Género con id ${id} no existe`, 404));
    }

    await prisma.genre.delete({
      where: { id },
    });

    res.json({ message: `Género '${existingGenre.name}' eliminado correctamente` });
  } catch (error) {
    next(error);
  }
});

export default router;