import NotFoundError from "./NotFoundError.js";
import ValidationError from "./ValidationError.js";

export const genreNotFound = (id) =>
  new NotFoundError(`Género con id ${id} no existe`);

export const movieNotFound = (id) =>
  new NotFoundError(`Película con id ${id} no existe`);

export const movieAlreadyExists = (title) =>
  new ValidationError(`La película '${title}' ya existe`);