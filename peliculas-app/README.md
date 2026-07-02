# Gestión de Películas — Frontend

Interfaz web para el sistema de gestión de películas, con inicio de sesión de usuarios.

## Tecnologías

- HTML
- CSS
- JavaScript Vanilla
- Vite

## Instalación

1. Instalar dependencias:
```bash
   npm install
```

## Ejecución

```bash
npm run dev
```

La aplicación queda disponible en `http://localhost:5173`.

El backend debe estar corriendo en `http://localhost:3000` antes de iniciar el frontend.

## Funcionalidades

- Registro e inicio de sesión de usuarios (con token JWT)
- Persistencia de sesión con `localStorage`
- Listar, crear, editar y eliminar películas
- Listar, crear y eliminar géneros
- Validación de formularios del lado del cliente
- Mensajes de éxito y error
- Confirmación antes de eliminar

## Autenticación

Al ingresar a la aplicación, se muestra una pantalla de inicio de sesión con dos pestañas: **Iniciar sesión** y **Registrarse**.

- Un usuario nuevo debe registrarse con nombre, email y contraseña (mínimo 6 caracteres).
- Al iniciar sesión, el backend devuelve un token JWT que se guarda en `localStorage` junto con los datos del usuario.
- Si ya existe una sesión guardada, la app se abre directamente sin pedir login otra vez.
- El botón "Cerrar sesión" borra los datos guardados y vuelve a la pantalla de login.

## Estructura

```
src/
├── api/
│   ├── authApi.js           # Comunicación con /api/auth
│   └── moviesApi.js         # Comunicación con /api/movies y /api/genres
├── ui/
│   ├── authUI.js             # Login, registro y manejo de sesión
│   └── moviesUI.js           # Manipulación del DOM de películas y géneros
├── utils/
│   └── validaciones.js       # Validaciones de formularios
├── main.js                   # Punto de entrada
└── style.css                 # Estilos
```