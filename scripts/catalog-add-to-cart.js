(function () {
  function productIdFromCard(container) {
    var a = container.querySelector('a[href*="id="]');
    if (!a) return null;
    var href = a.getAttribute("href") || "";
    var m = href.match(/[?&]id=([^&]+)/);
    return m ? decodeURIComponent(m[1]) : null;
  }

  document.addEventListener("click", function (e) {
    var btn = e.target.closest(".catalog__product-button");
    if (!btn) return;
    var cart = window.BuildmartCart;
    if (!cart) return;
    var card = btn.closest(".catalog__product-container");
    if (!card) return;
    var id = productIdFromCard(card);
    if (!id) return;
    e.preventDefault();
    cart.add(id, 1);
    var titleEl = card.querySelector(".catalog__product-title");
    var title = titleEl ? titleEl.textContent.trim() : "Item";
    if (window.showBuildmartToast) {
      window.showBuildmartToast("Added " + title + " to cart");
    }
  });
})();
