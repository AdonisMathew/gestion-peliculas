/**
 * Envuelve una función async de Express para capturar errores automáticamente
 * y pasarlos a next(), sin necesidad de escribir try/catch en cada ruta.
 *
 * Ejemplo:
 * router.get("/movies", asyncHandler(async (req, res) => {
 *   const movies = await prisma.movie.findMany();
 *   res.json(movies);
 * }));
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncHandler;