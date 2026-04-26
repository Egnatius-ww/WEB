const filtersToggle = document.getElementById("catalog-filters-toggle");
const catalog = document.querySelector(".catalog");
const buttonText = filtersToggle?.querySelector(".catalog__button-text");
const ratingCheckboxes = document.querySelectorAll(".catalog__rating-checkbox");
const productCards = document.querySelectorAll(".catalog__product-container");
const productsGrid = document.getElementById("catalog-products-grid");
const productsCounter = document.querySelector(".catalog__inline-paragraph");
const priceMinInput = document.getElementById("catalog-price-min");
const priceMaxInput = document.getElementById("catalog-price-max");
const priceLabelMin = document.getElementById("catalog-price-label-min");
const priceLabelMax = document.getElementById("catalog-price-label-max");
const priceRangeFill = document.getElementById("catalog-price-range-fill");
const clearFiltersBtn = document.getElementById("catalog-clear-filters");
const sortSelect = document.getElementById("catalog-sort");

const getPriceSliderMax = () => {
  const raw = priceMaxInput?.getAttribute("max") ?? priceMinInput?.getAttribute("max") ?? "400";
  const n = Number.parseFloat(raw);
  return Number.isFinite(n) && n > 0 ? n : 400;
};

const getCardRating = (card) => {
  const ratingText = card.querySelector(".catalog__rating-value")?.textContent ?? "";
  const match = ratingText.match(/[\d.]+/);
  return match ? Number.parseFloat(match[0]) : 0;
};

const getCardPrice = (card) => {
  const priceText = card.querySelector(".catalog__product-price")?.textContent ?? "";
  const match = priceText.replace(/,/g, "").match(/[\d.]+/);
  return match ? Number.parseFloat(match[0]) : 0;
};

const getCardTitle = (card) =>
  (card.querySelector(".catalog__product-title")?.textContent ?? "").trim().toLowerCase();

const compareCardsForSort = (a, b, mode) => {
  if (mode === "price-asc") return getCardPrice(a) - getCardPrice(b);
  if (mode === "price-desc") return getCardPrice(b) - getCardPrice(a);
  return getCardTitle(a).localeCompare(getCardTitle(b), undefined, { sensitivity: "base" });
};

const getSelectedMinimumRating = () => {
  const selected = [...ratingCheckboxes].find((cb) => cb.getAttribute("aria-checked") === "true");
  if (!selected) return null;
  const value = Number.parseInt(selected.id.replace("rating-", ""), 10);
  return Number.isNaN(value) ? null : value;
};

const getPriceBounds = () => {
  const cap = getPriceSliderMax();
  const minV = priceMinInput ? Number(priceMinInput.value) : 0;
  let maxV = priceMaxInput ? Number(priceMaxInput.value) : cap;
  maxV = Math.min(maxV, cap);
  return { min: minV, max: maxV };
};

const updatePriceLabels = () => {
  const { min, max } = getPriceBounds();
  if (priceLabelMin) priceLabelMin.textContent = `$${min}`;
  if (priceLabelMax) priceLabelMax.textContent = `$${max}`;
};

const updatePriceRangeFill = () => {
  if (!priceRangeFill || !priceMinInput || !priceMaxInput) return;

  const cap = getPriceSliderMax();
  const minV = Number(priceMinInput.value);
  const maxV = Number(priceMaxInput.value);
  const leftPct = (minV / cap) * 100;
  const rightPct = ((cap - maxV) / cap) * 100;

  priceRangeFill.style.left = `${leftPct}%`;
  priceRangeFill.style.right = `${rightPct}%`;
};

const syncPriceInputs = () => {
  if (!priceMinInput || !priceMaxInput) return;

  let minV = Number(priceMinInput.value);
  let maxV = Number(priceMaxInput.value);

  if (minV > maxV) {
    if (document.activeElement === priceMinInput) {
      priceMinInput.value = String(maxV);
    } else {
      priceMaxInput.value = String(minV);
    }
    minV = Number(priceMinInput.value);
    maxV = Number(priceMaxInput.value);
  }

  updatePriceLabels();
  updatePriceRangeFill();
};

const reorderProductCardsInGrid = (visibleSorted, hidden) => {
  if (!productsGrid) return;
  visibleSorted.forEach((card) => {
    card.style.left = "";
    card.style.top = "";
    productsGrid.appendChild(card);
  });
  hidden.forEach((card) => {
    card.style.left = "";
    card.style.top = "";
    productsGrid.appendChild(card);
  });
};

const applyFilters = () => {
  const minimumRating = getSelectedMinimumRating();
  const { min: priceMin, max: priceMax } = getPriceBounds();

  let visibleCount = 0;
  const visibleCards = [];

  productCards.forEach((card) => {
    const cardRating = getCardRating(card);
    const cardPrice = getCardPrice(card);
    const ratingOk = minimumRating === null || cardRating >= minimumRating;
    const priceOk = cardPrice >= priceMin && cardPrice <= priceMax;
    const isVisible = ratingOk && priceOk;

    card.style.display = isVisible ? "flex" : "none";
    if (isVisible) {
      visibleCount += 1;
      visibleCards.push(card);
    }
  });

  const sortMode = sortSelect?.value || "name-asc";
  visibleCards.sort((a, b) => compareCardsForSort(a, b, sortMode));

  const hiddenCards = [...productCards].filter((c) => c.style.display === "none");
  reorderProductCardsInGrid(visibleCards, hiddenCards);

  if (productsCounter) {
    productsCounter.textContent = `Showing ${visibleCount} products`;
  }
};

if (filtersToggle && catalog) {
  filtersToggle.addEventListener("click", () => {
    const isOpen = catalog.classList.toggle("catalog--filters-open");
    filtersToggle.setAttribute("aria-expanded", String(isOpen));

    if (buttonText) {
      buttonText.textContent = isOpen ? "Hide Filters" : "Show Filters";
    }
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
    const wasChecked = checkbox.getAttribute("aria-checked") === "true";

    if (wasChecked) {
      ratingCheckboxes.forEach((item) => setRatingCheckboxVisual(item, false));
    } else {
      ratingCheckboxes.forEach((item) => {
        setRatingCheckboxVisual(item, item === checkbox);
      });
    }

    applyFilters();
  });
});

if (priceMinInput && priceMaxInput) {
  const onPriceInput = () => {
    syncPriceInputs();
    applyFilters();
  };

  priceMinInput.addEventListener("input", onPriceInput);
  priceMaxInput.addEventListener("input", onPriceInput);
}

if (clearFiltersBtn) {
  clearFiltersBtn.addEventListener("click", () => {
    ratingCheckboxes.forEach((item) => setRatingCheckboxVisual(item, false));
    if (priceMinInput) priceMinInput.value = "0";
    if (priceMaxInput) priceMaxInput.value = String(getPriceSliderMax());
    syncPriceInputs();
    applyFilters();
  });
}

if (sortSelect) {
  sortSelect.addEventListener("change", () => applyFilters());
}

syncPriceInputs();
applyFilters();
