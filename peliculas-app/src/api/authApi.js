const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

export async function registerUser(userData) {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  })
  const data = await response.json()
  if (!response.ok) throw new Error(data.error || 'Error al registrarse')
  return data
}

export async function loginUser(credentials) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  })
  const data = await response.json()
  if (!response.ok) throw new Error(data.error || 'Error al iniciar sesión')
  return data
}