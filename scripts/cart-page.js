(function () {
  var root = document.getElementById("cartPage");
  if (!root) return;

  var emptyState = root.querySelector(".cart-page__empty-state");
  var filledState = root.querySelector(".cart-page__filled-state");
  var listEl = document.getElementById("cart-line-items");

  var PROMO_STORAGE = "buildmartPromoCode";
  var PROMO_VALID = "SAVE10"; // промокод из ТЗ

  try {
    window.localStorage.removeItem("buildmartPromoCode");
  } catch (e) {}

  function fmt(n) {
    return "$" + (Math.round(Number(n) * 100) / 100).toFixed(2);
  }

  function roundMoney(n) {
    return Math.round(Number(n) * 100) / 100;
  }

  function isSignedIn() {
    return !!(window.BuildmartAuth && window.BuildmartAuth.currentUser() && window.BuildmartApi);
  }

  function readAppliedPromo() {
    try {
      var c = window.sessionStorage.getItem(PROMO_STORAGE);
      return c ? String(c).trim().toUpperCase() : "";
    } catch (e) {
      return "";
    }
  }

  function setAppliedPromo(code) {
    try {
      if (!code) window.sessionStorage.removeItem(PROMO_STORAGE);
      else window.sessionStorage.setItem(PROMO_STORAGE, String(code).trim().toUpperCase());
    } catch (err) {}
  }

  function setCartVisibility(hasItems) {
    if (!emptyState || !filledState) return;
    if (hasItems) {
      root.classList.add("cart-page--has-items");
      emptyState.hidden = true;
      filledState.hidden = false;
      document.title = "Shopping Cart - BuildMart";
    } else {
      root.classList.remove("cart-page--has-items");
      emptyState.hidden = false;
      filledState.hidden = true;
      document.title = "Cart - BuildMart";
    }
  }

  // ---------- Рендер строки корзины ----------
  function buildLineArt(item) {
    var p = item.product;
    var qty = Math.max(1, parseInt(item.qty, 10) || 1);
    var lineTotal = Number(p.price) * qty;

    var art = document.createElement("article");
    art.className = "cart-page__item";
    art.setAttribute("role", "listitem");
    art.setAttribute("data-item-id", item.id);

    art.innerHTML =
      '<div class="cart-page__product">' +
      '<a class="cart-page__product-image-link" href="card.html?id=' +
      encodeURIComponent(p.id) +
      '">' +
      '<img class="cart-page__product-image" src="' +
      ((p.images && p.images[0]) || "") +
      '" alt="" width="96" height="96" />' +
      "</a>" +
      '<div class="cart-page__product-info">' +
      '<p class="cart-page__product-title"></p>' +
      '<p class="cart-page__product-meta"></p>' +
      '<button type="button" class="cart-page__item-remove-inline" data-cart-act="remove" aria-label="Remove from cart">' +
      '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      "<path d=\"M3 6h18\"></path>" +
      "<path d=\"M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6\"></path>" +
      "<path d=\"M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2\"></path>" +
      '<line x1="10" x2="10" y1="11" y2="17"></line>' +
      '<line x1="14" x2="14" y1="11" y2="17"></line>' +
      "</svg>" +
      "<span>Remove</span>" +
      "</button></div></div>" +
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
    art.querySelector(".cart-page__product-meta").textContent =
      p.stock_quantity > 0 ? "In stock: " + p.stock_quantity : "Out of stock";
    art.querySelector(".cart-page__price").textContent = fmt(p.price);
    art.querySelector(".cart-page__total").textContent = fmt(lineTotal);
    var img = art.querySelector(".cart-page__product-image");
    if (img) img.alt = p.title;
    var imgLink = art.querySelector(".cart-page__product-image-link");
    if (imgLink) imgLink.setAttribute("aria-label", "View product: " + p.title);

    var decBtn = art.querySelector('[data-cart-act="dec"]');
    if (decBtn) {
      decBtn.setAttribute("aria-label", qty <= 1 ? "Remove from cart" : "Decrease quantity");
    }
    return art;
  }

  function renderItems(items) {
    if (!listEl) return;
    listEl.innerHTML = "";
    var subtotal = 0;
    items.forEach(function (item) {
      subtotal += Number(item.product.price) * (parseInt(item.qty, 10) || 1);
      listEl.appendChild(buildLineArt(item));
    });
    setCartVisibility(items.length > 0);
    return roundMoney(subtotal);
  }

  function updateTotals(sub, discount, tax, grand) {
    var elS = document.getElementById("cart-subtotal");
    var elT = document.getElementById("cart-tax");
    var elG = document.getElementById("cart-grand");
    var rowD = document.getElementById("cart-discount-row");
    var elD = document.getElementById("cart-discount");
    if (elS) elS.textContent = fmt(sub);
    if (elT) elT.textContent = fmt(tax);
    if (elG) elG.textContent = fmt(grand);
    if (rowD && elD) {
      if (discount > 0) {
        rowD.hidden = false;
        elD.textContent = "-" + fmt(discount);
      } else {
        rowD.hidden = true;
        elD.textContent = "-" + fmt(0);
      }
    }
  }

  function totalsFromSubtotal(subtotal) {
    var discount = roundMoney(subtotal * 0.1);
    var afterDiscount = roundMoney(subtotal - discount);
    var tax = roundMoney(afterDiscount * 0.08);
    var grand = roundMoney(afterDiscount + tax);
    updateTotals(subtotal, discount, tax, grand);
  }

  function totalsWithServerPromo(subtotal, serverDiscount) {
    var afterDiscount = roundMoney(subtotal - serverDiscount);
    var tax = roundMoney(afterDiscount * 0.08);
    var grand = roundMoney(afterDiscount + tax);
    updateTotals(subtotal, serverDiscount, tax, grand);
  }

  // ---------- Гостевой режим (localStorage) ----------
  function renderGuestCart() {
    var cart = window.BuildmartCart;
    if (!cart) return;
    var lines = cart.read();
    if (!lines.length) {
      renderItems([]);
      updateTotals(0, 0, 0, 0);
      return;
    }

    // Информация о товарах берётся из публичного API
    var api = window.BuildmartApi;
    var promises = lines.map(function (line) {
      var pid = /^\d+$/.test(String(line.id)) ? Number(line.id) : null;
      if (!api || pid === null) return Promise.resolve(null);
      return api
        .getProduct(pid)
        .then(function (product) {
          return { id: pid, qty: line.qty, product: product };
        })
        .catch(function () {
          return null; // товар удалён из каталога
        });
    });

    Promise.all(promises).then(function (items) {
      items = items.filter(Boolean);
      renderItems(items);
      totalsFromSubtotal(
        roundMoney(
          items.reduce(function (s, i) {
            return s + Number(i.product.price) * (parseInt(i.qty, 10) || 1);
          }, 0)
        )
      );
    });
  }

  // ---------- Режим авторизованного пользователя (серверная корзина) ----------
  var promoState = { code: null, discount: 0, subtotal: 0 };

  function renderServerCart() {
    var api = window.BuildmartApi;
    if (!api) return;
    api
      .getCart()
      .then(function (cart) {
        var subtotal = renderItems(cart.items || []);
        subtotal = roundMoney(subtotal || 0);
        if (promoState.code) {
          // пересчитываем скидку на актуальной корзине
          return api
            .applyPromo(promoState.code)
            .then(function (res) {
              promoState.discount = res.discount;
              totalsWithServerPromo(subtotal, res.discount);
            })
            .catch(function () {
              promoState.code = null;
              promoState.discount = 0;
              setAppliedPromo("");
              totalsFromSubtotal(subtotal);
            });
        }
        totalsFromSubtotal(subtotal);
      })
      .catch(function (err) {
        console.error("Cart load failed:", err);
        renderItems([]);
      });
  }

  function renderCart() {
    if (isSignedIn()) {
      renderServerCart();
    } else {
      renderGuestCart();
    }
  }

  // ---------- Изменение количества / удаление ----------
  function applyQtyChange(itemEl, action, input) {
    var itemId = Number(itemEl.getAttribute("data-item-id"));
    var q = Math.max(1, parseInt(input && input.value, 10) || 1);

    if (isSignedIn()) {
      var api = window.BuildmartApi;
      var req;
      if (action === "remove") req = api.removeCartItem(itemId);
      else if (action === "inc") req = api.updateCartItem(itemId, q + 1);
      else if (action === "dec") {
        req = q <= 1 ? api.removeCartItem(itemId) : api.updateCartItem(itemId, q - 1);
      } else req = api.updateCartItem(itemId, q);

      req
        .then(function () {
          return window.BuildmartApi.getCart();
        })
        .then(function (cart) {
          var count = (cart.items || []).reduce(function (s, i) {
            return s + (parseInt(i.qty, 10) || 0);
          }, 0);
          if (window.BuildmartHeader) window.BuildmartHeader.setServerCartCount(count);
          renderServerCart();
        })
        .catch(function (err) {
          if (window.showBuildmartToast) {
            window.showBuildmartToast(err.status === 409 ? "Not enough items in stock" : "Failed to update cart");
          }
          renderServerCart();
        });
      return;
    }

    var cart = window.BuildmartCart;
    if (!cart) return;
    // в гостевом режиме id строки совпадает с id товара
    if (action === "remove") cart.remove(itemId);
    else if (action === "inc") cart.setQty(itemId, q + 1);
    else if (action === "dec") {
      if (q <= 1) cart.remove(itemId);
      else cart.setQty(itemId, q - 1);
    } else cart.setQty(itemId, q);
  }

  if (listEl) {
    listEl.addEventListener("click", function (e) {
      var actBtn = e.target.closest("[data-cart-act]");
      if (!actBtn) return;
      var itemEl = actBtn.closest("[data-item-id]");
      if (!itemEl) return;
      e.preventDefault();
      var action = actBtn.getAttribute("data-cart-act");
      var input = itemEl.querySelector(".cart-page__qty-input");
      applyQtyChange(itemEl, action, input);
    });

    listEl.addEventListener("change", function (e) {
      var inp = e.target.closest(".cart-page__qty-input");
      if (!inp) return;
      var itemEl = inp.closest("[data-item-id]");
      if (!itemEl) return;
      var v = parseInt(inp.value, 10);
      applyQtyChange(itemEl, "set", { value: String(!v || v < 1 ? 1 : v) });
    });
  }

  window.addEventListener("buildmart-cart-changed", function () {
    if (document.getElementById("cartPage") && !isSignedIn()) renderGuestCart();
  });

  // ---------- Промокод ----------
  var promoInput = document.getElementById("cart-promo-input");
  var promoHint = document.getElementById("cart-promo-hint");
  var promoApply = document.getElementById("cart-promo-apply");
  var promoFeedback = document.getElementById("cart-promo-feedback");

  function syncPromoHint() {
    if (!promoHint || !promoInput) return;
    promoHint.hidden = promoInput.value.length < 1;
  }

  function setPromoFeedback(message, ok) {
    if (!promoFeedback) return;
    if (!message) {
      promoFeedback.hidden = true;
      promoFeedback.textContent = "";
      promoFeedback.classList.remove("cart-page__promo-feedback--ok", "cart-page__promo-feedback--err");
      return;
    }
    promoFeedback.hidden = false;
    promoFeedback.textContent = message;
    promoFeedback.classList.toggle("cart-page__promo-feedback--ok", ok === true);
    promoFeedback.classList.toggle("cart-page__promo-feedback--err", ok !== true);
  }

  function onPromoApply() {
    if (!promoInput) return;
    var raw = promoInput.value.trim();
    if (!raw) {
      promoState = { code: null, discount: 0 };
      setAppliedPromo("");
      setPromoFeedback("");
      renderCart();
      return;
    }

    if (isSignedIn()) {
      window.BuildmartApi
        .applyPromo(raw)
        .then(function (res) {
          promoState = { code: res.code, discount: res.discount };
          setAppliedPromo(res.code);
          setPromoFeedback(res.discount_percentage + "% discount applied.", true);
          if (promoInput) promoInput.value = res.code;
          renderServerCart();
        })
        .catch(function (err) {
          promoState = { code: null, discount: 0 };
          setAppliedPromo("");
          setPromoFeedback(err.status === 404 ? "Invalid promo code." : "Failed to apply promo code.", false);
        });
      return;
    }

    // Гостевой режим: статичная проверка кода из ТЗ
    if (raw.toUpperCase() === PROMO_VALID) {
      setAppliedPromo(PROMO_VALID);
      setPromoFeedback("10% discount applied.", true);
      renderCart();
      return;
    }
    setPromoFeedback("Invalid promo code.", false);
  }

  if (promoInput && promoHint) {
    promoInput.addEventListener("input", syncPromoHint);
    syncPromoHint();
  }

  if (promoApply) {
    promoApply.addEventListener("click", onPromoApply);
  }
  if (promoInput) {
    promoInput.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        onPromoApply();
      }
    });
  }

  window.addEventListener("buildmart-auth-changed", renderCart);

  renderCart();
  if (promoInput && readAppliedPromo() === PROMO_VALID) {
    promoInput.value = PROMO_VALID;
    syncPromoHint();
  }
})();
