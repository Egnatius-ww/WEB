'use strict';

const jwt = require('jsonwebtoken');
const env = require('../config/env');
const ApiError = require('../utils/ApiError');

// Проверяет JWT из заголовка Authorization: Bearer <token>
// и кладёт полезную нагрузку ({ sub, email, role }) в req.user
function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');
  if (scheme !== 'Bearer' || !token) {
    return next(new ApiError(401, 'Missing Authorization: Bearer <token> header'));
  }
  try {
    const payload = jwt.verify(token, env.jwtSecret);
    req.user = { id: Number(payload.sub), email: payload.email, role: payload.role };
    return next();
  } catch (err) {
    return next(new ApiError(401, 'Invalid or expired token'));
  }
}

// RBAC: пропускает только пользователей с указанной ролью
function requireRole(role) {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ApiError(401, 'Authentication required'));
    }
    if (req.user.role !== role) {
      return next(new ApiError(403, `Access denied: requires '${role}' role`));
    }
    return next();
  };
}

function signToken(user) {
  return jwt.sign(
    { sub: String(user.id), email: user.email, role: user.role.toLowerCase() },
    env.jwtSecret,
    { expiresIn: env.jwtExpiresIn }
  );
}

module.exports = { requireAuth, requireRole, signToken };
