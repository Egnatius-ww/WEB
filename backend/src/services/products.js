'use strict';

const prisma = require('../db/prisma');
const ApiError = require('../utils/ApiError');

const SORTABLE_FIELDS = ['price', 'title'];

// Преобразует Prisma-модель в JSON по ТЗ (snake_case)
function toProductJson(product) {
  return {
    id: product.id,
    title: product.title,
    description: product.description,
    price: Number(product.price),
    rating: product.rating,
    images: product.images,
    stock_quantity: product.stockQuantity,
    created_at: product.createdAt,
  };
}

async function getProducts(params) {
  const {
    page,
    limit,
    search,
    min_price,
    max_price,
    min_rating,
    sort_by,
    order,
  } = params;

  // Все фильтры выполняются на уровне СУБД (WHERE в SQL) — в памяти не фильтруем
  const where = {};
  if (search) {
    // LIKE %...% без учёта регистра (в MySQL ci-коллация utf8mb4_unicode_ci)
    where.OR = [
      { title: { contains: search } },
      { description: { contains: search } },
    ];
  }
  if (min_price !== undefined || max_price !== undefined) {
    where.price = {
      ...(min_price !== undefined ? { gte: min_price } : {}),
      ...(max_price !== undefined ? { lte: max_price } : {}),
    };
  }
  if (min_rating !== undefined) {
    where.rating = { gte: min_rating };
  }

  // Без sort_by — стабильный порядок по id (для корректной пагинации)
  const orderBy = sort_by ? { [sort_by]: order } : { id: 'asc' };

  const [items, totalItems] = await prisma.$transaction([
    prisma.product.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.product.count({ where }),
  ]);

  return {
    items: items.map(toProductJson),
    meta: {
      total_items: totalItems,
      total_pages: Math.max(1, Math.ceil(totalItems / limit)),
      current_page: page,
      limit,
    },
  };
}

async function getProductById(id) {
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) {
    throw new ApiError(404, 'Product not found');
  }
  return toProductJson(product);
}

module.exports = { getProducts, getProductById, toProductJson };
