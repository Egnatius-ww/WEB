'use strict';

const express = require('express');
const cors = require('cors');
const env = require('./config/env');
const ApiError = require('./utils/ApiError');
const swaggerSpec = require('./docs/swagger');
const { serve: serveSwaggerUI, setup: setupSwaggerUI } = require('swagger-ui-express');

const authRouter = require('./routes/auth');
const productsRouter = require('./routes/products');

const app = express();

app.use(
  cors({
    origin: env.corsOrigin === '*' ? true : env.corsOrigin,
  })
);
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

app.use('/api/auth', authRouter);
app.use('/api/products', productsRouter);

app.use('/api/docs', serveSwaggerUI, setupSwaggerUI(swaggerSpec));

app.use((req, res, next) => {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  let status = err.status || 500;
  let message = err.message || 'Internal Server Error';
  let details = err.details;

  if (err.name === 'ZodError') {
    status = 400;
    message = 'Validation failed';
    details = err.issues.map((issue) => ({
      path: issue.path.join('.'),
      message: issue.message,
    }));
  }

  if (status >= 500) {
    console.error(err);
  }

  res.status(status).json({ message, ...(details ? { details } : {}) });
});

module.exports = app;
