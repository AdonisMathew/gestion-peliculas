Sprint 1 — CRUD Fullstack



Backend con Express + Prisma + MySQL

Modelos Movie y Genre con migración

API REST completa con 8 endpoints

Frontend con HTML, CSS y JavaScript Vanilla

Formularios para crear, editar y eliminar



Sprint 2 — Validaciones y errores



Validaciones con express-validator en el backend

Clases AppError, ValidationError y NotFoundError

Validaciones en el frontend antes de enviar al backend

Mensajes de éxito y error visibles al usuario

Confirmación antes de eliminar



TP Integrador — Modelo extendido



Tres entidades nuevas: User, Order, OrderItem

Relación muchos a muchos entre Order y Movie resuelta con OrderItem

Migraciones aplicadas

Script seed.js que demuestra el funcionamiento completo

\--------------------------------------------------------------------------

routes/          → define endpoints y qué middlewares aplican

controllers/     → contiene la lógica de negocio

validators/      → reglas de validación

middlewares/     → validateFields, etc.

utils/           → AppError, asyncHandler, errores personalizados



\--------------------------------------------------------------------------

CONSULTAS:



\---Géneros---





\--Crear género

Método: POST

URL: http://localhost:3000/api/genres

Body JSON:

{

&#x20; "name": "Drama"

}





\--Obtener todos los géneros

Método: GET

URL: http://localhost:3000/api/genres





\--Eliminar género

Método: DELETE

URL: http://localhost:3000/api/genres/1







\---Películas---



\--Crear película

Método: POST

URL: http://localhost:3000/api/movies

Body JSON:

{

&#x20; "title": "Inception",

&#x20; "director": "Christopher Nolan",

&#x20; "year": 2010,

&#x20; "duration": 148,

&#x20; "genreId": 1

}







\--Obtener todas las películas

Método: GET

URL: http://localhost:3000/api/movies





\--Obtener película por ID

Método: GET

URL: http://localhost:3000/api/movies/1





\--Actualizar película

Método: PATCH

URL: http://localhost:3000/api/movies/1

Body JSON:

{

&#x20; "duration": 150

}





\--Eliminar película

Método: DELETE

URL: http://localhost:3000/api/movies/1





\---Casos de error — para verificar validaciones---



\--Crear película con campos vacíos

Método: POST

URL: http://localhost:3000/api/movies

Body JSON:

{

&#x20; "title": "",

&#x20; "director": "",

&#x20; "year": 1800,

&#x20; "duration": -5,

&#x20; "genreId": 9999

}



Debería devolver 400 con mensajes de error.







\--Buscar película inexistente

Método: GET

URL: http://localhost:3000/api/movies/9999

Debería devolver 404.





\--Crear película duplicada

Método: POST

URL: http://localhost:3000/api/movies

Body JSON:

{

&#x20; "title": "Inception",

&#x20; "director": "Christopher Nolan",

&#x20; "year": 2010,

&#x20; "duration": 148,

&#x20; "genreId": 1

}



Debería devolver 409.







\--Género inexistente

Método: POST

URL: http://localhost:3000/api/movies

Body JSON:

{

&#x20; "title": "Otra película",

&#x20; "director": "Algún director",

&#x20; "year": 2020,

&#x20; "duration": 120,

&#x20; "genreId": 9999

}



Debería devolver 400 con "El género con id 9999 no existe".

