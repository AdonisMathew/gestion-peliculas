import { registerUser, loginUser } from '../api/authApi.js'

const authScreen = document.getElementById('auth-screen')
const app = document.getElementById('app')
const tabLogin = document.getElementById('tab-login')
const tabRegister = document.getElementById('tab-register')
const loginForm = document.getElementById('login-form')
const registerForm = document.getElementById('register-form')
const userNameDisplay = document.getElementById('user-name-display')
const btnLogout = document.getElementById('btn-logout')

function mostrarMensaje(texto, tipo) {
  const mensaje = document.getElementById('mensaje')
  mensaje.textContent = texto
  mensaje.className = tipo
  setTimeout(() => {
    mensaje.className = ''
    mensaje.textContent = ''
  }, 3000)
}

// ── Guardar / leer sesión ─────────────────────────────────

export function guardarSesion(token, user) {
  localStorage.setItem('token', token)
  localStorage.setItem('user', JSON.stringify(user))
}

export function obtenerSesion() {
  const token = localStorage.getItem('token')
  const user = localStorage.getItem('user')
  if (!token || !user) return null
  return { token, user: JSON.parse(user) }
}

export function cerrarSesion() {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
}

// ── Mostrar pantallas ──────────────────────────────────────

export function mostrarApp(user) {
  authScreen.style.display = 'none'
  app.style.display = 'block'
  userNameDisplay.textContent = `Hola, ${user.name}`
}

export function mostrarAuth() {
  authScreen.style.display = 'flex'
  app.style.display = 'none'
}

// ── Cambiar entre tabs login/registro ─────────────────────

function activarTab(tab) {
  if (tab === 'login') {
    tabLogin.classList.add('tab-active')
    tabRegister.classList.remove('tab-active')
    loginForm.style.display = 'flex'
    registerForm.style.display = 'none'
  } else {
    tabRegister.classList.add('tab-active')
    tabLogin.classList.remove('tab-active')
    registerForm.style.display = 'flex'
    loginForm.style.display = 'none'
  }
}

// ── Handlers ───────────────────────────────────────────────

async function handleLoginSubmit(event, onLoginSuccess) {
  event.preventDefault()

  const email = document.getElementById('login-email').value
  const password = document.getElementById('login-password').value

  try {
    const data = await loginUser({ email, password })
    guardarSesion(data.token, data.user)
    mostrarMensaje(`Bienvenido, ${data.user.name}`, 'exito')
    loginForm.reset()
    onLoginSuccess(data.user)
  } catch (err) {
    mostrarMensaje(err.message, 'error')
  }
}

async function handleRegisterSubmit(event) {
  event.preventDefault()

  const name = document.getElementById('register-name').value
  const email = document.getElementById('register-email').value
  const password = document.getElementById('register-password').value

  try {
    await registerUser({ name, email, password })
    mostrarMensaje('Cuenta creada correctamente. Ahora podés iniciar sesión.', 'exito')
    registerForm.reset()
    activarTab('login')
  } catch (err) {
    mostrarMensaje(err.message, 'error')
  }
}

// ── Inicializar ────────────────────────────────────────────

export function inicializarAuthListeners(onLoginSuccess) {
  tabLogin.addEventListener('click', () => activarTab('login'))
  tabRegister.addEventListener('click', () => activarTab('register'))
  loginForm.addEventListener('submit', (e) => handleLoginSubmit(e, onLoginSuccess))
  registerForm.addEventListener('submit', handleRegisterSubmit)
  btnLogout.addEventListener('click', () => {
    cerrarSesion()
    mostrarAuth()
  })
}