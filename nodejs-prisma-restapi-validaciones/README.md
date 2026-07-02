# Gestión de Películas — Backend

API REST para gestionar películas, géneros, usuarios y órdenes, con autenticación mediante JWT.

## Tecnologías

- Node.js
- Express
- Prisma ORM
- MySQL
- bcrypt (encriptación de contraseñas)
- jsonwebtoken (autenticación)

## Instalación

1. Clonar el repositorio
2. Instalar dependencias:
```bash
   npm install
```
3. Crear el archivo `.env` basándose en `.env.example` y completar:
   - Credenciales de MySQL
   - `JWT_SECRET` (una clave secreta larga y aleatoria)
4. Ejecutar las migraciones:
```bash
   npx prisma migrate dev
```
5. Generar el cliente de Prisma:
```bash
   npm run prisma:generate
```

## Ejecución

```bash
npm run dev
```

El servidor queda disponible en `http://localhost:3000`.

## Seed

Para poblar la base de datos con datos de prueba:

```bash
node seed.js
```

Crea géneros y películas de ejemplo.

## Arquitectura

El proyecto sigue el patrón MVC (Model-View-Controller), separando responsabilidades:

src/
├── routes/         # Define endpoints y qué middlewares aplican
├── controllers/     # Contiene la lógica de negocio de cada endpoint
├── validators/       # Reglas de validación con express-validator
├── middlewares/     # validateFields y otros middlewares
├── utils/           # AppError, asyncHandler, errores personalizados
└── db.js            # Conexión a MySQL vía Prisma

`asyncHandler` envuelve los controladores async para capturar errores automáticamente y enviarlos al middleware de manejo de errores, evitando repetir try/catch en cada endpoint.

## Modelo de datos

### Entidades

- **Genre**: id, name
- **Movie**: id, title, director, year, duration, genreId, createdAt
- **User**: id, name, email, password, createdAt
- **Order**: id, userId, createdAt
- **OrderItem**: id, orderId, movieId

### Relaciones

- Un `Genre` puede tener muchas `Movie`
- Una `Movie` pertenece a un `Genre`
- Un `User` puede tener muchas `Order`
- Una `Order` pertenece a un `User`
- Una `Order` puede tener muchos `OrderItem`
- Un `OrderItem` pertenece a una `Order` y referencia a una `Movie`
- Una `Movie` puede aparecer en muchos `OrderItem`

Genre  1──N  Movie  1──N  OrderItem  N──1  Order  N──1  User

## Autenticación

El sistema usa JWT (JSON Web Tokens) para manejar sesiones de usuario.

- Las contraseñas se encriptan con `bcrypt` antes de guardarse.
- Al iniciar sesión, el servidor genera un token válido por 2 horas.
- El token contiene el `id` y `email` del usuario.

## Endpoints

### Autenticación

| Método | Ruta | Descripción |
|---|---|---|
| POST | /api/auth/register | Registrar un nuevo usuario |
| POST | /api/auth/login | Iniciar sesión y obtener un token |

### Géneros

| Método | Ruta | Descripción |
|---|---|---|
| GET | /api/genres | Obtener todos los géneros |
| POST | /api/genres | Crear un género |
| DELETE | /api/genres/:id | Eliminar un género |

### Películas

| Método | Ruta | Descripción |
|---|---|---|
| GET | /api/movies | Obtener todas las películas |
| GET | /api/movies/:id | Obtener una película por ID |
| POST | /api/movies | Crear una película |
| PATCH | /api/movies/:id | Actualizar una película |
| DELETE | /api/movies/:id | Eliminar una película |