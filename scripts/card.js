(function () {
  var ICONS_SPRITE = "../assets/icons/";

  function formatPrice(n) {
    return "$" + (Math.round(Number(n) * 100) / 100).toFixed(2);
  }

  function starClassFor(rating, index1to5) {
    var r = Number(rating) || 0;
    var i = index1to5;
    if (r >= i) return "card-page__rating-star--full";
    if (r >= i - 0.5) return "card-page__rating-star--half";
    return "card-page__rating-star--empty";
  }

  function starUseHref(kind) {
    if (kind === "card-page__rating-star--full") return ICONS_SPRITE + "icon-star-full.svg";
    if (kind === "card-page__rating-star--half") return ICONS_SPRITE + "icon-star-half.svg";
    return ICONS_SPRITE + "icon-star-empty.svg";
  }

  function buildRatingStars(rating) {
    var parts = [];
    for (var s = 1; s <= 5; s++) {
      var cls = starClassFor(rating, s);
      var href = starUseHref(cls);
      parts.push(
        '<svg class="card-page__rating-star ' +
          cls +
          '" width="24" height="24" aria-hidden="true"><use href="' +
          href +
          '"></use></svg>'
      );
    }
    return parts.join("");
  }

  function buildRelatedRatingRow(rating) {
    var rNum = Number(rating) || 0;
    var parts = [];
    for (var s = 1; s <= 5; s++) {
      var cls = starClassFor(rating, s);
      var href = starUseHref(cls);
      parts.push(
        '<svg class="card-page__related-card-star ' +
          cls +
          '" width="16" height="16" aria-hidden="true"><use href="' +
          href +
          '"></use></svg>'
      );
    }
    parts.push(
      '<span class="card-page__related-card-rating-value">(' + rNum + ")</span>"
    );
    return parts.join("");
  }

  function showNotFoundError() {
    var container = document.querySelector(".card-page__product-card");
    if (container) {
      container.innerHTML =
        '<div style="padding:48px 24px;text-align:center">' +
        '<h1 style="font-size:28px;margin-bottom:12px">Product not found</h1>' +
        '<p style="margin-bottom:24px">The product may have been removed from the catalog.</p>' +
        '<a href="catalog.html" style="color:#111827;font-weight:700">← Back to catalog</a>' +
        "</div>";
    }
    var related = document.querySelector(".card-page__related");
    if (related) related.hidden = true;
  }

  function applyProduct(p) {
    if (!p) return;

    document.title = p.title + " - BuildMart";

    var crumbCur = document.querySelector(".card-page__breadcrumb-current");
    if (crumbCur) crumbCur.textContent = p.title;

    var main = document.getElementById("card-gallery-main");
    var g = Array.isArray(p.images) && p.images.length ? p.images : [];
    if (main && g[0]) {
      main.src = g[0];
      main.alt = p.title + " - product photo";
    }

    var thumbs = document.querySelectorAll(".card-page__thumb");
    // Если у товара больше 3 фото — добавляем недостающие превью
    var thumbsWrap = document.querySelector(".card-page__thumbnails");
    if (thumbsWrap && g.length > thumbs.length) {
      for (var extra = thumbs.length; extra < g.length; extra++) {
        var b = document.createElement("button");
        b.type = "button";
        b.className = "card-page__thumb";
        b.setAttribute("aria-label", "Show photo " + (extra + 1));
        b.setAttribute("aria-pressed", "false");
        var bi = document.createElement("img");
        bi.alt = "";
        b.appendChild(bi);
        thumbsWrap.appendChild(b);
      }
      thumbs = document.querySelectorAll(".card-page__thumb");
    }
    for (var t = 0; t < thumbs.length; t++) {
      var url = g[t % Math.max(1, g.length)];
      thumbs[t].setAttribute("data-full-src", url);
      thumbs[t].setAttribute("aria-label", "Show photo " + (t + 1));
      var im = thumbs[t].querySelector("img");
      if (im) {
        im.src = url;
        im.alt = "";
      }
      thumbs[t].classList.toggle("is-active", t === 0);
      thumbs[t].setAttribute("aria-pressed", t === 0 ? "true" : "false");
    }

    var titleEl = document.querySelector(".card-page__title");
    if (titleEl) titleEl.textContent = p.title;

    var ratingWrap = document.querySelector(".card-page__rating");
    if (ratingWrap) {
      var rNum = Number(p.rating) || 0;
      ratingWrap.setAttribute("aria-label", "Rating " + rNum + " out of 5");
      ratingWrap.innerHTML =
        buildRatingStars(rNum) + '<span class="card-page__rating-value">(' + rNum + ")</span>";
    }

    var priceEl = document.querySelector(".card-page__price-amount");
    if (priceEl) priceEl.textContent = formatPrice(p.price);

    var descEl = document.querySelector(".card-page__description-block .card-page__section-text");
    if (descEl) descEl.textContent = p.description || "";

    // Характеристики из полей модели (в ТЗ отдельного поля specs нет)
    var specGrid = document.querySelector(".card-page__spec-grid");
    if (specGrid) {
      var specs = [
        { label: "Availability", value: p.stock_quantity > 0 ? p.stock_quantity + " in stock" : "Out of stock" },
        { label: "Product ID", value: "#" + p.id },
        { label: "Listed", value: new Date(p.created_at).toLocaleDateString("en-US") },
      ];
      specGrid.textContent = "";
      for (var i = 0; i < specs.length; i++) {
        var sp = specs[i];
        var row = document.createElement("div");
        row.className = "card-page__spec-item";
        var dt = document.createElement("dt");
        dt.className = "card-page__spec-label";
        dt.textContent = sp.label;
        var dd = document.createElement("dd");
        dd.className = "card-page__spec-value";
        dd.textContent = sp.value;
        row.appendChild(dt);
        row.appendChild(dd);
        specGrid.appendChild(row);
      }
    }
  }

  function renderRelated(products, currentId) {
    var relatedGrid = document.querySelector(".card-page__related-grid");
    var relatedSection = document.querySelector(".card-page__related");
    if (!relatedGrid) return;
    var others = (products || []).filter(function (q) {
      return q.id !== currentId;
    });
    if (!others.length) {
      if (relatedSection) relatedSection.hidden = true;
      return;
    }

    relatedGrid.textContent = "";
    others.slice(0, 4).forEach(function (q) {
      var a = document.createElement("a");
      a.className = "card-page__related-card";
      a.href = "card.html?id=" + encodeURIComponent(q.id);
      var img = document.createElement("img");
      img.className = "card-page__related-card-img";
      img.src = (q.images && q.images[0]) || "";
      img.width = 280;
      img.height = 280;
      img.alt = "";
      img.loading = "lazy";
      var body = document.createElement("div");
      body.className = "card-page__related-card-body";
      var h3 = document.createElement("h3");
      h3.className = "card-page__related-card-title";
      h3.textContent = q.title;
      var ratingRow = document.createElement("div");
      ratingRow.className = "card-page__related-card-rating-row";
      ratingRow.setAttribute("aria-label", "Rating " + (Number(q.rating) || 0) + " out of 5");
      ratingRow.innerHTML = buildRelatedRatingRow(q.rating);
      var pr = document.createElement("p");
      pr.className = "card-page__related-card-price";
      pr.textContent = formatPrice(q.price);
      body.appendChild(h3);
      body.appendChild(ratingRow);
      body.appendChild(pr);
      a.appendChild(img);
      a.appendChild(body);
      relatedGrid.appendChild(a);
    });
  }

  function initGallery() {
    var main = document.getElementById("card-gallery-main");
    var prevBtn = document.getElementById("card-gallery-prev");
    var nextBtn = document.getElementById("card-gallery-next");
    if (!main) return;

    function thumbs() {
      return Array.prototype.slice.call(document.querySelectorAll(".card-page__thumb"));
    }

    function getActiveIndex() {
      var list = thumbs();
      for (var i = 0; i < list.length; i++) {
        if (list[i].classList.contains("is-active")) return i;
      }
      return 0;
    }

    function activateAt(index) {
      var list = thumbs();
      var n = list.length;
      if (!n) return;
      var i = ((index % n) + n) % n;
      var btn = list[i];
      var src = btn.getAttribute("data-full-src");
      if (src) main.src = src;
      list.forEach(function (thumb, j) {
        var on = j === i;
        thumb.classList.toggle("is-active", on);
        thumb.setAttribute("aria-pressed", on ? "true" : "false");
      });
    }

    thumbs().forEach(function (btn, j) {
      btn.addEventListener("click", function () {
        activateAt(j);
      });
    });
    if (prevBtn) {
      prevBtn.addEventListener("click", function () {
        activateAt(getActiveIndex() - 1);
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener("click", function () {
        activateAt(getActiveIndex() + 1);
      });
    }
  }

  function initSpecsAccordion() {
    var details = document.querySelector(".card-page__accordion");
    var summary = details && details.querySelector(".card-page__accordion-summary");
    var body = details && details.querySelector(".card-page__accordion-body");
    if (!details || !summary || !body) return;

    var DUR_S = 0.35;
    var reduceMotion =
      window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var animating = false;

    function syncAria() {
      summary.setAttribute("aria-expanded", details.open ? "true" : "false");
    }

    syncAria();

    function clearBodyMotion() {
      body.style.transition = "";
      body.style.maxHeight = "";
      body.style.overflow = "";
    }

    function openAccordion() {
      if (reduceMotion) {
        details.open = true;
        syncAria();
        return;
      }
      animating = true;
      details.open = true;
      syncAria();
      body.style.overflow = "hidden";
      body.style.transition = "max-height " + DUR_S + "s ease";
      body.style.maxHeight = "0";
      void body.offsetHeight;
      window.requestAnimationFrame(function () {
        body.style.maxHeight = body.scrollHeight + "px";
      });

      function onEnd(e) {
        if (e.propertyName !== "max-height") return;
        body.removeEventListener("transitionend", onEnd);
        body.style.maxHeight = "none";
        clearBodyMotion();
        animating = false;
      }
      body.addEventListener("transitionend", onEnd);
    }

    function closeAccordion() {
      if (reduceMotion) {
        details.open = false;
        syncAria();
        return;
      }
      animating = true;
      var h = body.scrollHeight;
      body.style.overflow = "hidden";
      body.style.transition = "max-height " + DUR_S + "s ease";
      body.style.maxHeight = h + "px";
      void body.offsetHeight;
      window.requestAnimationFrame(function () {
        body.style.maxHeight = "0";
      });

      function onEnd(e) {
        if (e.propertyName !== "max-height") return;
        body.removeEventListener("transitionend", onEnd);
        details.open = false;
        clearBodyMotion();
        syncAria();
        animating = false;
      }
      body.addEventListener("transitionend", onEnd);
    }

    summary.addEventListener("click", function (e) {
      e.preventDefault();
      if (animating) return;
      if (details.open) closeAccordion();
      else openAccordion();
    });

    summary.addEventListener("keydown", function (e) {
      if (e.key !== "Enter" && e.key !== " ") return;
      e.preventDefault();
      if (animating) return;
      if (details.open) closeAccordion();
      else openAccordion();
    });
  }

  function initQty(maxStock) {
    var qtyInput = document.getElementById("card-qty");
    var qtyDec = document.getElementById("card-qty-decrease");
    var qtyInc = document.getElementById("card-qty-increase");
    if (!qtyInput) return;

    var cap = Number(maxStock) > 0 ? Number(maxStock) : 999;

    function readQty() {
      return Math.min(cap, Math.max(1, parseInt(qtyInput.value, 10) || 1));
    }

    qtyInput.addEventListener("change", function () {
      qtyInput.value = String(readQty());
    });
    if (qtyDec) {
      qtyDec.addEventListener("click", function () {
        qtyInput.value = String(Math.max(1, readQty() - 1));
      });
    }
    if (qtyInc) {
      qtyInc.addEventListener("click", function () {
        qtyInput.value = String(Math.min(cap, readQty() + 1));
      });
    }
  }

  function initAddToCart(p) {
    if (!p) return;
    var btn = document.querySelector(".card-page__btn--primary");
    if (!btn) return;
    btn.addEventListener("click", function () {
      var inp = document.getElementById("card-qty");
      var n = Math.max(1, parseInt(inp && inp.value, 10) || 1);
      var user = window.BuildmartAuth ? window.BuildmartAuth.currentUser() : null;

      var toast = function (msg) {
        if (window.showBuildmartToast) window.showBuildmartToast(msg);
      };

      if (user && window.BuildmartApi) {
        window.BuildmartApi
          .addCartItem(p.id, n)
          .then(function () {
            return window.BuildmartApi.getCart();
          })
          .then(function (cartData) {
            var count = (cartData.items || []).reduce(function (s, i) {
              return s + (parseInt(i.qty, 10) || 0);
            }, 0);
            if (window.BuildmartHeader) window.BuildmartHeader.setServerCartCount(count);
            toast(n <= 1 ? "Added " + p.title + " to cart" : "Added " + n + " × " + p.title + " to cart");
          })
          .catch(function (err) {
            toast(err.status === 409 ? "Not enough items in stock" : "Failed to add item");
          });
        return;
      }

      if (!window.BuildmartCart) return;
      window.BuildmartCart.add(p.id, n);
      toast(n <= 1 ? "Added " + p.title + " to cart" : "Added " + n + " × " + p.title + " to cart");
    });
  }

  // Загрузка товара из API по числовому id (?id=15)
  var params = new URLSearchParams(window.location.search);
  var rawId = (params.get("id") || "").trim();
  var productId = /^\d+$/.test(rawId) ? Number(rawId) : null;

  if (!api_available()) {
    showNotFoundError();
  } else if (productId === null) {
    showNotFoundError();
  } else {
    window.BuildmartApi
      .getProduct(productId)
      .then(function (product) {
        applyProduct(product);
        initGallery();
        initQty(product.stock_quantity);
        initSpecsAccordion();
        initAddToCart(product);
        return window.BuildmartApi.getProducts({ limit: 8, sort_by: "title", order: "asc" });
      })
      .then(function (list) {
        if (list) renderRelated(list.items, productId);
      })
      .catch(function (err) {
        console.error("Product load failed:", err);
        showNotFoundError();
      });
  }

  function api_available() {
    return !!window.BuildmartApi;
  }
})();
