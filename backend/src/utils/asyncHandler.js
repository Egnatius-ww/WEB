'use strict';

// Оборачивает async-роут, чтобы ошибки ушли в общий error handler
module.exports = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
