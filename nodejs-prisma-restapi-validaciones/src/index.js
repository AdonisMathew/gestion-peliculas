import express from "express";
import movieRoutes from "./routes/movies.routes.js";
import genreRoutes from "./routes/genres.routes.js";
import cors from "cors";
import { prisma } from "./db.js";

const app = express();
let server;

app.use(cors());
app.use(express.json());

app.use("/api", movieRoutes);
app.use("/api", genreRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.statusCode || 500).json({
    error: err.message || "Error interno del servidor",
  });
});

async function shutdown(signal) {
  if (server) {
    await new Promise((resolve) => server.close(resolve));
  }
  await prisma.$disconnect();
  if (signal === "SIGUSR2") {
    process.kill(process.pid, signal);
    return;
  }
  process.exit(0);
}

process.once("SIGINT", () => void shutdown("SIGINT"));
process.once("SIGTERM", () => void shutdown("SIGTERM"));
process.once("SIGUSR2", () => void shutdown("SIGUSR2"));

async function start() {
  await prisma.$connect();
  server = app.listen(3000, () => {
    console.log("Servidor escuchando en http://localhost:3000");
  });
}

start().catch((error) => {
  console.error(error);
  process.exit(1);
});