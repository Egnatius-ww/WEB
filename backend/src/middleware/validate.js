'use strict';

// Валидация query/body через zod-схему.
// Очищенный объект доступен в req.validated.query / req.validated.body
function validate({ query, body } = {}) {
  return (req, res, next) => {
    try {
      req.validated = {};
      if (query) {
        req.validated.query = query.parse(req.query);
      }
      if (body) {
        req.validated.body = body.parse(req.body);
      }
      next();
    } catch (err) {
      next(err); // ZodError обрабатывается в общем error handler
    }
  };
}

module.exports = validate;
