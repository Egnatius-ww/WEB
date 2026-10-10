# BuildMart (WEB)

Статический фронтенд: каталог, карточка товара, корзина. Ниже — что делают скрипты, стили и **строки корзины** (line items).

---

## JavaScript: функции и API

Построчные пояснения по файлам: [scripts/JS-LINE-BY-LINE.md](scripts/JS-LINE-BY-LINE.md).

### `scripts/products.js`

| Имя | Назначение |
|-----|------------|
| `spec(label, value)` | Возвращает объект `{ label, value }` для массива характеристик товара. |
| *(глобально)* `window.BUILDMART_PRODUCTS` | Массив всех товаров (id, title, price, rating, category, image, description, specs). |
| `window.getBuildmartProductById(id)` | Находит товар по `id` или возвращает `null`. |

### `scripts/cart-store.js` — `window.BuildmartCart`

| Метод / функция | Назначение |
|-----------------|------------|
| `read()` | Читает корзину из `localStorage` (с учётом миграции legacy-ключа). |
| `readRaw()` *(внутр.)* | Парсит JSON из хранилища; при ошибке — пустой массив. |
| `write(lines)` *(внутр.)* | Сохраняет массив строк и шлёт событие `buildmart-cart-changed`. |
| `migrateLegacy()` *(внутр.)* | Убирает старый флаг `buildmartCartHasItems`, если корзина уже в новом формате. |
| `add(id, qty)` | Добавляет товар или увеличивает количество по существующей строке. |
| `setQty(id, qty)` | Задаёт количество для строки с данным `id` (минимум 1). |
| `remove(id)` | Удаляет строку с товаром `id`. |
| `clear()` | Очищает корзину. |
| `countLines()` | Число разных позиций (строк) в корзине. |
| `countItems()` | Сумма всех `qty` по строкам (для бейджа в шапке). |

### `scripts/header.js`

| Имя | Назначение |
|-----|------------|
| *(инициализация)* | Подменяет `#site-header-mount` разметкой шапки. |
| `setNavOpen(open)` | Открывает/закрывает мобильную панель; синхронизирует поля поиска desktop/mobile. |
| `closeNavOnNavigate(e)` | Закрывает меню при клике по ссылке в панели. |
| `syncHeaderCartBadge()` | Обновляет бейдж количества товаров у иконки корзины. |

### `scripts/footer.js`

| Имя | Назначение |
|-----|------------|
| *(инициализация)* | Подменяет `#site-footer-mount` разметкой подвала (без отдельных именованных функций). |

### `scripts/catalog.js`

| Имя | Назначение |
|-----|------------|
| `getPriceSliderMax()` | Верхняя граница слайдера цены из атрибута `max` или 400. |
| `getCardRating(card)` | Парсит рейтинг из текста в карточке. |
| `getCardPrice(card)` | Парсит цену из текста в карточке. |
| `getCardTitle(card)` | Нормализованный заголовок для сортировки по имени. |
| `compareCardsForSort(a, b, mode)` | Сравнение двух карточек: цена ↑/↓ или имя. |
| `getSelectedMinimumRating()` | Выбранный порог звёзд из чекбоксов (или `null`). |
| `getPriceBounds()` | Текущие min/max цены из инпутов. |
| `updatePriceLabels()` | Обновляет подписи `$min` / `$max`. |
| `updatePriceRangeFill()` | Визуальная заливка между ползунками диапазона. |
| `syncPriceInputs()` | Не даёт min превысить max; синхронизирует подписи и заливку. |
| `reorderProductCardsInGrid(visibleSorted, hidden)` | Переставляет DOM-узлы карточек: сначала видимые отсортированные, потом скрытые. |
| `applyFilters()` | Фильтр по рейтингу и цене, сортировка, счётчик «Showing N products». |
| `setRatingCheckboxVisual(item, checked)` | Состояние кастомного чекбокса рейтинга (`aria-checked`, `data-state`). |

### `scripts/catalog-add-to-cart.js`

| Имя | Назначение |
|-----|------------|
| `productIdFromCard(container)` | Достаёт `id` из `href` ссылки `?id=` внутри карточки каталога. |
| *(делегирование `click`)* | По кнопке `.catalog__product-button` — `BuildmartCart.add(id, 1)` и тост. |

### `scripts/card.js`

| Имя | Назначение |
|-----|------------|
| `formatPrice(n)` | Строка цены вида `$xx.xx`. |
| `starClassFor(rating, index1to5)` | Класс звезды: полная / половина / пустая. |
| `starUseHref(kind)` | Ссылка на символ в `icons.svg` для звезды. |
| `buildRatingStars(rating)` | HTML пяти звёзд для блока рейтинга. |
| `buildRelatedRatingRow(rating)` | Компактный ряд звёзд + число для похожих товаров. |
| `applyProduct(p)` | Заполняет страницу данными товара (галерея, текст, спеки, related). |
| `initGallery()` | Клики по превью и кнопки prev/next; `getActiveIndex`, `activateAt`. |
| `initSpecsAccordion()` | Аккордеон характеристик: `syncAria`, `clearBodyMotion`, `openAccordion`, `closeAccordion`. |
| `initQty()` | Поле количества: `readQty`, кнопки +/-, минимум 1. |
| `initAddToCart(p)` | Кнопка добавления в корзину с учётом количества и тоста. |

### `scripts/cart-page.js`

| Имя | Назначение |
|-----|------------|
| `fmt(n)` | Форматирование денег для UI. |
| `roundMoney(n)` | Округление до центов. |
| `readAppliedPromo()` / `setAppliedPromo(code)` | Промокод в `sessionStorage`. |
| `isPromoActive()` | Совпадение с `BUILD10` (10% скидка). |
| `renderCart()` | Пустое/заполненное состояние, список строк, подытог/налог/итого. |
| `updateTotals(sub, discount, tax, grand)` | Обновляет блок сумм и строку скидки. |
| `syncPromoHint()` | Показ подсказки у поля промокода. |
| `setPromoFeedback(message, ok)` | Текст и стиль сообщения о промокоде. |
| `onPromoApply()` | Проверка кода и пересчёт. |

### `scripts/buildmart-toast.js`

| Имя | Назначение |
|-----|------------|
| `toastInnerHtml()` | Разметка одного тоста (иконка + текст). |
| `ensureStack()` | Создаёт/возвращает контейнер `#buildmart-toast-stack`. |
| `updateStackOverlap()` | CSS-переменная перекрытия стека по высоте верхнего тоста. |
| `clearAutoHide(item)` / `scheduleAutoHide(item)` | Таймер автоскрытия. |
| `removeItem(item, immediate?)` | Удаление с анимацией или сразу. |
| `bindSwipeDismiss(item)` | Свайп вверх/вправо: `resetInner`, `point`, `onStart`, `onMove`, `onEnd`. |
| `window.showBuildmartToast(message)` | Показать уведомление (до 5 видимых, старые выкидываются). |

---

## Отдельные строки корзины (line items)

Корзина в `localStorage` под ключом `buildmartCart` — это **JSON-массив объектов**, каждый объект — одна **строка заказа**:

```json
{ "id": "exterior-paint", "qty": 2 }
```

| Поле | Смысл |
|------|--------|
| `id` | Идентификатор товара из `BUILDMART_PRODUCTS` (тот же, что в `card.html?id=…`). |
| `qty` | Количество штук (целое ≥ 1; при уменьшении до 0 строка удаляется через `remove` / логику корзины). |

**Жизненный цикл строки**

- **Добавление:** каталог (`catalog-add-to-cart.js`) или карточка (`card.js`) вызывают `BuildmartCart.add(id, qty)` — либо новая строка, либо суммирование `qty` с существующей.
- **Изменение количества:** на странице корзины (`cart-page.js`) — `setQty` или `remove`, если количество стало 0 или кнопка «Remove».
- **Отображение:** `renderCart()` для каждой строки подтягивает товар через `getBuildmartProductById(line.id)`; если товара нет, строка в разметке пропускается.

Событие **`buildmart-cart-changed`** сообщает шапке и странице корзины, что состав строк изменился.

---

## CSS: файлы и блоки

Подробный разбор **типов** уникальных строк и таблица всех **92 имён свойств**, встречающихся в `styles/`: [styles/CSS-UNIQUE-LINES.md](styles/CSS-UNIQUE-LINES.md).

В каждом файле **одна строка** обычно — это *селектор* и *блок свойств* (`свойство: значение;`). Полный перечень каждой декларации дублировать здесь не имеет смысла; ниже — **какой файл за что отвечает** и **основные группы классов**.

### `styles/main.css`

- Утилиты: `.flex`, `.items-center`, `.text-gray-600`.
- Каркас страницы: `body`, `.screen`, `.screen__content` — колонка, центрирование, отступы по брейкпоинтам (640px, 1024px).

### `styles/header.css`

- Липкая шапка `.header`, контейнер, логотип, навигация, поле поиска (фокус, граница).
- Ссылка на корзину, бейдж, кнопка меню.
- Мобильная панель (`header--nav-open`), медиазапросы для сетки колонок (планшет/десктоп), поведение поиска и декоративная «лупа» на узкой ширине.

### `styles/footer.css`

- Тёмный футер: сетка колонок, ссылки, соцсети, форма рассылки, контакты, копирайт; адаптивные отступы контейнера.

### `styles/catalog.css`

- Блок **`.catalog`**: заголовок, подзаголовок, панель фильтров (рейтинг, двойной слайдер цены, кнопка сброса), состояние `.catalog--filters-open`.
- Сортировка: `.catalog__sort`, `.catalog__dropdown`.
- **Карточки товара**: `.catalog__product-container`, ссылки, изображение, заголовок, рейтинг (звёзды), цена, категория, кнопка «Add to cart»; варианты позиций `--2` … `--6` для сетки.
- Сетка продуктов `#catalog-products-grid` и связанные размеры/позиционирование под макет.

### `styles/card.css`

- Хлебные крошки, контейнер карточки товара `.card-page__product-card` (одна колонка → с 1024px две: галерея + контент).
- Галерея: герой-фото, превью, навигация prev/next.
- Заголовок, рейтинг, цена, описание, сетка спецификаций, аккордеон.
- Кнопки, количество, блок похожих товаров `.card-page__related-*`.

### `styles/cart.css`

- Обёртка `.cart-page`, пустое и заполненное состояние.
- Строка товара `.cart-page__item` (сетка колонок), изображение, заголовок, цена, блок количества, удаление.
- Итоги заказа, промокод, кнопки оформления; много медиазапросов для узких ширин (768px, 1024px) — компактная строка корзины и т.д.

### `styles/buildmart-toast.css`

- Фиксированный стек `.buildmart-toast-stack`, элементы `.buildmart-toast-item`, состояния `--in`, `--out`, `--dragging`.
- Внутренний блок `.buildmart-toast__inner` (фон, скругление, тень), перекрытие стека через `--buildmart-toast-overlap`.

---

## Подключение скриптов на страницах

- **Каталог:** `products.js` → `cart-store.js` → `header.js` / `footer.js` → `buildmart-toast.js` → `catalog.js` → `catalog-add-to-cart.js`.
- **Карточка:** `products.js` → `cart-store.js` → … → `card.js`.
- **Корзина:** `products.js` → `cart-store.js` → … → `cart-page.js`.

Точный порядок тегов `<script>` смотрите в соответствующих HTML-файлах в `html/`.
