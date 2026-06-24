import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import "dotenv/config";

const adapter = new PrismaMariaDb({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  allowPublicKeyRetrieval: true,
  connectionLimit: 5,
  ssl: false,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Iniciando seed...\n");

  // 1 — Crear géneros
  const scifi = await prisma.genre.upsert({
    where: { name: "Ciencia Ficción" },
    update: {},
    create: { name: "Ciencia Ficción" },
  });

  const accion = await prisma.genre.upsert({
    where: { name: "Acción" },
    update: {},
    create: { name: "Acción" },
  });

  console.log("Géneros creados:", scifi.name, "/", accion.name);

  // 2 — Crear películas
  const movie1 = await prisma.movie.upsert({
    where: { title: "Interstellar" },
    update: {},
    create: {
      title: "Interstellar",
      director: "Christopher Nolan",
      year: 2014,
      duration: 169,
      genreId: scifi.id,
    },
  });

  const movie2 = await prisma.movie.upsert({
    where: { title: "The Dark Knight" },
    update: {},
    create: {
      title: "The Dark Knight",
      director: "Christopher Nolan",
      year: 2008,
      duration: 152,
      genreId: accion.id,
    },
  });

  console.log("Películas creadas:", movie1.title, "/", movie2.title);

  // 3 — Crear usuario
  const user = await prisma.user.upsert({
    where: { email: "matias@email.com" },
    update: {},
    create: {
      name: "Matías",
      email: "matias@email.com",
    },
  });

  console.log("Usuario creado:", user.name, "-", user.email);

  // 4 — Crear orden con dos películas
  const order = await prisma.order.create({
    data: {
      userId: user.id,
      items: {
        create: [
          { movieId: movie1.id },
          { movieId: movie2.id },
        ],
      },
    },
  });

  console.log("Orden creada con id:", order.id);

  // 5 — Consulta completa
  const ordenCompleta = await prisma.order.findUnique({
    where: { id: order.id },
    include: {
      user: true,
      items: {
        include: {
          movie: {
            include: {
              genre: true,
            },
          },
        },
      },
    },
  });

  console.log("\n--- Consulta completa ---");
  console.log("Orden id:", ordenCompleta.id);
  console.log("Usuario:", ordenCompleta.user.name, "-", ordenCompleta.user.email);
  console.log("Películas en la orden:");
  ordenCompleta.items.forEach((item) => {
    console.log(
      ` - ${item.movie.title} (${item.movie.year}) | Género: ${item.movie.genre.name}`
    );
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });