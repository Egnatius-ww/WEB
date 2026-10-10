'use strict';

require('dotenv').config();

function required(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function clamp(value, min, max, fallback) {
  const n = Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, n));
}

const corsRaw = process.env.CORS_ORIGIN || 'http://localhost:5500,http://127.0.0.1:5500';

module.exports = {
  port: Number(process.env.PORT || 4000),
  corsOrigin: corsRaw.trim() === '*' ? '*' : corsRaw.split(',').map((s) => s.trim()).filter(Boolean),
  databaseUrl: required('DATABASE_URL'),
  memcachedHosts: process.env.MEMCACHED_HOSTS || 'localhost:11211',
  // ТЗ: TTL кэша каталога 60–120 секунд
  cacheTtlSeconds: clamp(process.env.CACHE_TTL, 60, 120, 90),
  jwtSecret: required('JWT_SECRET'),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '12h',
  adminEmail: (process.env.ADMIN_EMAIL || 'admin@buildmart.local').toLowerCase(),
  adminPassword: process.env.ADMIN_PASSWORD || 'admin12345',
};
