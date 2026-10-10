# Multi-stage build по ТЗ: deps → build → runtime

# --- Стадия 1: установка всех зависимостей (включая dev для prisma CLI) ---
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# --- Стадия 2: сборка (генерация клиента Prisma) ---
FROM deps AS build
COPY prisma ./prisma
RUN npx prisma generate

# --- Стадия 3: минимальный runtime-образ ---
FROM node:22-alpine AS runner
ENV NODE_ENV=production
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY --from=build /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=build /app/node_modules/@prisma ./node_modules/@prisma
COPY prisma ./prisma
COPY src ./src
COPY docker-entrypoint.sh ./

# Запуск от непривилегированного пользователя (ТЗ)
USER node

EXPOSE 3000
ENTRYPOINT ["./docker-entrypoint.sh"]
