(function () {
  var DEFAULT_ID = "exterior-paint";
  var ICONS_SPRITE = "../assets/icons.svg#";

  function formatPrice(n) {
    return "$" + Number(n).toFixed(2);
  }

  function starClassFor(rating, index1to5) {
    var r = Number(rating) || 0;
    var i = index1to5;
    if (r >= i) return "card-page__rating-star--full";
    if (r >= i - 0.5) return "card-page__rating-star--half";
    return "card-page__rating-star--empty";
  }

  function starUseHref(kind) {
    if (kind === "card-page__rating-star--full") return ICONS_SPRITE + "sym-star-full";
    if (kind === "card-page__rating-star--half") return ICONS_SPRITE + "sym-star-half";
    return ICONS_SPRITE + "sym-star-empty";
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

  function applyProduct(p) {
    if (!p) return;

    document.title = p.title + " - BuildMart";

    var crumbLink = document.querySelector(".card-page__breadcrumb-link");
    if (crumbLink) {
      crumbLink.setAttribute("href", "catalog.html");
      crumbLink.textContent = "Catalog";
    }
    var crumbCur = document.querySelector(".card-page__breadcrumb-current");
    if (crumbCur) crumbCur.textContent = p.title;

    var main = document.getElementById("card-gallery-main");
    var g = p.gallery && p.gallery.length ? p.gallery : [p.image];
    if (main && g[0]) {
      main.src = g[0];
      main.alt = p.title + " - product photo";
    }

    var thumbs = document.querySelectorAll(".card-page__thumb");
    for (var t = 0; t < thumbs.length; t++) {
      var url = g[t % g.length];
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

    var specGrid = document.querySelector(".card-page__spec-grid");
    if (specGrid && p.specs && p.specs.length) {
      specGrid.textContent = "";
      for (var i = 0; i < p.specs.length; i++) {
        var sp = p.specs[i];
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

    var relatedGrid = document.querySelector(".card-page__related-grid");
    var getRelated = window.getBuildmartProductById;
    var others = [];
    if (p.id === "plywood-sheets" && getRelated) {
      var lumber = getRelated("premium-lumber-planks");
      if (lumber) others.push(lumber);
    } else if (p.id === "premium-lumber-planks" && getRelated) {
      var ply = getRelated("plywood-sheets");
      if (ply) others.push(ply);
    }

    if (relatedGrid) {
      relatedGrid.textContent = "";
      for (var o = 0; o < others.length; o++) {
        var q = others[o];
        var a = document.createElement("a");
        a.className = "card-page__related-card";
        a.href = "card.html?id=" + encodeURIComponent(q.id);
        var img = document.createElement("img");
        img.className = "card-page__related-card-img";
        img.src = q.image;
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
      }
    }
  }

  function initGallery() {
    var main = document.getElementById("card-gallery-main");
    var thumbs = Array.prototype.slice.call(document.querySelectorAll(".card-page__thumb"));
    var prevBtn = document.getElementById("card-gallery-prev");
    var nextBtn = document.getElementById("card-gallery-next");
    if (!main || !thumbs.length) return;

    function getActiveIndex() {
      for (var i = 0; i < thumbs.length; i++) {
        if (thumbs[i].classList.contains("is-active")) return i;
      }
      return 0;
    }

    function activateAt(index) {
      var n = thumbs.length;
      var i = ((index % n) + n) % n;
      var btn = thumbs[i];
      var src = btn.getAttribute("data-full-src");
      if (src) main.src = src;
      thumbs.forEach(function (thumb, j) {
        var on = j === i;
        thumb.classList.toggle("is-active", on);
        thumb.setAttribute("aria-pressed", on ? "true" : "false");
      });
    }

    thumbs.forEach(function (btn, j) {
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

  function initQty() {
    var qtyInput = document.getElementById("card-qty");
    var qtyDec = document.getElementById("card-qty-decrease");
    var qtyInc = document.getElementById("card-qty-increase");
    if (!qtyInput) return;

    function readQty() {
      return Math.max(1, parseInt(qtyInput.value, 10) || 1);
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
        qtyInput.value = String(readQty() + 1);
      });
    }
  }

  var params = new URLSearchParams(window.location.search);
  var id = params.get("id") || DEFAULT_ID;
  var getP = window.getBuildmartProductById;
  var product = getP ? getP(id) : null;
  if (!product && window.BUILDMART_PRODUCTS && window.BUILDMART_PRODUCTS.length) {
    product = window.getBuildmartProductById(DEFAULT_ID) || window.BUILDMART_PRODUCTS[0];
  }

  function initAddToCart(p) {
    if (!p || !window.BuildmartCart) return;
    var btn = document.querySelector(".card-page__btn--primary");
    if (!btn) return;
    btn.addEventListener("click", function () {
      var inp = document.getElementById("card-qty");
      var n = Math.max(1, parseInt(inp && inp.value, 10) || 1);
      window.BuildmartCart.add(p.id, n);
      if (window.showBuildmartToast && p && p.title) {
        if (n <= 1) {
          window.showBuildmartToast("Added " + p.title + " to cart");
        } else {
          window.showBuildmartToast("Added " + n + " × " + p.title + " to cart");
        }
      }
    });
  }

  applyProduct(product);
  initGallery();
  initQty();
  initAddToCart(product);
})();

