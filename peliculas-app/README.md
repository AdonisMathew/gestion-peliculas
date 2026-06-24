# Gestión de Películas — Frontend

Interfaz web para el sistema de gestión de películas.

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

## Funcionalidades

- Listar, crear, editar y eliminar películas
- Listar, crear y eliminar géneros
- Validación de formularios del lado del cliente
- Mensajes de éxito y error
- Confirmación antes de eliminar

## Estructura

src/

├── api/

│   └── moviesApi.js        # Comunicación con el backend

├── ui/

│   └── moviesUI.js         # Manipulación del DOM

├── utils/

│   └── validaciones.js     # Validaciones del formulario

├── main.js                 # Punto de entrada

└── style.css               # Estilos

## Requisitos

El backend debe estar corriendo en `http://localhost:3000` antes de iniciar el frontend.