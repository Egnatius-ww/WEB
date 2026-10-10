'use strict';

const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'BuildMart API',
      version: '1.0.0',
      description:
        'REST API интернет-магазина BuildMart: аутентификация (JWT + RBAC), каталог с поиском/фильтрацией/сортировкой и пагинацией на уровне БД, кэширование (Memcached), корзина и промокоды.',
    },
    servers: [{ url: '/', description: 'Current host' }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            message: { type: 'string' },
            details: {},
          },
        },
        AuthResponse: {
          type: 'object',
          properties: {
            token: { type: 'string' },
            user: { $ref: '#/components/schemas/User' },
          },
        },
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            email: { type: 'string' },
            role: { type: 'string', enum: ['customer', 'admin'] },
          },
        },
        Product: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            title: { type: 'string' },
            description: { type: 'string' },
            price: { type: 'number' },
            rating: { type: 'number' },
            images: { type: 'array', items: { type: 'string' } },
            stock_quantity: { type: 'integer' },
            created_at: { type: 'string', format: 'date-time' },
          },
        },
        ProductsList: {
          type: 'object',
          properties: {
            items: { type: 'array', items: { $ref: '#/components/schemas/Product' } },
            meta: {
              type: 'object',
              properties: {
                total_items: { type: 'integer' },
                total_pages: { type: 'integer' },
                current_page: { type: 'integer' },
                limit: { type: 'integer' },
              },
            },
          },
        },
        CartItem: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            qty: { type: 'integer' },
            product: { $ref: '#/components/schemas/Product' },
          },
        },
        Cart: {
          type: 'object',
          properties: {
            items: { type: 'array', items: { $ref: '#/components/schemas/CartItem' } },
            subtotal: { type: 'number' },
          },
        },
      },
    },
  },
  // JSDoc-аннотации собираются из файлов роутов
  apis: [`${__dirname}/../routes/*.js`],
};

module.exports = swaggerJSDoc(options);
