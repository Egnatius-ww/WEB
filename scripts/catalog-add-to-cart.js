(function () {
  function productIdFromCard(container) {
    // числовой id из data-атрибута (рендер каталога из API)
    var raw = container.getAttribute("data-product-id");
    if (raw && /^\d+$/.test(raw)) return Number(raw);
    return null;
  }

  function addLocally(card, fallbackId) {
    var cart = window.BuildmartCart;
    if (!cart) return;
    var id = fallbackId;
    if (id === null) {
      var a = card.querySelector('a[href*="id="]');
      if (a) {
        var m = (a.getAttribute("href") || "").match(/[?&]id=([^&]+)/);
        id = m ? decodeURIComponent(m[1]) : null;
      }
    }
    if (id === null) return;
    cart.add(id, 1);
  }

  document.addEventListener("click", function (e) {
    var btn = e.target.closest(".catalog__product-button");
    if (!btn) return;
    var card = btn.closest(".catalog__product-container");
    if (!card) return;
    e.preventDefault();

    var id = productIdFromCard(card);
    var titleEl = card.querySelector(".catalog__product-title");
    var title = titleEl ? titleEl.textContent.trim() : "Item";
    var user = window.BuildmartAuth ? window.BuildmartAuth.currentUser() : null;

    if (user && id !== null && window.BuildmartApi) {
      window.BuildmartApi
        .addCartItem(id, 1)
        .then(function () {
          if (window.BuildmartHeader) window.BuildmartHeader.setServerCartCount(null);
          return window.BuildmartApi.getCart();
        })
        .then(function (cartData) {
          var n = (cartData.items || []).reduce(function (s, i) {
            return s + (parseInt(i.qty, 10) || 0);
          }, 0);
          if (window.BuildmartHeader) window.BuildmartHeader.setServerCartCount(n);
          if (window.showBuildmartToast) window.showBuildmartToast("Added " + title + " to cart");
        })
        .catch(function (err) {
          if (window.showBuildmartToast) {
            window.showBuildmartToast(err.status === 409 ? "Not enough items in stock" : "Failed to add item");
          }
        });
      return;
    }

    // Гость — локальная корзина
    addLocally(card, id);
    if (window.showBuildmartToast) {
      window.showBuildmartToast("Added " + title + " to cart");
    }
  });
})();
