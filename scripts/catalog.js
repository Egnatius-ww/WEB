const filtersToggle = document.getElementById("catalog-filters-toggle");
const catalog = document.querySelector(".catalog");
const buttonText = filtersToggle?.querySelector(".catalog__button-text");
const ratingCheckboxes = document.querySelectorAll(".catalog__rating-checkbox");
const productCards = document.querySelectorAll(".catalog__product-container");
const productsCounter = document.querySelector(".catalog__inline-paragraph");

/** Matches absolute offsets in styles/catalog.css */
const CATALOG_LAYOUT = {
  gridTopClosed: 202,
  gridTopOpen: 367,
  rowGap: 620.34,
  cardHeight: 596.34,
  bottomPad: 32,
};

const updateCatalogHeight = () => {
  if (!catalog) return;

  const gridTop = catalog.classList.contains("catalog--filters-open")
    ? CATALOG_LAYOUT.gridTopOpen
    : CATALOG_LAYOUT.gridTopClosed;

  const visibleCount = [...productCards].filter((card) => card.style.display !== "none").length;

  if (visibleCount === 0) {
    catalog.style.height = `${gridTop + CATALOG_LAYOUT.bottomPad}px`;
    return;
  }

  const rows = Math.ceil(visibleCount / 3);
  const gridBottom =
    gridTop + (rows - 1) * CATALOG_LAYOUT.rowGap + CATALOG_LAYOUT.cardHeight + CATALOG_LAYOUT.bottomPad;

  catalog.style.height = `${gridBottom}px`;
};

const getCardRating = (card) => {
  const ratingText = card.querySelector(".catalog__rating-value")?.textContent ?? "";
  const match = ratingText.match(/[\d.]+/);
  return match ? Number.parseFloat(match[0]) : 0;
};

const positionVisibleCards = (visibleCards) => {
  const columnOffsets = [0, 413.33, 826.66];
  const rowOffset = 620.34;

  visibleCards.forEach((card, index) => {
    const column = index % 3;
    const row = Math.floor(index / 3);

    card.style.left = `${columnOffsets[column]}px`;
    card.style.top = `${row * rowOffset}px`;
  });
};

const applyRatingFilter = (minimumRating) => {
  let visibleCount = 0;
  const visibleCards = [];

  productCards.forEach((card) => {
    const cardRating = getCardRating(card);
    const isVisible = minimumRating === null ? true : cardRating >= minimumRating;

    card.style.display = isVisible ? "flex" : "none";
    if (isVisible) {
      visibleCount += 1;
      visibleCards.push(card);
    }
  });

  positionVisibleCards(visibleCards);

  if (productsCounter) {
    productsCounter.textContent = `Showing ${visibleCount} products`;
  }

  updateCatalogHeight();
};

if (filtersToggle && catalog) {
  filtersToggle.addEventListener("click", () => {
    const isOpen = catalog.classList.toggle("catalog--filters-open");
    filtersToggle.setAttribute("aria-expanded", String(isOpen));

    if (buttonText) {
      buttonText.textContent = isOpen ? "Hide Filters" : "Show Filters";
    }

    updateCatalogHeight();
  });
}

const setRatingCheckboxVisual = (item, checked) => {
  item.setAttribute("aria-checked", String(checked));
  item.setAttribute("data-state", checked ? "checked" : "unchecked");
  const indicator = item.querySelector(".catalog__rating-checkbox-indicator");
  if (indicator) {
    indicator.setAttribute("data-state", checked ? "checked" : "unchecked");
  }
};

ratingCheckboxes.forEach((checkbox) => {
  checkbox.addEventListener("click", () => {
    const minimumRating = Number.parseInt(checkbox.id.replace("rating-", ""), 10);
    const wasChecked = checkbox.getAttribute("aria-checked") === "true";

    if (wasChecked) {
      ratingCheckboxes.forEach((item) => setRatingCheckboxVisual(item, false));
      applyRatingFilter(null);
      return;
    }

    ratingCheckboxes.forEach((item) => {
      setRatingCheckboxVisual(item, item === checkbox);
    });

    applyRatingFilter(Number.isNaN(minimumRating) ? null : minimumRating);
  });
});

applyRatingFilter(null);
