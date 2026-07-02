import { getMovies, getGenres } from './api/moviesApi.js'
import {
  setMovies,
  setGenres,
  renderMovies,
  renderGenres,
  llenarSelectGeneros,
  inicializarListeners
} from './ui/moviesUI.js'
import {
  obtenerSesion,
  mostrarApp,
  mostrarAuth,
  inicializarAuthListeners
} from './ui/authUI.js'

async function cargarDatosApp() {
  try {
    const genres = await getGenres()
    setGenres(genres)
    renderGenres()
    llenarSelectGeneros()

    const movies = await getMovies()
    setMovies(movies)
    renderMovies()

    inicializarListeners()
  } catch (error) {
    console.error('Error al cargar datos de la app:', error)
  }
}

function iniciarSesionExitosa(user) {
  mostrarApp(user)
  cargarDatosApp()
}

function inicializarApp() {
  inicializarAuthListeners(iniciarSesionExitosa)

  const sesion = obtenerSesion()

  if (sesion) {
    mostrarApp(sesion.user)
    cargarDatosApp()
  } else {
    mostrarAuth()
  }
}

inicializarApp()