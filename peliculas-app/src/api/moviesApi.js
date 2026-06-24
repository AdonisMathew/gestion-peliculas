const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

// ── Géneros ──────────────────────────────────────────────

export async function getGenres() {
  try {
    const response = await fetch(`${API_URL}/genres`)
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching géneros:', error)
    return []
  }
}

export async function postGenre(genre) {
  try {
    const response = await fetch(`${API_URL}/genres`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(genre)
    })
    const data = await response.json()
    if (!response.ok) throw new Error(data.error || 'Error al crear género')
    return data
  } catch (error) {
    throw error
  }
}

export async function deleteGenre(id) {
  try {
    const response = await fetch(`${API_URL}/genres/${id}`, {
      method: 'DELETE'
    })
    const data = await response.json()
    if (!response.ok) throw new Error(data.error || 'Error al eliminar género')
    return true
  } catch (error) {
    throw error
  }
}

// ── Películas ─────────────────────────────────────────────

export async function getMovies() {
  try {
    const response = await fetch(`${API_URL}/movies`)
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching películas:', error)
    return []
  }
}

export async function getMovieById(id) {
  try {
    const response = await fetch(`${API_URL}/movies/${id}`)
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching película:', error)
    return null
  }
}

export async function postMovie(movie) {
  try {
    const response = await fetch(`${API_URL}/movies`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(movie)
    })
    const data = await response.json()
    if (!response.ok) throw new Error(data.error || 'Error al crear película')
    return data
  } catch (error) {
    throw error
  }
}

export async function updateMovie(id, movie) {
  try {
    const response = await fetch(`${API_URL}/movies/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(movie)
    })
    const data = await response.json()
    if (!response.ok) throw new Error(data.error || 'Error al actualizar película')
    return data
  } catch (error) {
    throw error
  }
}

export async function deleteMovie(id) {
  try {
    const response = await fetch(`${API_URL}/movies/${id}`, {
      method: 'DELETE'
    })
    const data = await response.json()
    if (!response.ok) throw new Error(data.error || 'Error al eliminar película')
    return true
  } catch (error) {
    throw error
  }
}