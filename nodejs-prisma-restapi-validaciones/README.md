# Gestión de Películas — Backend

API REST para gestionar películas, géneros, usuarios y órdenes.

## Tecnologías

- Node.js
- Express
- Prisma ORM
- MySQL

## Instalación

1. Clonar el repositorio
2. Instalar dependencias:
```bash
   npm install
```
3. Crear el archivo `.env` basándose en `.env.example` y completar las credenciales de MySQL
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

Crea géneros, películas, un usuario, una orden y sus items asociados.

## Modelo de datos

### Entidades

- **Genre**: id, name
- **Movie**: id, title, director, year, duration, genreId, createdAt
- **User**: id, name, email, createdAt
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

## Endpoints

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