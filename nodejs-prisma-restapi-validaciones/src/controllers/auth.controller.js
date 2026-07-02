import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../db.js";
import asyncHandler from "../utils/asyncHandler.js";
import ValidationError from "../utils/ValidationError.js";

const SALT_ROUNDS = 10;

// POST /api/auth/register
export const register = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || name.trim() === "") {
    return next(new ValidationError("El nombre es obligatorio"));
  }

  if (!email || email.trim() === "") {
    return next(new ValidationError("El email es obligatorio"));
  }

  if (!password || password.length < 6) {
    return next(new ValidationError("La contraseña debe tener al menos 6 caracteres"));
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: email.trim() },
  });

  if (existingUser) {
    return next(new ValidationError(`Ya existe un usuario con el email '${email}'`));
  }

  // Encripta la contraseña antes de guardarla. Nunca se guarda en texto plano.
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  const user = await prisma.user.create({
    data: {
      name: name.trim(),
      email: email.trim(),
      password: hashedPassword,
    },
  });

  // No devolvemos la contraseña en la respuesta, ni siquiera hasheada.
  res.status(201).json({
    id: user.id,
    name: user.name,
    email: user.email,
  });
});

// POST /api/auth/login
export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ValidationError("Email y contraseña son obligatorios"));
  }

  const user = await prisma.user.findUnique({
    where: { email: email.trim() },
  });

  if (!user) {
    return next(new ValidationError("Credenciales inválidas"));
  }

  // Compara la contraseña ingresada con el hash guardado en la DB.
  const passwordMatches = await bcrypt.compare(password, user.password);

  if (!passwordMatches) {
    return next(new ValidationError("Credenciales inválidas"));
  }

  // Genera el token con el id y email del usuario. Expira en 2 horas.
  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "2h" }
  );

  res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  });
});