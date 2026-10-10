'use strict';

const express = require('express');
const { z } = require('zod');
const prisma = require('../db/prisma');
const cache = require('../cache/memcached');
const validate = require('../middleware/validate');
const { requireAuth, requireRole } = require('../middleware/auth');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { getProducts, getProductById, toProductJson } = require('../services/products');

const router = express.Router();

const listQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(12),
  search: z.string().trim().min(1).max(255).optional(),
  min_price: z.coerce.number().min(0).optional(),
  max_price: z.coerce.number().min(0).optional(),
  min_rating: z.coerce.number().min(0).max(5).optional(),
  sort_by: z.enum(['price', 'title']).optional(),
  order: z.enum(['asc', 'desc']).default('asc'),
});

const productBodySchema = z.object({
  title: z.string().trim().min(1).max(255),
  description: z.string().trim().min(1),
  price: z.coerce.number().positive(),
  rating: z.coerce.number().min(0).max(5).optional(),
  images: z.array(z.string().url()).min(3, 'At least 3 image URLs are required'),
  stock_quantity: z.coerce.number().int().min(0).default(0),
});

/**
 * @openapi
 * /api/products:
 *   get:
 *     tags: [Products]
 *     summary: Каталог — поиск, фильтрация, сортировка и пагинация на уровне БД; кэшируется в Memcached
 *     parameters:
 *       - { in: query, name: page, schema: { type: integer, default: 1 } }
 *       - { in: query, name: limit, schema: { type: integer, default: 12 } }
 *       - { in: query, name: search, schema: { type: string }, description: Поиск по подстроке в названии или описании без учёта регистра (LIKE) }
 *       - { in: query, name: min_price, schema: { type: number } }
 *       - { in: query, name: max_price, schema: { type: number } }
 *       - { in: query, name: min_rating, schema: { type: number } }
 *       - { in: query, name: sort_by, schema: { type: string, enum: [price, title] } }
 *       - { in: query, name: order, schema: { type: string, enum: [asc, desc] } }
 *     responses:
 *       200:
 *         description: Страница каталога в формате { items, meta }
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ProductsList' }
 */
router.get(
  '/',
  validate({ query: listQuerySchema }),
  asyncHandler(async (req, res) => {
    const params = req.validated.query;

    // Ключ кэша строится на основе query-строки (ТЗ, п.5)
    const cacheKey = `catalog:v${await cache.getCatalogVersion()}:` + new URLSearchParams(
      Object.entries(params)
        .filter(([, v]) => v !== undefined)
        .map(([k, v]) => [k, String(v)])
    ).toString();

    const cached = await cache.getJSON(cacheKey);
    if (cached) {
      res.set('X-Cache', 'HIT');
      return res.json(cached);
    }

    const page = await getProducts(params);
    await cache.setJSON(cacheKey, page);
    res.set('X-Cache', 'MISS');
    return res.json(page);
  })
);

/**
 * @openapi
 * /api/products/{id}:
 *   get:
 *     tags: [Products]
 *     summary: Один товар по id (для страницы карточки)
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: integer } }
 *     responses:
 *       200:
 *         description: Товар
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Product' }
 *       404: { description: Товар не найден }
 */
router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1) {
      throw new ApiError(400, 'Invalid product id');
    }
    res.json(await getProductById(id));
  })
);

/**
 * @openapi
 * /api/products:
 *   post:
 *     tags: [Products]
 *     summary: Создание товара (только admin; сбрасывает кэш каталога)
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, description, price, images]
 *             properties:
 *               title: { type: string }
 *               description: { type: string }
 *               price: { type: number }
 *               rating: { type: number }
 *               images: { type: array, items: { type: string }, description: Минимум 3 URL }
 *               stock_quantity: { type: integer }
 *     responses:
 *       201: { description: Товар создан }
 *       401/403: { description: Нет токена или роли admin }
 */
router.post(
  '/',
  requireAuth,
  requireRole('admin'),
  validate({ body: productBodySchema }),
  asyncHandler(async (req, res) => {
    const b = req.validated.body;
    const product = await prisma.product.create({
      data: {
        title: b.title,
        description: b.description,
        price: b.price,
        rating: b.rating ?? 0,
        images: b.images,
        stockQuantity: b.stock_quantity,
      },
    });
    await cache.invalidateCatalog();
    res.status(201).json(toProductJson(product));
  })
);

/**
 * @openapi
 * /api/products/{id}:
 *   patch:
 *     tags: [Products]
 *     summary: Изменение товара (только admin; сбрасывает кэш каталога)
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: integer } }
 *     responses:
 *       200: { description: Товар обновлён }
 *       404: { description: Товар не найден }
 */
router.patch(
  '/:id',
  requireAuth,
  requireRole('admin'),
  validate({ body: productBodySchema.partial() }),
  asyncHandler(async (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1) {
      throw new ApiError(400, 'Invalid product id');
    }
    const b = req.validated.body;
    const data = {};
    if (b.title !== undefined) data.title = b.title;
    if (b.description !== undefined) data.description = b.description;
    if (b.price !== undefined) data.price = b.price;
    if (b.rating !== undefined) data.rating = b.rating;
    if (b.images !== undefined) data.images = b.images;
    if (b.stock_quantity !== undefined) data.stockQuantity = b.stock_quantity;

    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) {
      throw new ApiError(404, 'Product not found');
    }
    const product = await prisma.product.update({ where: { id }, data });
    await cache.invalidateCatalog();
    res.json(toProductJson(product));
  })
);

/**
 * @openapi
 * /api/products/{id}:
 *   delete:
 *     tags: [Products]
 *     summary: Удаление товара (только admin). Каскадно удаляет позиции корзин, сбрасывает кэш каталога
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: integer } }
 *     responses:
 *       200: { description: Удалено }
 *       404: { description: Товар не найден }
 */
router.delete(
  '/:id',
  requireAuth,
  requireRole('admin'),
  asyncHandler(async (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1) {
      throw new ApiError(400, 'Invalid product id');
    }
    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) {
      throw new ApiError(404, 'Product not found');
    }
    // CartItem.product onDelete: Cascade — внешние ключи обрабатываются на уровне БД
    await prisma.product.delete({ where: { id } });
    await cache.invalidateCatalog();
    res.json({ deleted: true, id });
  })
);

module.exports = router;
