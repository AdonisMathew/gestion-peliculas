export function validarFormularioMovie(title, director, year, duration, genreId) {
  if (!title || title.trim() === '') return 'El título es obligatorio'
  if (!director || director.trim() === '') return 'El director es obligatorio'
  if (!year || isNaN(year) || year < 1888 || year > new Date().getFullYear()) {
    return `El año debe ser un número entre 1888 y ${new Date().getFullYear()}`
  }
  if (!duration || isNaN(duration) || duration < 1) {
    return 'La duración debe ser un número positivo en minutos'
  }
  if (!genreId) return 'Debés seleccionar un género'
  return null
}

export function validarGenre(name) {
  if (!name || name.trim() === '') return 'El nombre del género es obligatorio'
  return null
}