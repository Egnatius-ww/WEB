'use strict';

const prisma = require('../db/prisma');
const ApiError = require('../utils/ApiError');

function roundMoney(value) {
  return Math.round(value * 100) / 100;
}

async function getOrCreateCart(userId) {
  let cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: { product: true },
        orderBy: { id: 'asc' },
      },
    },
  });
  if (!cart) {
    await prisma.cart.create({ data: { userId } });
    cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: { product: true },
          orderBy: { id: 'asc' },
        },
      },
    });
  }
  return cart;
}

// Пересчёт позиций корзины: подытог, скидка по активному промокоду (если был применён — считается на клиенте через apply-promo)
function toCartJson(cart) {
  const items = cart.items.map((item) => ({
    id: item.id,
    qty: item.qty,
    product: {
      id: item.product.id,
      title: item.product.title,
      description: item.product.description,
      price: Number(item.product.price),
      rating: item.product.rating,
      images: item.product.images,
      stock_quantity: item.product.stockQuantity,
      created_at: item.product.createdAt,
    },
  }));
  const subtotal = roundMoney(
    cart.items.reduce((sum, item) => sum + Number(item.product.price) * item.qty, 0)
  );
  return { items, subtotal };
}

async function addItem(userId, productId, qty) {
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) {
    throw new ApiError(404, 'Product not found');
  }
  if (product.stockQuantity < qty) {
    throw new ApiError(409, `Not enough stock: only ${product.stockQuantity} left`);
  }

  const cart = await getOrCreateCart(userId);
  const existing = await prisma.cartItem.findUnique({
    where: { cartId_productId: { cartId: cart.id, productId } },
  });

  const targetQty = (existing ? existing.qty : 0) + qty;
  if (product.stockQuantity < targetQty) {
    throw new ApiError(409, `Not enough stock: only ${product.stockQuantity} left`);
  }

  if (existing) {
    await prisma.cartItem.update({ where: { id: existing.id }, data: { qty: targetQty } });
  } else {
    await prisma.cartItem.create({ data: { cartId: cart.id, productId, qty } });
  }

  return toCartJson(await getOrCreateCart(userId));
}

async function updateItem(userId, itemId, qty) {
  const cart = await getOrCreateCart(userId);
  const item = await prisma.cartItem.findFirst({
    where: { id: itemId, cartId: cart.id },
    include: { product: true },
  });
  if (!item) {
    throw new ApiError(404, 'Cart item not found');
  }
  if (item.product.stockQuantity < qty) {
    throw new ApiError(409, `Not enough stock: only ${item.product.stockQuantity} left`);
  }
  await prisma.cartItem.update({ where: { id: item.id }, data: { qty } });
  return toCartJson(await getOrCreateCart(userId));
}

async function removeItem(userId, itemId) {
  const cart = await getOrCreateCart(userId);
  const item = await prisma.cartItem.findFirst({ where: { id: itemId, cartId: cart.id } });
  if (!item) {
    throw new ApiError(404, 'Cart item not found');
  }
  await prisma.cartItem.delete({ where: { id: item.id } });
  return toCartJson(await getOrCreateCart(userId));
}

async function clearCart(userId) {
  const cart = await getOrCreateCart(userId);
  await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
  return toCartJson(await getOrCreateCart(userId));
}

// Применение промокода: валидация кода и расчёт итога со скидкой
async function applyPromo(userId, code) {
  const promo = await prisma.promoCode.findUnique({ where: { code } });
  if (!promo || !promo.isActive) {
    throw new ApiError(404, 'Promo code is invalid or inactive');
  }

  const cart = await getOrCreateCart(userId);
  const subtotal = roundMoney(
    cart.items.reduce((sum, item) => sum + Number(item.product.price) * item.qty, 0)
  );
  const discount = roundMoney((subtotal * promo.discountPercentage) / 100);

  return {
    code: promo.code,
    discount_percentage: promo.discountPercentage,
    subtotal,
    discount,
    total: roundMoney(subtotal - discount),
  };
}

module.exports = { getOrCreateCart, toCartJson, addItem, updateItem, removeItem, clearCart, applyPromo };
