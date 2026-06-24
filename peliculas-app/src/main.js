import { getMovies, getGenres } from './api/moviesApi.js'
import {
  setMovies,
  setGenres,
  renderMovies,
  renderGenres,
  llenarSelectGeneros,
  inicializarListeners
} from './ui/moviesUI.js'

async function inicializarApp() {
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
    console.error('Error al inicializar la aplicación:', error)
  }
}

inicializarApp()