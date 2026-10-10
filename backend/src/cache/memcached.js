'use strict';

const memjs = require('memjs');
const env = require('../config/env');

const client = memjs.Client.create(env.memcachedHosts, { timeout: 0.5, retries: 1 });

// Кэш каталога: список страниц нельзя перечислить и удалить по одному ключу,
// поэтому используем «версию каталога»: ключ страницы = catalog:v<N>:<query>.
// Инвалидация — это INCR версии: все старые ключи перестают читаться.
const VERSION_KEY = 'catalog:version';

async function getCatalogVersion() {
  const { value } = await client.get(VERSION_KEY);
  return value ? Number(value.toString()) : 1;
}

async function getJSON(key) {
  const { value } = await client.get(key);
  if (!value) return null;
  try {
    return JSON.parse(value.toString());
  } catch {
    return null;
  }
}

async function setJSON(key, payload) {
  await client.set(key, JSON.stringify(payload), { expires: env.cacheTtlSeconds });
}

// Вызывается при создании/изменении/удалении товара — сбрасывает весь кэш каталога
async function invalidateCatalog() {
  await client.increment(VERSION_KEY, 1);
}

async function close() {
  await client.close();
}

module.exports = { getCatalogVersion, getJSON, setJSON, invalidateCatalog, close };
