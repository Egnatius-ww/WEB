# Свойства CSS, реально используемые в `styles/*.css`

Список собран **автоматически**: уникальные имена свойств из строк вида `  имя: значение;` во всех файлах `styles/*.css` (псевдоэлементы вроде `::-webkit-slider-thumb` не считаются свойствами — учитываются только декларации **внутри** их блоков).

**Всего: 92** (включая кастомные `--*` и вендорные `-webkit-*` / `-moz-*` как отдельные имена).

Полная теория возможных значений по стандарту — в `docs/css-properties-values.md`.

---

## Кастомные свойства (`--*`)

| Свойство |
|----------|
| `--buildmart-toast-overlap` |
| `--card-gallery-width` |

---

## Вендорные (префиксные) свойства

| Свойство |
|----------|
| `-webkit-appearance` |
| `-webkit-overflow-scrolling` |
| `-webkit-tap-highlight-color` |
| `-webkit-user-select` |

---

## Бокс-модель, размеры, отступы

| Свойство |
|----------|
| `box-sizing` |
| `width` |
| `height` |
| `min-width` |
| `max-width` |
| `min-height` |
| `max-height` |
| `aspect-ratio` |
| `margin` |
| `margin-top` |
| `margin-right` |
| `margin-bottom` |
| `margin-left` |
| `margin-inline` |
| `padding` |
| `padding-top` |
| `padding-right` |
| `padding-bottom` |
| `padding-inline` |
| `overflow` |
| `clip` |

---

## Рамка, фон, тень, обводка

| Свойство |
|----------|
| `border` |
| `border-top` |
| `border-right` |
| `border-bottom` |
| `border-color` |
| `border-bottom-color` |
| `border-radius` |
| `background` |
| `background-color` |
| `background-image` |
| `background-position` |
| `background-repeat` |
| `box-shadow` |
| `outline` |
| `outline-offset` |

---

## Позиционирование и слои

| Свойство |
|----------|
| `position` |
| `top` |
| `right` |
| `bottom` |
| `left` |
| `z-index` |

---

## Flexbox и выравнивание

| Свойство |
|----------|
| `display` |
| `flex` |
| `flex-direction` |
| `flex-wrap` |
| `flex-shrink` |
| `align-items` |
| `align-self` |
| `justify-content` |
| `justify-self` |
| `gap` |
| `row-gap` |
| `column-gap` |

---

## Grid

| Свойство |
|----------|
| `grid-template-columns` |
| `grid-column` |

---

## Типографика и текст

| Свойство |
|----------|
| `color` |
| `font-family` |
| `font-size` |
| `font-style` |
| `font-weight` |
| `line-height` |
| `letter-spacing` |
| `text-align` |
| `text-decoration` |
| `text-overflow` |
| `text-transform` |
| `white-space` |
| `list-style` |

---

## SVG (иконки)

| Свойство |
|----------|
| `fill` |
| `stroke` |
| `stroke-width` |
| `stroke-linecap` |
| `stroke-linejoin` |

---

## Медиа и картинки в блоках

| Свойство |
|----------|
| `object-fit` |
| `filter` |

---

## Поведение и взаимодействие

| Свойство |
|----------|
| `cursor` |
| `pointer-events` |
| `touch-action` |
| `user-select` |
| `appearance` |

---

## Визуальные эффекты и движение

| Свойство |
|----------|
| `opacity` |
| `transform` |
| `transition` |
| `animation` |

---

## Псевдоэлементы / служебное

| Свойство |
|----------|
| `content` |

---

## Как обновить список

Из корня репозитория (нужен Python 3):

```bash
py -3 -c "import re; from pathlib import Path; r=re.compile(r'^\s+(--[a-zA-Z0-9_-]+|-webkit-[a-z-]+|-moz-[a-z-]+|-ms-[a-z-]+|-o-[a-z-]+|[a-z][a-z0-9_-]*)\s*:'); s=set();
for p in Path('styles').glob('*.css'):
 [s.add(m.group(1)) for line in p.read_text(encoding='utf-8').splitlines() if (m:=r.match(line))];
print('\n'.join(sorted(s, key=str.lower)))"
```

Однострочные правила вида `.x { a:1;b:2 }` здесь **не** разбираются — в проекте почти всё с переносами строк.

---

*В @-правилах (`@media`, `@keyframes`, …) новых имён свойств не появляется — это отдельный синтаксис CSS.*
