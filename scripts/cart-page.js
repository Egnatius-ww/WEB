(function () {
  var root = document.getElementById("cartPage");
  if (!root) return;

  var emptyState = root.querySelector(".cart-page__empty-state");
  var filledState = root.querySelector(".cart-page__filled-state");
  var listEl = document.getElementById("cart-line-items");
  var getP = window.getBuildmartProductById;
  var cart = window.BuildmartCart;

  function fmt(n) {
    return "$" + (Math.round(Number(n) * 100) / 100).toFixed(2);
  }

  function renderCart() {
    if (!emptyState || !filledState || !listEl || !cart) return;

    var lines = cart.read();
    if (!lines.length) {
      root.classList.remove("cart-page--has-items");
      emptyState.hidden = false;
      filledState.hidden = true;
      listEl.innerHTML = "";
      document.title = "Cart - BuildMart";
      updateTotals(0, 0, 0);
      return;
    }

    root.classList.add("cart-page--has-items");
    emptyState.hidden = true;
    filledState.hidden = false;
    document.title = "Shopping Cart - BuildMart";

    var subtotal = 0;
    listEl.innerHTML = "";

    lines.forEach(function (line) {
      var p = getP ? getP(line.id) : null;
      if (!p) return;
      var qty = Math.max(1, parseInt(line.qty, 10) || 1);
      var lineTotal = Number(p.price) * qty;
      subtotal += lineTotal;

      var art = document.createElement("article");
      art.className = "cart-page__item";
      art.setAttribute("role", "listitem");
      art.setAttribute("data-product-id", p.id);

      art.innerHTML =
        '<div class="cart-page__product">' +
        '<a class="cart-page__product-image-link" href="card.html?id=' +
        encodeURIComponent(p.id) +
        '">' +
        '<img class="cart-page__product-image" src="' +
        p.image +
        '" alt="" width="96" height="96" />' +
        "</a>" +
        '<div class="cart-page__product-info">' +
        '<p class="cart-page__product-title"></p>' +
        '<p class="cart-page__product-meta"></p>' +
        "</div></div>" +
        '<p class="cart-page__price"></p>' +
        '<div class="cart-page__qty">' +
        '<button type="button" class="cart-page__qty-btn" data-cart-act="dec" aria-label="">-</button>' +
        '<input class="cart-page__qty-input" type="number" min="1" value="' +
        qty +
        '" inputmode="numeric" aria-label="Quantity" />' +
        '<button type="button" class="cart-page__qty-btn" data-cart-act="inc" aria-label="Increase quantity">+</button>' +
        "</div>" +
        '<p class="cart-page__total"></p>' +
        '<button type="button" class="cart-page__item-remove" data-cart-act="remove" aria-label="Remove from cart">' +
        '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
        "<path d=\"M3 6h18\"></path>" +
        "<path d=\"M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6\"></path>" +
        "<path d=\"M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2\"></path>" +
        '<line x1="10" x2="10" y1="11" y2="17"></line>' +
        '<line x1="14" x2="14" y1="11" y2="17"></line>' +
        "</svg></button>";

      art.querySelector(".cart-page__product-title").textContent = p.title;
      art.querySelector(".cart-page__product-meta").textContent = p.category || "";
      art.querySelector(".cart-page__price").textContent = fmt(p.price);
      art.querySelector(".cart-page__total").textContent = fmt(lineTotal);
      var img = art.querySelector(".cart-page__product-image");
      if (img) img.alt = p.title;
      var imgLink = art.querySelector(".cart-page__product-image-link");
      if (imgLink) imgLink.setAttribute("aria-label", "View product: " + p.title);

      var decBtn = art.querySelector('[data-cart-act="dec"]');
      if (decBtn) {
        decBtn.setAttribute(
          "aria-label",
          qty <= 1 ? "Remove from cart" : "Decrease quantity"
        );
      }

      listEl.appendChild(art);
    });

    var tax = Math.round(subtotal * 0.08 * 100) / 100;
    var grand = subtotal + tax;
    updateTotals(subtotal, tax, grand);
  }

  function updateTotals(sub, tax, grand) {
    var elS = document.getElementById("cart-subtotal");
    var elT = document.getElementById("cart-tax");
    var elG = document.getElementById("cart-grand");
    if (elS) elS.textContent = fmt(sub);
    if (elT) elT.textContent = fmt(tax);
    if (elG) elG.textContent = fmt(grand);
  }

  if (listEl) {
    listEl.addEventListener("click", function (e) {
      var removeBtn = e.target.closest('[data-cart-act="remove"]');
      if (removeBtn && cart) {
        var row = removeBtn.closest("[data-product-id]");
        if (!row) return;
        cart.remove(row.getAttribute("data-product-id"));
        renderCart();
        return;
      }

      var actBtn = e.target.closest("[data-cart-act]");
      if (!actBtn || !cart) return;
      var article = actBtn.closest("[data-product-id]");
      if (!article) return;
      var id = article.getAttribute("data-product-id");
      var inp = article.querySelector(".cart-page__qty-input");
      var q = Math.max(1, parseInt(inp && inp.value, 10) || 1);
      var act = actBtn.getAttribute("data-cart-act");
      if (act === "inc") cart.setQty(id, q + 1);
      if (act === "dec") {
        if (q <= 1) cart.remove(id);
        else cart.setQty(id, q - 1);
      }
      renderCart();
    });

    listEl.addEventListener("change", function (e) {
      var inp = e.target.closest(".cart-page__qty-input");
      if (!inp || !cart) return;
      var article = inp.closest("[data-product-id]");
      if (!article) return;
      var id = article.getAttribute("data-product-id");
      var v = parseInt(inp.value, 10);
      if (!v || v < 1) cart.remove(id);
      else cart.setQty(id, v);
      renderCart();
    });
  }

  window.addEventListener("buildmart-cart-changed", function () {
    if (document.getElementById("cartPage")) renderCart();
  });

  renderCart();
})();
