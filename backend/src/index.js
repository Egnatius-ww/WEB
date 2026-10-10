'use strict';

const app = require('./app');
const env = require('./config/env');
const prisma = require('./db/prisma');

const server = app.listen(env.port, () => {
  console.log(`BuildMart API listening on http://localhost:${env.port}`);
  console.log(`Swagger UI: http://localhost:${env.port}/api/docs`);
});

async function shutdown(signal) {
  console.log(`${signal} received, shutting down...`);
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
