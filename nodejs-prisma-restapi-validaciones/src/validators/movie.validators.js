import { body, param } from "express-validator";
import { prisma } from "../db.js";

const checkGenreExists = async (genreId) => {
  const genre = await prisma.genre.findUnique({
    where: { id: Number(genreId) },
  });

  if (!genre) {
    throw new Error(`El género con id ${genreId} no existe`);
  }
};

const checkMovieTitleExists = async (title, req) => {
  const movie = await prisma.movie.findUnique({
    where: { title },
  });

  if (movie && movie.id !== Number(req?.params?.id)) {
    throw new Error(`La película '${title}' ya existe`);
  }
};

export const validateMovieId = [
  param("id")
    .isInt({ gt: 0 })
    .withMessage("El id de la película debe ser un número entero positivo")
    .toInt(),
];

export const createMovieValidators = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("El título es obligatorio")
    .bail()
    .isLength({ min: 1, max: 200 })
    .withMessage("El título debe tener entre 1 y 200 caracteres")
    .bail()
    .custom(async (title, { req }) => {
      await checkMovieTitleExists(title, req);
    }),

  body("director")
    .trim()
    .notEmpty()
    .withMessage("El director es obligatorio")
    .bail()
    .isLength({ min: 2, max: 100 })
    .withMessage("El director debe tener entre 2 y 100 caracteres"),

  body("year")
    .notEmpty()
    .withMessage("El año es obligatorio")
    .bail()
    .isInt({ min: 1888, max: new Date().getFullYear() })
    .withMessage(`El año debe ser un número entre 1888 y ${new Date().getFullYear()}`)
    .bail()
    .toInt(),

  body("duration")
    .notEmpty()
    .withMessage("La duración es obligatoria")
    .bail()
    .isInt({ min: 1 })
    .withMessage("La duración debe ser un número entero positivo en minutos")
    .bail()
    .toInt(),

  body("genreId")
    .notEmpty()
    .withMessage("El género es obligatorio")
    .bail()
    .isInt({ gt: 0 })
    .withMessage("El género debe ser un id numérico positivo")
    .bail()
    .toInt()
    .custom(async (genreId) => {
      await checkGenreExists(genreId);
    }),
];

export const updateMovieValidators = [
  param("id")
    .isInt({ gt: 0 })
    .withMessage("El id de la película debe ser un número entero positivo")
    .toInt(),

  body("title")
    .optional()
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage("El título debe tener entre 1 y 200 caracteres")
    .bail()
    .custom(async (title, { req }) => {
      await checkMovieTitleExists(title, req);
    }),

  body("director")
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("El director debe tener entre 2 y 100 caracteres"),

  body("year")
    .optional()
    .isInt({ min: 1888, max: new Date().getFullYear() })
    .withMessage(`El año debe ser un número entre 1888 y ${new Date().getFullYear()}`)
    .bail()
    .toInt(),

  body("duration")
    .optional()
    .isInt({ min: 1 })
    .withMessage("La duración debe ser un número entero positivo en minutos")
    .bail()
    .toInt(),

  body("genreId")
    .optional()
    .isInt({ gt: 0 })
    .withMessage("El género debe ser un id numérico positivo")
    .bail()
    .toInt()
    .custom(async (genreId) => {
      await checkGenreExists(genreId);
    }),
];