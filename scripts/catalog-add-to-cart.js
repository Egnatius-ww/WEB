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
    var label = btn.querySelector(".catalog__product-button-text");
    if (label) {
      var prev = label.textContent;
      label.textContent = "Added";
      window.setTimeout(function () {
        label.textContent = prev;
      }, 900);
    }
  });
})();
