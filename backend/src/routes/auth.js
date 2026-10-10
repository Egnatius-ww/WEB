'use strict';

const express = require('express');
const bcrypt = require('bcryptjs');
const { z } = require('zod');
const prisma = require('../db/prisma');
const validate = require('../middleware/validate');
const { signToken } = require('../middleware/auth');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');

const router = express.Router();

const credentialsSchema = z.object({
  email: z.string().trim().toLowerCase().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters').max(128),
});

function publicUser(user) {
  return { id: user.id, email: user.email, role: user.role.toLowerCase() };
}

/**
 * @openapi
 * /api/auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Регистрация покупателя (хеширование пароля bcrypt)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, example: customer@buildmart.local }
 *               password: { type: string, example: customer12345 }
 *     responses:
 *       201:
 *         description: Пользователь создан, возвращён JWT
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/AuthResponse' }
 *       400: { description: Ошибка валидации, content: { application/json: { schema: { $ref: '#/components/schemas/Error' } } } }
 *       409: { description: Email уже зарегистрирован }
 */
router.post(
  '/register',
  validate({ body: credentialsSchema }),
  asyncHandler(async (req, res) => {
    const { email, password } = req.validated.body;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw new ApiError(409, 'Email is already registered');
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, passwordHash, role: 'CUSTOMER' },
    });

    res.status(201).json({ token: signToken(user), user: publicUser(user) });
  })
);

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Авторизация (возвращает JWT для заголовка Authorization: Bearer)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, example: customer@buildmart.local }
 *               password: { type: string, example: customer12345 }
 *     responses:
 *       200:
 *         description: JWT выдан
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/AuthResponse' }
 *       401: { description: Неверный email или пароль }
 */
router.post(
  '/login',
  validate({ body: credentialsSchema }),
  asyncHandler(async (req, res) => {
    const { email, password } = req.validated.body;

    const user = await prisma.user.findUnique({ where: { email } });
    const passwordOk = user ? await bcrypt.compare(password, user.passwordHash) : false;
    if (!user || !passwordOk) {
      throw new ApiError(401, 'Invalid email or password');
    }

    res.json({ token: signToken(user), user: publicUser(user) });
  })
);

module.exports = router;
