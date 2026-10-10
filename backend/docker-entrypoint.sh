#!/bin/sh
set -e

echo "Applying database migrations (prisma migrate deploy)..."
npx prisma migrate deploy

echo "Seeding database (idempotent)..."
node prisma/seed.js

echo "Starting BuildMart API..."
exec node src/index.js
