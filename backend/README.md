# BuildMart API

Серверная часть (REST API) интернет-магазина BuildMart.

**Стек (Вариант 1):** Node.js 22 (LTS) · Express · Prisma ORM · MySQL 8.0 · Memcached · JWT (bcrypt) · Swagger/OpenAPI · Docker.

---

## Локальный запуск через Docker

```bash
cp .env.example .env       # затем при необходимости поменяйте секреты
docker compose up --build
```

Поднимутся три сервиса:

| Сервис | Адрес | Описание |
|---|---|---|
| `app` | http://localhost:3000 | Express API |
| `mysql` | внутри сети compose | MySQL 8.0 (named volume `db_data`) |
| `memcached` | внутри сети compose | кэш каталога |

При старте контейнер `app` сам применяет миграции (`prisma migrate deploy`), наполняет БД сидом (идемпотентно) и запускает сервер. Проверка: <http://localhost:3000/api/health>.

Интерактивная документация API (Swagger UI): **<http://localhost:3000/api/docs>**

### Запуск без Docker (альтернатива)

Нужны Node.js 22+, MySQL 8 и Memcached, доступные по `DATABASE_URL` и `MEMCACHED_HOSTS` из `.env`:

```bash
npm install
npx prisma migrate deploy
npm run seed
npm start
```

---

## Переменные окружения

| Переменная | По умолчанию | Описание |
|---|---|---|
| `PORT` | `3000` | Порт API-сервера |
| `DATABASE_URL` | — | Строка подключения MySQL: `mysql://user:pass@host:3306/buildmart` |
| `MEMCACHED_HOSTS` | `localhost:11211` | Адрес(а) Memcached |
| `CACHE_TTL` | `90` | TTL кэша каталога в секундах (по ТЗ 60–120) |
| `JWT_SECRET` | — | Секрет подписи JWT (**обязательно**) |
| `JWT_EXPIRES_IN` | `12h` | Время жизни токена |
| `CORS_ORIGIN` | `http://localhost:5500,http://127.0.0.1:5500` | Источники фронтенда через запятую (`*` — все) |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | `admin@buildmart.local` / `admin12345` | Админ, создаваемый сидом |
| `MYSQL_PASSWORD` / `MYSQL_ROOT_PASSWORD` | `buildmart` / `rootsecret` | Пароли MySQL в docker compose |

---

## Эндпоинты

### Auth (JWT + bcrypt)

| Метод | Путь | Доступ | Описание |
|---|---|---|---|
| POST | `/api/auth/register` | public | Регистрация (хеширование пароля bcrypt), ответ `{token, user}` |
| POST | `/api/auth/login` | public | Авторизация, ответ `{token, user}`; токен передаётся как `Authorization: Bearer <token>` |

### Products (каталог)

| Метод | Путь | Доступ | Описание |
|---|---|---|---|
| GET | `/api/products` | public | Поиск, фильтрация, сортировка, пагинация — **на уровне БД**; кэшируется в Memcached (`X-Cache: HIT/MISS`) |
| GET | `/api/products/:id` | public | Один товар |
| POST | `/api/products` | admin | Создание + сброс кэша |
| PATCH | `/api/products/:id` | admin | Изменение + сброс кэша |
| DELETE | `/api/products/:id` | admin | Удаление (каскад позиций корзин) + сброс кэша |

Параметры `GET /api/products`: `page` (1), `limit` (12), `search` (LIKE по названию и описанию без учёта регистра), `min_price`, `max_price`, `min_rating`, `sort_by` (`price` \| `title`), `order` (`asc` \| `desc`).

Формат ответа:

```json
{
  "items": [{ "id": 1, "title": "…", "description": "…", "price": 45.99, "rating": 3.5, "images": ["…", "…", "…"], "stock_quantity": 120, "created_at": "…" }],
  "meta": { "total_items": 14, "total_pages": 2, "current_page": 1, "limit": 12 }
}
```

### Cart (корзина пользователя)

| Метод | Путь | Доступ | Описание |
|---|---|---|---|
| GET | `/api/cart` | авторизован | Корзина текущего пользователя |
| POST | `/api/cart/items` | авторизован | Добавить товар `{product_id, qty}` (проверка остатка) |
| PATCH | `/api/cart/items/:id` | авторизован | Изменить количество `{qty}` |
| DELETE | `/api/cart/items/:id` | авторизован | Удалить позицию |
| DELETE | `/api/cart` | авторизован | Очистить корзину |
| POST | `/api/cart/apply-promo` | авторизован | Промокод `{code}` — `SAVE10` даёт скидку 10%, ответ `{subtotal, discount, total}` |

### Служебные

`GET /api/health` — статус; `GET /api/docs` — Swagger UI.

### Примеры curl

```bash
# регистрация
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"me@example.com","password":"password123"}'

# каталог: поиск + фильтры + сортировка + страница 2
curl "http://localhost:3000/api/products?page=2&limit=6&search=cement&min_price=10&max_price=100&min_rating=4&sort_by=price&order=desc"

# корзина с токеном из логина
TOKEN=...
curl http://localhost:3000/api/cart -H "Authorization: Bearer $TOKEN"
curl -X POST http://localhost:3000/api/cart/items -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" -d '{"product_id":1,"qty":2}'
curl -X POST http://localhost:3000/api/cart/apply-promo -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" -d '{"code":"SAVE10"}'

# удаление товара (только admin)
curl -X DELETE http://localhost:3000/api/products/15 -H "Authorization: Bearer $ADMIN_TOKEN"
```

### Кэширование

`GET /api/products` кэшируется по ключу `catalog:v<версия>:<query-строка>` с TTL из `CACHE_TTL`. Любое создание/изменение/удаление товара увеличивает версию каталога (INCR) — все старые закэшированные страницы сразу перестают отдаваться (инвалидация). Заголовок `X-Cache: HIT|MISS` позволяет проверить поведение.

---

## Git Flow

Разработка ведётся от ветки `develop` фича-ветками (`feature/auth`, `feature/products-cache`, `feature/cart`, …), релиз — merge в `main`. Коммиты в формате Conventional Commits (`feat:`, `fix:`, `chore:`, `refactor:`).

---

## Облачный деплой (следующий шаг)

По ТЗ инфраструктура варианта: **TiDB Cloud** (Serverless MySQL) + **Render** (деплой из Dockerfile) + **Cloudinary** (медиа).

1. **TiDB Cloud**: создать кластер Serverless → Connection string вида `mysql://user:pass@gateway01.<region>.prod.aws.tidbcloud.com:4000/buildmart?sslaccept=strict` → положить в `DATABASE_URL`. Схема применяется той же командой `npx prisma migrate deploy` (миграции в репозитории).
2. **Cloudinary**: загрузить изображения товаров, вставить URL (по 3 на товар) в `prisma/seed.js` и в данные товаров.
3. **Render**: New Web Service → подключить репозиторий → Environment: `Docker` (Render соберёт из Dockerfile) → задать переменные окружения (`DATABASE_URL`, `JWT_SECRET`, `MEMCACHED_HOSTS` — Memcached нужен внешний провайдер, например MemoryDB/MemCachier, либо можно оставить кэш опциональным) → Deploy.
   - Демо-доступ после деплоя: `ADMIN_EMAIL`/`ADMIN_PASSWORD` из переменных сервиса.
4. **CORS**: добавить адрес фронтенда в `CORS_ORIGIN` сервиса на Render.

> Ссылки на задеплоенный API и Swagger добавляются сюда после выполнения деплоя:
> - API: _placeholder_
> - Swagger UI: _placeholder_
