(function () {
  // Каталог работает через REST API: поиск/фильтры/сортировка/пагинация выполняются на уровне БД.
  var api = window.BuildmartApi;
  var filtersToggle = document.getElementById("catalog-filters-toggle");
  var catalog = document.querySelector(".catalog");
  var buttonText = filtersToggle?.querySelector(".catalog__button-text");
  var ratingCheckboxes = document.querySelectorAll(".catalog__rating-checkbox");
  var productsGrid = document.getElementById("catalog-products-grid");
  var productsCounter = document.querySelector(".catalog__inline-paragraph");
  var priceMinInput = document.getElementById("catalog-price-min");
  var priceMaxInput = document.getElementById("catalog-price-max");
  var priceLabelMin = document.getElementById("catalog-price-label-min");
  var priceLabelMax = document.getElementById("catalog-price-label-max");
  var priceRangeFill = document.getElementById("catalog-price-range-fill");
  var clearFiltersBtn = document.getElementById("catalog-clear-filters");
  var sortSelect = document.getElementById("catalog-sort");
  var paginationEl = document.getElementById("catalog-pagination");

  var DEFAULT_LIMIT = 6;
  var state = {
    page: 1,
    search: null,
    minRating: null,
    minPrice: null,
    maxPrice: null,
    sortBy: "title",
    order: "asc",
  };
  var requestSeq = 0;
  var priceDebounceTimer = null;

  function getPriceSliderMax() {
    const raw = priceMaxInput?.getAttribute("max") ?? priceMinInput?.getAttribute("max") ?? "400";
    const n = Number.parseFloat(raw);
    return Number.isFinite(n) && n > 0 ? n : 400;
  }

  function updatePriceLabels() {
    const cap = getPriceSliderMax();
    const minV = priceMinInput ? Number(priceMinInput.value) : 0;
    const maxV = priceMaxInput ? Number(priceMaxInput.value) : cap;
    if (priceLabelMin) priceLabelMin.textContent = `$${minV}`;
    if (priceLabelMax) priceLabelMax.textContent = `$${maxV}`;
  }

  function updatePriceRangeFill() {
    if (!priceRangeFill || !priceMinInput || !priceMaxInput) return;

    const cap = getPriceSliderMax();
    const minV = Number(priceMinInput.value);
    const maxV = Number(priceMaxInput.value);
    const leftPct = (minV / cap) * 100;
    const rightPct = ((cap - maxV) / cap) * 100;

    priceRangeFill.style.left = `${leftPct}%`;
    priceRangeFill.style.right = `${rightPct}%`;
  }

  function syncPriceInputs() {
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
  }

  function getSelectedMinimumRating() {
    const selected = [...ratingCheckboxes].find((cb) => cb.getAttribute("aria-checked") === "true");
    if (!selected) return null;
    const value = Number.parseInt(selected.id.replace("rating-", ""), 10);
    return Number.isNaN(value) ? null : value;
  }

  function starClassFor(rating, index1to5) {
    var r = Number(rating) || 0;
    if (r >= index1to5) return "catalog__rating-star--filled";
    if (r >= index1to5 - 0.5) return "catalog__rating-star--filled";
    return "catalog__rating-star--empty";
  }

  function starUseHref(kind) {
    if (kind === "catalog__rating-star--filled") return "../assets/icons.svg#sym-star-full";
    if (kind === "catalog__rating-star--half") return "../assets/icons.svg#sym-star-half";
    return "../assets/icons.svg#sym-star-empty";
  }

  function buildRatingStars(rating) {
    var r = Number(rating) || 0;
    var parts = [];
    for (var s = 1; s <= 5; s++) {
      // половинки в карточках каталога нет — используется full/empty
      var cls = r >= s - 0.5 ? "catalog__rating-star--filled" : "catalog__rating-star--empty";
      parts.push(
        '<svg class="catalog__rating-star ' +
          cls +
          '" viewBox="0 0 24 24" aria-hidden="true"><use href="' +
          starUseHref(cls) +
          '"></use></svg>'
      );
    }
    return parts.join("");
  }

  function formatPrice(n) {
    return "$" + (Math.round(Number(n) * 100) / 100).toFixed(2);
  }

  function buildProductCard(p) {
    var container = document.createElement("div");
    container.className = "catalog__product-container";
    container.setAttribute("data-product-id", p.id);

    var imageLink = document.createElement("a");
    imageLink.className = "catalog__product-link group";
    imageLink.href = "card.html?id=" + encodeURIComponent(p.id);
    imageLink.setAttribute("aria-label", "Product");
    var img = document.createElement("img");
    img.className = "catalog__product-image w-full h-full object-cover group-hover:scale-105 transition duration-300";
    img.src = (p.images && p.images[0]) || "";
    img.alt = p.title;
    img.loading = "lazy";
    imageLink.appendChild(img);

    var infoLink = document.createElement("a");
    infoLink.className = "catalog__product-info-link";
    infoLink.href = "card.html?id=" + encodeURIComponent(p.id);
    infoLink.setAttribute("aria-label", "Product info link");
    var title = document.createElement("span");
    title.className = "catalog__product-title";
    title.textContent = p.title;
    infoLink.appendChild(title);

    var ratingWrap = document.createElement("div");
    ratingWrap.className = "catalog__rating";
    ratingWrap.setAttribute("aria-label", "Product rating");
    ratingWrap.innerHTML =
      buildRatingStars(p.rating) +
      '<span class="catalog__rating-value">(' +
      (Number(p.rating) || 0) +
      ")</span>";

    var price = document.createElement("p");
    price.className = "catalog__product-price";
    price.textContent = formatPrice(p.price);

    var categoryWrap = document.createElement("p");
    categoryWrap.className = "catalog__product-paragraph";
    var stock = document.createElement("span");
    stock.className = "catalog__product-category";
    stock.textContent =
      p.stock_quantity > 0 ? "In stock: " + p.stock_quantity : "Out of stock";
    categoryWrap.appendChild(stock);

    var button = document.createElement("button");
    button.type = "button";
    button.className = "catalog__product-button";
    button.innerHTML =
      '<svg class="catalog__product-button-icon" width="24" height="24" aria-hidden="true"><use href="../assets/icons.svg#sym-cart"></use></svg>' +
      '<span class="catalog__product-button-text">Add to Cart</span>';

    container.appendChild(imageLink);
    container.appendChild(infoLink);
    container.appendChild(ratingWrap);
    container.appendChild(price);
    container.appendChild(categoryWrap);
    container.appendChild(button);
    return container;
  }

  function setGridMessage(text) {
    if (!productsGrid) return;
    productsGrid.innerHTML = "";
    var msg = document.createElement("p");
    msg.className = "catalog__grid-message";
    msg.textContent = text;
    productsGrid.appendChild(msg);
  }

  function renderPagination(meta) {
    if (!paginationEl) return;
    paginationEl.innerHTML = "";
    if (!meta || meta.total_pages <= 1) return;

    function pageButton(label, targetPage, opts) {
      opts = opts || {};
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "catalog__pagination-btn" + (opts.active ? " catalog__pagination-btn--active" : "");
      btn.textContent = label;
      if (opts.disabled) btn.disabled = true;
      btn.addEventListener("click", function () {
        if (opts.disabled || state.page === targetPage) return;
        state.page = targetPage;
        loadProducts();
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
      return btn;
    }

    paginationEl.appendChild(pageButton("← Prev", state.page - 1, { disabled: state.page <= 1 }));
    for (var p = 1; p <= meta.total_pages; p++) {
      paginationEl.appendChild(pageButton(String(p), p, { active: p === state.page }));
    }
    paginationEl.appendChild(
      pageButton("Next →", state.page + 1, { disabled: state.page >= meta.total_pages })
    );
  }

  function currentQuery() {
    var params = {
      page: state.page,
      limit: DEFAULT_LIMIT,
      sort_by: state.sortBy,
      order: state.order,
    };
    if (state.search) params.search = state.search;
    if (state.minRating !== null) params.min_rating = state.minRating;
    if (state.minPrice !== null) params.min_price = state.minPrice;
    if (state.maxPrice !== null) params.max_price = state.maxPrice;
    return params;
  }

  function loadProducts() {
    if (!api || !productsGrid) return;
    var seq = ++requestSeq;
    setGridMessage("Loading products...");

    api
      .getProducts(currentQuery())
      .then(function (data) {
        if (seq !== requestSeq) return; // устаревший ответ
        var items = data.items || [];
        productsGrid.innerHTML = "";
        if (!items.length) {
          setGridMessage("No products match your filters.");
        } else {
          items.forEach(function (p) {
            productsGrid.appendChild(buildProductCard(p));
          });
        }
        if (productsCounter) {
          productsCounter.textContent = "Showing " + (data.meta?.total_items ?? items.length) + " products";
        }
        renderPagination(data.meta);
      })
      .catch(function (err) {
        if (seq !== requestSeq) return;
        setGridMessage("Failed to load products. Is the API running?");
        console.error("Catalog load failed:", err);
      });
  }

  // Фильтры берутся из UI и уводят запрос на сервер
  function applyFilters(debounced) {
    state.minRating = getSelectedMinimumRating();
    var cap = getPriceSliderMax();
    var minV = priceMinInput ? Number(priceMinInput.value) : 0;
    var maxV = priceMaxInput ? Number(priceMaxInput.value) : cap;
    state.minPrice = minV > 0 ? minV : null;
    state.maxPrice = maxV < cap ? maxV : null;
    state.page = 1;

    if (debounced) {
      clearTimeout(priceDebounceTimer);
      priceDebounceTimer = setTimeout(loadProducts, 400);
    } else {
      clearTimeout(priceDebounceTimer);
      loadProducts();
    }
  }

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
      applyFilters(true);
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
      state.search = null;
      try {
        var url = new URL(window.location.href);
        url.searchParams.delete("search");
        window.history.replaceState({}, "", url);
      } catch (e) {}
      var headerInput = document.getElementById("header-search-input");
      if (headerInput) headerInput.value = "";
      applyFilters();
    });
  }

  if (sortSelect) {
    sortSelect.addEventListener("change", () => {
      var v = sortSelect.value || "name-asc";
      // name → сортировка по title, price → по цене (на уровне БД)
      if (v === "name-asc") {
        state.sortBy = "title";
        state.order = "asc";
      } else if (v === "price-asc") {
        state.sortBy = "price";
        state.order = "asc";
      } else if (v === "price-desc") {
        state.sortBy = "price";
        state.order = "desc";
      } else if (v === "name-desc") {
        state.sortBy = "title";
        state.order = "desc";
      }
      state.page = 1;
      loadProducts();
    });
  }

  syncPriceInputs();

  // Начальное состояние: поиск из URL (?search= из шапки), сортировка по имени
  try {
    var urlSearch = new URLSearchParams(window.location.search);
    state.search = (urlSearch.get("search") || "").trim() || null;
  } catch (e) {}

  loadProducts();
})();
