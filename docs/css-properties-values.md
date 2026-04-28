# CSS: свойства и значения (без повторов имён свойств)

Один раз на **имя свойства**: кратко, что делает, и **какие значения** обычно пишут (не весь W3C — для редких кейсов см. [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference)).

Глобальные ключевые слова, если свойство их допускает: **`inherit`** | **`initial`** | **`unset`** | **`revert`** | **`revert-layer`**.

---

## 1. Модель отображения и бокс

| Свойство | Назначение | Типичные значения |
|----------|------------|-------------------|
| `display` | Роль в layout / показ | `none` \| `contents` \| `block` \| `inline` \| `inline-block` \| `flow-root` \| `list-item` \| `flex` \| `inline-flex` \| `grid` \| `inline-grid` \| `table*` \| `ruby*` \| многоколоночные и устаревшие (`run-in` и т.д.) |
| `box-sizing` | Что входит в `width`/`height` | `content-box` \| `border-box` |
| `width` | Ширина content/border-box | `<length>` \| `<percentage>` \| `auto` \| `min-content` \| `max-content` \| `fit-content` \| `fit-content(<length-percentage>)` \| `stretch` \| `min-intrinsic` … |
| `height` | Высота | те же категории, что у `width` |
| `min-width` / `max-width` | Ограничения ширины | как у `width` + `none` у `max-width` |
| `min-height` / `max-height` | Ограничения высоты | как у `height` + `none` у `max-height` |
| `aspect-ratio` | Соотношение сторон | `auto` \| `<ratio>` (напр. `16 / 9`) \| `auto <ratio>` |
| `contain` | Изоляция внутренней отрисовки | `none` \| `strict` \| `content` \| `size` \| `inline-size` \| `layout` \| `style` \| `paint` \| комбинации |
| `content-visibility` | Ленивая отрисовка | `visible` \| `auto` \| `hidden` |
| `overflow` | Переполнение по обеим осям | `visible` \| `hidden` \| `clip` \| `scroll` \| `auto` \| `[visible\|hidden\|clip\|scroll\|auto]{1,2}` |
| `overflow-x` / `overflow-y` | Переполнение по оси | как у `overflow` (одна ось) |
| `overflow-inline` / `overflow-block` | Логические оси переполнения | как у `overflow` |
| `overflow-anchor` | Привязка скролла при вставке контента | `auto` \| `none` |
| `overflow-clip-margin` | Зона клипа при `clip` | `<length>` \| `<visual-box>` |
| `visibility` | Видимость без снятия с layout | `visible` \| `hidden` \| `collapse` |
| `clip` (устар.) | Прямоугольный клип | `auto` \| `rect()` |
| `clip-path` | Контур обрезки | `none` \| `<basic-shape>` \| `<geometry-box>` \| `<url>` |
| `isolation` | Свой stacking context | `auto` \| `isolate` |
| `object-fit` | Картинка/видео в рамке | `fill` \| `contain` \| `cover` \| `none` \| `scale-down` |
| `object-position` | Позиция медиа в рамке | `<position>` (как `background-position`) |

---

## 2. Margin / Padding (физические и логические)

| Свойство | Назначение | Значения |
|----------|------------|----------|
| `margin` | Внешние отступы (шортханд 1–4 стороны) | `<length>` \| `<percentage>` \| `auto` |
| `margin-top` / `right` / `bottom` / `left` | Одна сторона | как у `margin` |
| `margin-inline` / `margin-block` | Логические две стороны оси | как у `margin` |
| `margin-inline-start` / `end` / `block-start` / `end` | Одна логическая сторона | как у `margin` |
| `padding` | Внутренние отступы (шортханд) | `<length>` \| `<percentage>` (от **ширины** контейнга) |
| `padding-*` (все варианты сторон, как у margin) | Одна сторона / логика | как у `padding` |

---

## 3. Border

| Свойство | Назначение | Значения |
|----------|------------|----------|
| `border` | Шортханд ширина-стиль-цвет | `<line-width>` \| `<line-style>` \| `<color>` |
| `border-width` | Толщина (до 4 сторон) | `<line-width>` — ключевые: `thin` \| `medium` \| `thick` или длины |
| `border-style` | Стиль линии | `none` \| `hidden` \| `solid` \| `dashed` \| `dotted` \| `double` \| `groove` \| `ridge` \| `inset` \| `outset` |
| `border-color` | Цвет | `<color>` \| `transparent` |
| `border-top` / `right` / `bottom` / `left` | Шортханд одной стороны | как `border` |
| `border-inline` / `border-block` | Логические стороны | как `border` |
| `border-inline-start` / `end` / `block-start` / `end` | Одна логическая грань | как `border` |
| `border-radius` | Скругление углов | `<length-percentage>` \| эллипс `/` второй радиус |
| `border-image` | Картинка вместо border | сложный синтаксис: `source slice width outset repeat` |
| `border-collapse` | Таблицы: границы ячеек | `separate` \| `collapse` |
| `border-spacing` | Расстояние между ячейками | `<length> <length>?` |

---

## 4. Outline (вне border, часто для фокуса)

| Свойство | Назначение | Значения |
|----------|------------|----------|
| `outline` | Шортханд | `[<'outline-color'> \|\| <'outline-style'> \|\| <'outline-width'>]` |
| `outline-width` | Толщина | `<line-width>` |
| `outline-style` | Стиль | как `border-style` + `auto` |
| `outline-color` | Цвет | `<color>` \| `invert` |
| `outline-offset` | Сдвиг outline от border | `<length>` |

---

## 5. Фон

| Свойство | Назначение | Значения |
|----------|------------|----------|
| `background` | Шортханд (слоистый) | `color` \| `image` \| `position` / `size` \| `repeat` \| `attachment` \| `origin` \| `clip` \| `blend-mode` … |
| `background-color` | Цвет под слоями | `<color>` \| `transparent` |
| `background-image` | Картинки/градиенты | `none` \| `<image>` (url, linear-gradient, radial-gradient, …) |
| `background-repeat` | Повтор | `repeat-x` \| `repeat-y` \| `repeat` \| `space` \| `round` \| `no-repeat` |
| `background-position` | Позиция | `<position>` — ключевые слова + длины/% |
| `background-size` | Размер фона | `auto` \| `<length-percentage>` \| `cover` \| `contain` |
| `background-attachment` | Связь со скроллом | `scroll` \| `fixed` \| `local` |
| `background-origin` | Откуда считать box | `border-box` \| `padding-box` \| `content-box` |
| `background-clip` | Где обрезать фон | `border-box` \| `padding-box` \| `content-box` \| `text` |
| `background-blend-mode` | Смешивание слоёв | режимы как `mix-blend-mode` |

---

## 6. Box shadow / фильтры

| Свойство | Назначение | Значения |
|----------|------------|----------|
| `box-shadow` | Тень блока | `none` \| `[inset? && <length>{2,4} && <color>?]` + spread, множественные тени через `,` |
| `filter` | Фильтры к отрисовке | `none` \| `blur()` \| `brightness()` \| `contrast()` \| `grayscale()` \| `hue-rotate()` \| `invert()` \| `opacity()` \| `saturate()` \| `sepia()` \| `drop-shadow()` \| `url()` … |
| `backdrop-filter` | Фильтр под элементом | как `filter` |

---

## 7. Позиционирование

| Свойство | Назначение | Значения |
|----------|------------|----------|
| `position` | Схема позиции | `static` \| `relative` \| `absolute` \| `fixed` \| `sticky` |
| `top` / `right` / `bottom` / `left` | Смещение от края контейнга | `<length>` \| `<percentage>` \| `auto` |
| `inset` | Шортханд top/right/bottom/left | как у `top` (1–4 значения) |
| `inset-inline` / `inset-block` | Логические | как `top` |
| `inset-inline-start` / `end` / `block-start` / `end` | Одна логическая | как `top` |
| `z-index` | Слой в stacking context | `auto` \| `<integer>` |

---

## 8. Float / clear (классика потока)

| Свойство | Назначение | Значения |
|----------|------------|----------|
| `float` | Обтекание | `none` \| `left` \| `right` \| `inline-start` \| `inline-end` |
| `clear` | Сброс обтекания | `none` \| `left` \| `right` \| `both` \| `inline-start` \| `inline-end` |

---

## 9. Flexbox (контейнер)

| Свойство | Назначение | Значения |
|----------|------------|----------|
| `flex-direction` | Главная ось | `row` \| `row-reverse` \| `column` \| `column-reverse` |
| `flex-wrap` | Перенос | `nowrap` \| `wrap` \| `wrap-reverse` |
| `flex-flow` | Шортханд direction + wrap | оба выше |
| `justify-content` | Главная ось | `flex-start` \| `flex-end` \| `start` \| `end` \| `center` \| `space-between` \| `space-around` \| `space-evenly` \| `stretch` |
| `align-items` | Поперёк главной в линии | `stretch` \| `flex-start` \| `flex-end` \| `start` \| `end` \| `center` \| `baseline` \| `first baseline` \| `last baseline` |
| `align-content` | Распределение линий | `flex-start` \| `flex-end` \| `center` \| `space-between` \| `space-around` \| `space-evenly` \| `stretch` \| `start` \| `end` |
| `place-content` | Шортханд `align-content` + `justify-content` | |
| `gap` / `row-gap` / `column-gap` | Зазоры | `normal` \| `<length-percentage>` |

---

## 10. Flexbox (элемент)

| Свойство | Назначение | Значения |
|----------|------------|----------|
| `flex` | Шортханд grow shrink basis | `none` \| `auto` \| `[<'flex-grow'> <'flex-shrink'>? \|\| <'flex-basis'>]` |
| `flex-grow` | Доля роста | `<number>` |
| `flex-shrink` | Доля сжатия | `<number>` |
| `flex-basis` | Базовый размер по главной оси | `auto` \| `content` \| `<width>` |
| `align-self` | Выравнивание одного элемента поперёк оси | как `align-items` + `auto` |
| `order` | Порядок в flex/grid | `<integer>` |

---

## 11. Grid (контейнер)

| Свойство | Назначение | Значения |
|----------|------------|----------|
| `grid-template-columns` / `rows` | Треки | `none` \| `[<line-names>? <track-size>]+` — `fr`, `%`, `px`, `minmax()`, `fit-content()`, `auto`, `subgrid`, `repeat()` … |
| `grid-template-areas` | Именованные ячейки | `none` \| строки строк из имён `"header header"` |
| `grid-template` | Шортханд шаблона | комбинации columns/rows/areas |
| `grid-auto-columns` / `rows` | Неявные треки | `<track-size>` … |
| `grid-auto-flow` | Куда добавлять неявные | `row` \| `column` \| `dense` \| комбинации |
| `justify-items` / `align-items` | Выравнивание в ячейке | `start` \| `end` \| `center` \| `stretch` … |
| `justify-content` / `align-content` | Распределение треков в контейнере | как во flex + `space-between` и т.д. |
| `place-items` / `place-content` | Шортханды | пары выше |

---

## 12. Grid (элемент)

| Свойство | Назначение | Значения |
|----------|------------|----------|
| `grid-column-start` / `end` / `row-start` / `end` | Линии сетки | `<integer>` \| `<name>` \| `span <integer>` \| `span <name>` \| `auto` |
| `grid-column` / `grid-row` | Шортханд start / end | |
| `grid-area` | Шортханд row / column | имя области или 1–4 значения линий |
| `justify-self` / `align-self` | В ячейке | как `justify-items` + `auto` |

---

## 13. Типографика: шрифт

| Свойство | Назначение | Значения |
|----------|------------|----------|
| `font` | Шортханд | `[style variant weight stretch]? size [/line-height]? family` \| системные `caption` `icon` … |
| `font-family` | Семейства | список через запятую: `<family-name>` \| `generic` (`serif` `sans-serif` `monospace` `cursive` `fantasy` `system-ui` …) |
| `font-size` | Кегль | `<absolute-size>` \| `<relative-size>` \| `<length-percentage>` |
| `font-weight` | Насыщенность | `normal` \| `bold` \| `<number 1–1000>` |
| `font-style` | Начертание | `normal` \| `italic` \| `oblique` \| `oblique <angle>?` |
| `font-stretch` | Узость (редко) | ключевые слова `%` |
| `font-variant` / `font-variant-*` | Лигатуры, цифры, капс | много подсвойств |
| `font-feature-settings` | OpenType фичи | `normal` \| `<feature-tag> <integer>?` … |
| `font-optical-sizing` | Оптический кегль | `auto` \| `none` |
| `font-kerning` | Кернинг | `auto` \| `normal` \| `none` |
| `font-language-override` | Язык OT | `normal` \| `<string>` |
| `line-height` | Межстрочный интервал | `normal` \| `<number>` \| `<length>` \| `<percentage>` |
| `letter-spacing` | Межбуквенный | `normal` \| `<length>` |
| `word-spacing` | Межсловный | `normal` \| `<length>` |

---

## 14. Текст: оформление и переносы

| Свойство | Назначение | Значения |
|----------|------------|----------|
| `color` | Цвет текста | `<color>` |
| `text-align` | Выравнивание строки | `start` \| `end` \| `left` \| `right` \| `center` \| `justify` \| `match-parent` |
| `text-align-last` | Последняя строка блока | как `text-align` |
| `text-justify` | Как растягивать при justify | `auto` \| `inter-word` \| `inter-character` \| `none` |
| `text-indent` | Красная строка | `<length-percentage>` \| `each-line` \| `hanging` |
| `text-decoration` | Шортханд подчёркиваний | `line` \| `color` \| `style` \| `thickness` |
| `text-decoration-line` | Линии | `none` \| `underline` \| `overline` \| `line-through` \| `blink` |
| `text-decoration-style` | Стиль линии | `solid` \| `double` \| `dotted` \| `dashed` \| `wavy` |
| `text-decoration-color` | Цвет | `<color>` |
| `text-decoration-thickness` | Толщина | `auto` \| `from-font` \| `<length-percentage>` |
| `text-underline-offset` | Сдвиг подчёркивания | `auto` \| `<length-percentage>` |
| `text-underline-position` | Позиция подчёркивания | `auto` \| `under` \| `from-font` |
| `text-shadow` | Тень текста | `none` \| `<offset-x> <offset-y> <blur-radius>? <color>?` |
| `text-transform` | Регистр | `none` \| `capitalize` \| `uppercase` \| `lowercase` \| `full-width` … |
| `text-overflow` | Обрезка с многоточием | `clip` \| `ellipsis` \| `<string>` |
| `white-space` | Переносы и пробелы | `normal` \| `nowrap` \| `pre` \| `pre-wrap` \| `pre-line` \| `break-spaces` |
| `word-break` | Перенос внутри слова | `normal` \| `break-all` \| `keep-all` \| `break-word` |
| `overflow-wrap` / `word-wrap` | Перенос длинных слов | `normal` \| `break-word` \| `anywhere` |
| `hyphens` | Перенос через дефис | `none` \| `manual` \| `auto` |
| `line-break` | Правила переноса (CJK) | `auto` \| `loose` \| `normal` \| `strict` \| `anywhere` |
| `writing-mode` | Направление текста | `horizontal-tb` \| `vertical-rl` \| `vertical-lr` \| `sideways-rl` \| `sideways-lr` |
| `direction` | Направление inline | `ltr` \| `rtl` |
| `unicode-bidi` | Двунаправленный текст | `normal` \| `embed` \| `bidi-override` \| `isolate` … |
| `tab-size` | Ширина таба | `<integer>` \| `<length>` |
| `vertical-align` | Выравнивание inline/ячейки | `baseline` \| `sub` \| `super` \| `text-top` \| `text-bottom` \| `middle` \| `top` \| `bottom` \| `<length-percentage>` |

---

## 15. Списки и счётчики

| Свойство | Назначение | Значения |
|----------|------------|----------|
| `list-style` | Шортханд маркера | `type` \| `position` \| `image` |
| `list-style-type` | Вид маркера | `disc` \| `circle` \| `square` \| `decimal` \| … \| `none` \| `@counter-style` |
| `list-style-position` | Внутри/снаружи | `inside` \| `outside` |
| `list-style-image` | Картинка маркера | `none` \| `<image>` |

---

## 16. Таблицы

| Свойство | Назначение | Значения |
|----------|------------|----------|
| `table-layout` | Алгоритм ширин | `auto` \| `fixed` |
| `caption-side` | Подпись таблицы | `top` \| `bottom` |
| `empty-cells` | Пустые ячейки | `show` \| `hide` |

---

## 17. Колонки (multicol)

| Свойство | Назначение | Значения |
|----------|------------|----------|
| `columns` | Шортханд count + width | |
| `column-count` | Число колонок | `auto` \| `<integer>` |
| `column-width` | Желаемая ширина | `auto` \| `<length>` |
| `column-gap` | Зазор | `normal` \| `<length-percentage>` |
| `column-rule-*` | Линия между колонками | как border |
| `column-span` | На всю ширину | `none` \| `all` |
| `column-fill` | Заполнение | `auto` \| `balance` |

---

## 18. Transform

| Свойство | Назначение | Значения |
|----------|------------|----------|
| `transform` | Матрица трансформаций | `none` \| `matrix()` \| `translate()` \| `scale()` \| `rotate()` \| `skew()` \| `perspective()` … |
| `transform-origin` | Точка трансформации | `<position>` + `z` для 3D |
| `transform-style` | 3D для детей | `flat` \| `preserve-3d` |
| `perspective` | Глубина 3D | `none` \| `<length>` |
| `perspective-origin` | Точка перспективы | `<position>` |
| `backface-visibility` | Обратная сторона | `visible` \| `hidden` |

---

## 19. Transition

| Свойство | Назначение | Значения |
|----------|------------|----------|
| `transition` | Шортханд | `property duration timing-function delay` … |
| `transition-property` | Что анимировать | `none` \| `all` \| список имён свойств |
| `transition-duration` | Длительность | `<time>` |
| `transition-timing-function` | Кривая | `ease` \| `linear` \| `ease-in` \| `ease-out` \| `ease-in-out` \| `step-start` \| `cubic-bezier()` \| `steps()` |
| `transition-delay` | Задержка | `<time>` |
| `transition-behavior` | Дискретные переходы | `normal` \| `allow-discrete` |

---

## 20. Animation

| Свойство | Назначение | Значения |
|----------|------------|----------|
| `animation` | Шортханд | имя, длительность, функция, задержка, count, direction, mode, state, timeline |
| `animation-name` | `@keyframes` | `none` \| `<custom-ident>` |
| `animation-duration` | Длительность цикла | `<time>` \| `auto` |
| `animation-timing-function` | Кривая | как у `transition-timing-function` |
| `animation-delay` | Задержка | `<time>` |
| `animation-iteration-count` | Число циклов | `infinite` \| `<number>` |
| `animation-direction` | Направление | `normal` \| `reverse` \| `alternate` \| `alternate-reverse` |
| `animation-fill-mode` | Состояние до/после | `none` \| `forwards` \| `backwards` \| `both` |
| `animation-play-state` | Пауза | `running` \| `paused` |
| `animation-timeline` | Привязка к скроллу | `auto` \| `none` \| именованные |
| `@keyframes` | Ключевые кадры | правило at-rule, не свойство |

---

## 21. Переменные и математика

| Свойство / конструкция | Назначение | Значения |
|------------------------|------------|------------|
| `--*` (custom property) | Пользовательская переменная | любой токен до `;` |
| `var()` | Подстановка | `var(--name, fallback?)` |
| `calc()` | Выражение | `+ - * /` с согласованием единиц |
| `min()` / `max()` / `clamp()` | Функции сравнения | несколько аргументов |
| `env()` / `constant()` | Безопасные зоны | `safe-area-inset-*` и др. |

---

## 22. Pointer / interaction

| Свойство | Назначение | Значения |
|----------|------------|----------|
| `cursor` | Курсор | `auto` \| `default` \| `pointer` \| `text` \| `move` \| `grab` \| `not-allowed` \| `url()` … |
| `pointer-events` | Клики сквозь элемент | `auto` \| `none` |
| `touch-action` | Жесты тач | `auto` \| `none` \| `pan-x` \| `pan-y` \| `manipulation` … |
| `user-select` | Выделение текста | `auto` \| `text` \| `none` \| `contain` \| `all` |
| `resize` | Ручка ресайза | `none` \| `both` \| `horizontal` \| `vertical` \| `block` \| `inline` |
| `caret-color` | Цвет каретки | `auto` \| `<color>` |
| `accent-color` | Цвет UI контролов | `auto` \| `<color>` |

---

## 23. Scroll

| Свойство | Назначение | Значения |
|----------|------------|----------|
| `scroll-behavior` | Плавный скролл | `auto` \| `smooth` |
| `scroll-margin-*` | Отступ цели якоря | `<length>` |
| `scroll-padding-*` | «Видимая» зона при скролле | `<length-percentage>` |
| `scroll-snap-type` | Привязка скролла | `none` \| `[x\|y\|block\|inline\|both] [mandatory\|proximity]?` |
| `scroll-snap-align` | Точка привязки элемента | `none` \| `start` \| `end` \| `center` |
| `scroll-snap-stop` | Обязательная остановка | `normal` \| `always` |
| `overscroll-behavior` | Цепочка скролла | `auto` \| `contain` \| `none` |

---

## 24. Логические размеры и отступы (доп. к выше)

Используются вместо физических `width`/`height`/`margin` при мультиязычии:  
`inline-size`, `block-size`, `min-inline-size`, `max-block-size` и т.д. — значения как у обычных `width`/`height`.

---

## 25. Fragmentation (печать / колонки)

| Свойство | Назначение | Значения |
|----------|------------|----------|
| `break-before` / `after` / `inside` | Разрыв страницы/колонки | `auto` \| `avoid` \| `always` \| `all` \| `page` \| `column` … |
| `orphans` / `widows` | Строки при переносе страницы | `<integer>` |

---

## 26. Видимость и рисование

| Свойство | Назначение | Значения |
|----------|------------|----------|
| `opacity` | Прозрачность | `<number 0–1>` |
| `mix-blend-mode` | Смешивание с фоном | `normal` \| `multiply` \| `screen` \| `overlay` \| … |
| `image-rendering` | Масштаб пикселей | `auto` \| `crisp-edges` \| `pixelated` |
| `image-orientation` | Поворот EXIF | `from-image` \| `none` \| `<angle>` |

---

## 27. Любимые «однострочные» шортханды (уже разобраны по частям — здесь только имя)

`all`, `animation`, `background`, `border`, `column-rule`, `columns`, `flex`, `flex-flow`, `font`, `gap` (= row+column), `grid`, `grid-area`, `grid-column`, `grid-row`, `grid-template`, `inset`, `list-style`, `margin`, `offset`, `outline`, `padding`, `place-content`, `place-items`, `scroll-margin`, `scroll-padding`, `text-decoration`, `transition`, `border-inline`, `border-block`, `margin-inline`, `padding-inline`, … — состав берётся из longhand-таблиц выше.

---

## 28. Псевдоэлементы (не свойства, но «куда» писать стили)

`::before`, `::after`, `::first-line`, `::first-letter`, `::selection`, `::placeholder`, `::file-selector-button`, `::marker`, `::backdrop`, слои `::part()` / `::slotted()` (Shadow DOM), вендорные `::-webkit-*` для контролов.

---

## 29. @-правила (не свойства)

`@media`, `@keyframes`, `@import`, `@supports`, `@layer`, `@container`, `@font-face`, `@page`, `@property` — управляют тем, **когда** и **откуда** применяются блоки свойств.

---

*Если нужно выгрузить только свойства из ваших файлов `styles/*.css` списком «что реально использовано в проекте» — это будет отдельный короткий файл.*
