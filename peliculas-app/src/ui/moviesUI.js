import { getMovieById, postMovie, updateMovie, deleteMovie, postGenre, deleteGenre } from '../api/moviesApi.js'
import { validarFormularioMovie, validarGenre } from '../utils/validaciones.js'

let movies = []
let genres = []

// Referencias al DOM
const tablaMovies = document.getElementById('tabla-peliculas')
const movieForm = document.getElementById('movie-form')
const genreForm = document.getElementById('genre-form')
const listaGeneros = document.getElementById('lista-generos')
const btnMovie = document.getElementById('btn-movie')
const btnCancelar = document.getElementById('btn-cancelar')
const editingIdInput = document.getElementById('editing-id')

// ── Helpers ───────────────────────────────────────────────

function mostrarMensaje(texto, tipo) {
  const mensaje = document.getElementById('mensaje')
  mensaje.textContent = texto
  mensaje.className = tipo
  setTimeout(() => {
    mensaje.className = ''
    mensaje.textContent = ''
  }, 3000)
}

function resetFormulario() {
  movieForm.reset()
  editingIdInput.value = ''
  btnMovie.textContent = 'Agregar Película'
  btnCancelar.style.display = 'none'
}

// ── Setters ───────────────────────────────────────────────

export function setMovies(data) {
  movies = data
}

export function setGenres(data) {
  genres = data
}

// ── Render películas ──────────────────────────────────────

export function renderMovies() {
  tablaMovies.innerHTML = ''

  if (movies.length === 0) {
    tablaMovies.innerHTML = '<tr><td colspan="6">No hay películas cargadas.</td></tr>'
    return
  }

  movies.forEach(movie => {
    const tr = document.createElement('tr')
    tr.innerHTML = `
      <td>${movie.title}</td>
      <td>${movie.director}</td>
      <td>${movie.year}</td>
      <td>${movie.duration} min</td>
      <td>${movie.genre?.name || '-'}</td>
      <td>
        <button class="edit-btn" data-id="${movie.id}" data-action="edit">Editar</button>
        <button class="delete-btn" data-id="${movie.id}" data-action="delete">Eliminar</button>
      </td>
    `
    tablaMovies.appendChild(tr)
  })
}

// ── Render géneros ────────────────────────────────────────

export function renderGenres() {
  listaGeneros.innerHTML = ''

  genres.forEach(genre => {
    const li = document.createElement('li')
    li.innerHTML = `
      ${genre.name}
      <button data-id="${genre.id}" data-action="delete-genre" title="Eliminar">✕</button>
    `
    listaGeneros.appendChild(li)
  })
}

export function llenarSelectGeneros() {
  const select = document.getElementById('movie-genre')
  const valorActual = select.value
  select.innerHTML = '<option value="">Seleccioná un género</option>'
  genres.forEach(genre => {
    const option = document.createElement('option')
    option.value = genre.id
    option.textContent = genre.name
    select.appendChild(option)
  })
  select.value = valorActual
}

// ── Handlers formulario películas ─────────────────────────

export async function handleMovieFormSubmit(event) {
  event.preventDefault()

  const title = document.getElementById('movie-title').value
  const director = document.getElementById('movie-director').value
  const year = parseInt(document.getElementById('movie-year').value)
  const duration = parseInt(document.getElementById('movie-duration').value)
  const genreId = parseInt(document.getElementById('movie-genre').value)
  const editingId = editingIdInput.value

  const error = validarFormularioMovie(title, director, year, duration, genreId)
  if (error) {
    mostrarMensaje(error, 'error')
    return
  }

  const movieData = { title, director, year, duration, genreId }

  try {
    if (editingId) {
      const updated = await updateMovie(parseInt(editingId), movieData)
      movies = movies.map(m => m.id === updated.id ? updated : m)
      mostrarMensaje('Película actualizada correctamente', 'exito')
    } else {
      const created = await postMovie(movieData)
      movies.push(created)
      mostrarMensaje('Película agregada correctamente', 'exito')
    }

    resetFormulario()
    renderMovies()
  } catch (err) {
    mostrarMensaje(err.message, 'error')
  }
}

// ── Handlers tabla películas ──────────────────────────────

export async function handleTablaClick(event) {
  const button = event.target.closest('button')
  if (!button) return

  const id = parseInt(button.getAttribute('data-id'))
  const action = button.getAttribute('data-action')

  if (action === 'delete') {
    if (!confirm('¿Seguro que querés eliminar esta película?')) return
    try {
      await deleteMovie(id)
      movies = movies.filter(m => m.id !== id)
      mostrarMensaje('Película eliminada correctamente', 'exito')
      renderMovies()
    } catch (err) {
      mostrarMensaje(err.message, 'error')
    }
  }

  if (action === 'edit') {
    try {
      const movie = await getMovieById(id)
      if (movie) {
        document.getElementById('movie-title').value = movie.title
        document.getElementById('movie-director').value = movie.director
        document.getElementById('movie-year').value = movie.year
        document.getElementById('movie-duration').value = movie.duration
        document.getElementById('movie-genre').value = movie.genreId
        editingIdInput.value = movie.id
        btnMovie.textContent = 'Guardar cambios'
        btnCancelar.style.display = 'inline-block'
      }
    } catch (err) {
      mostrarMensaje(err.message, 'error')
    }
  }
}

// ── Handlers formulario géneros ───────────────────────────

export async function handleGenreFormSubmit(event) {
  event.preventDefault()

  const name = document.getElementById('genre-name').value

  const error = validarGenre(name)
  if (error) {
    mostrarMensaje(error, 'error')
    return
  }

  try {
    const created = await postGenre({ name: name.trim() })
    genres.push(created)
    mostrarMensaje('Género agregado correctamente', 'exito')
    genreForm.reset()
    renderGenres()
    llenarSelectGeneros()
  } catch (err) {
    mostrarMensaje(err.message, 'error')
  }
}

export async function handleListaGenerosClick(event) {
  const button = event.target.closest('button')
  if (!button) return

  const id = parseInt(button.getAttribute('data-id'))
  const action = button.getAttribute('data-action')

  if (action === 'delete-genre') {
    if (!confirm('¿Seguro que querés eliminar este género?')) return
    try {
      await deleteGenre(id)
      genres = genres.filter(g => g.id !== id)
      mostrarMensaje('Género eliminado correctamente', 'exito')
      renderGenres()
      llenarSelectGeneros()
    } catch (err) {
      mostrarMensaje(err.message, 'error')
    }
  }
}

// ── Inicializar listeners ─────────────────────────────────

export function inicializarListeners() {
  movieForm.addEventListener('submit', handleMovieFormSubmit)
  tablaMovies.addEventListener('click', handleTablaClick)
  genreForm.addEventListener('submit', handleGenreFormSubmit)
  listaGeneros.addEventListener('click', handleListaGenerosClick)
  btnCancelar.addEventListener('click', () => resetFormulario())
}