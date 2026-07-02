import { Router } from "express";
import { getGenres, createGenre, deleteGenre } from "../controllers/genres.controller.js";

const router = Router();

router.get("/genres", getGenres);
router.post("/genres", createGenre);
router.delete("/genres/:id", deleteGenre);

export default router;