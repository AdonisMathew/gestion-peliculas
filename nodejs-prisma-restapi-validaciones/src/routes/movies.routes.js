import { Router } from "express";
import validateFields from "../middlewares/validateFields.js";
import {
  createMovieValidators,
  updateMovieValidators,
  validateMovieId,
} from "../validators/movie.validators.js";
import {
  getMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie,
} from "../controllers/movies.controller.js";

const router = Router();

router.get("/movies", getMovies);
router.post("/movies", createMovieValidators, validateFields, createMovie);
router.get("/movies/:id", validateMovieId, validateFields, getMovieById);
router.patch("/movies/:id", updateMovieValidators, validateFields, updateMovie);
router.delete("/movies/:id", validateMovieId, validateFields, deleteMovie);

export default router;