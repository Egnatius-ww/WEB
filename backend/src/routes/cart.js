'use strict';

const express = require('express');
const { z } = require('zod');
const validate = require('../middleware/validate');
const { requireAuth } = require('../middleware/auth');
const asyncHandler = require('../utils/asyncHandler');
const { addItem, updateItem, removeItem, clearCart, applyPromo, getOrCreateCart, toCartJson } = require('../services/cart');

const router = express.Router();

// Корзина привязана к пользователю — доступ только с валидным JWT (RBAC: customer/admin со своей корзиной)
router.use(requireAuth);

const addItemSchema = z.object({
  product_id: z.coerce.number().int().min(1),
  qty: z.coerce.number().int().min(1).max(999).default(1),
});

const updateItemSchema = z.object({
  qty: z.coerce.number().int().min(1).max(999),
});

const promoSchema = z.object({
  code: z.string().trim().min(1).max(64),
});

/**
 * @openapi
 * /api/cart:
 *   get:
 *     tags: [Cart]
 *     summary: Корзина текущего пользователя
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Позиции корзины и подытог
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Cart' }
 */
router.get(
  '/',
  asyncHandler(async (req, res) => {
    res.json(toCartJson(await getOrCreateCart(req.user.id)));
  })
);

/**
 * @openapi
 * /api/cart:
 *   delete:
 *     tags: [Cart]
 *     summary: Очистить корзину
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Корзина очищена }
 */
router.delete(
  '/',
  asyncHandler(async (req, res) => {
    res.json(await clearCart(req.user.id));
  })
);

/**
 * @openapi
 * /api/cart/items:
 *   post:
 *     tags: [Cart]
 *     summary: Добавить товар в корзину (или увеличить количество)
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [product_id]
 *             properties:
 *               product_id: { type: integer }
 *               qty: { type: integer, default: 1 }
 *     responses:
 *       200: { description: Корзина после добавления }
 *       404: { description: Товар не найден }
 *       409: { description: Недостаточно товара на складе }
 */
router.post(
  '/items',
  validate({ body: addItemSchema }),
  asyncHandler(async (req, res) => {
    const { product_id, qty } = req.validated.body;
    res.json(await addItem(req.user.id, product_id, qty));
  })
);

/**
 * @openapi
 * /api/cart/items/{id}:
 *   patch:
 *     tags: [Cart]
 *     summary: Изменить количество позиции
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: integer } }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [qty]
 *             properties:
 *               qty: { type: integer }
 *     responses:
 *       200: { description: Корзина после изменения }
 *       404: { description: Позиция не найдена }
 */
router.patch(
  '/items/:id',
  validate({ body: updateItemSchema }),
  asyncHandler(async (req, res) => {
    res.json(await updateItem(req.user.id, Number(req.params.id), req.validated.body.qty));
  })
);

/**
 * @openapi
 * /api/cart/items/{id}:
 *   delete:
 *     tags: [Cart]
 *     summary: Удалить позицию из корзины
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: integer } }
 *     responses:
 *       200: { description: Корзина после удаления }
 *       404: { description: Позиция не найдена }
 */
router.delete(
  '/items/:id',
  asyncHandler(async (req, res) => {
    res.json(await removeItem(req.user.id, Number(req.params.id)));
  })
);

/**
 * @openapi
 * /api/cart/apply-promo:
 *   post:
 *     tags: [Cart]
 *     summary: Применить промокод (SAVE10 — скидка 10%) и рассчитать итог
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [code]
 *             properties:
 *               code: { type: string, example: SAVE10 }
 *     responses:
 *       200:
 *         description: Суммы заказа со скидкой
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code: { type: string }
 *                 discount_percentage: { type: integer }
 *                 subtotal: { type: number }
 *                 discount: { type: number }
 *                 total: { type: number }
 *       404: { description: Промокод не найден или неактивен }
 */
router.post(
  '/apply-promo',
  validate({ body: promoSchema }),
  asyncHandler(async (req, res) => {
    res.json(await applyPromo(req.user.id, req.validated.body.code));
  })
);

module.exports = router;
