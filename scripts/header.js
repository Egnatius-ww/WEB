(function () {
  var mount = document.getElementById("site-header-mount");
  if (!mount) return;

  mount.outerHTML = `
<header class="header">
  <div class="header__container flex items-center justify-between">
    <a class="header__link" href="catalog.html" aria-label="BuildMart home">
      <span class="header__link-container">
        <span class="header__link-text" aria-hidden="true">BM</span>
      </span>
      <span class="header__link-label">BuildMart</span>
    </a>
    <nav class="header__navigation" aria-label="Primary navigation">
      <a class="header__navigation-link" href="catalog.html">Products</a>
      <a class="header__navigation-link header__navigation-link--categories" href="#">Categories</a>
      <a class="header__navigation-link header__navigation-link--deals" href="#">Deals</a>
      <a class="header__navigation-link header__navigation-link--about" href="#">About</a>
    </nav>
    <div class="header__search-field">
      <svg class="header__search-icon" width="24" height="24" aria-hidden="true"><use href="../assets/icons.svg#sym-search"></use></svg>
      <input class="header__search-input" type="text" placeholder="Search products..." />
    </div>
    <a class="header__action-link" href="cart.html" aria-label="Open cart">
      <svg class="header__cart-icon" width="24" height="24" aria-hidden="true"><use href="../assets/icons.svg#sym-cart"></use></svg>
      <span class="header__cart-badge" id="header-cart-badge" hidden aria-hidden="true">0</span>
    </a>
  </div>
</header>
`.trim();

  function syncHeaderCartBadge() {
    var badge = document.getElementById("header-cart-badge");
    var cart = window.BuildmartCart;
    if (!badge || !cart || typeof cart.countItems !== "function") return;
    var n = cart.countItems();
    var label = n > 99 ? "99+" : String(Math.max(0, n));
    badge.textContent = label;
    badge.hidden = n < 1;
    var link = badge.closest(".header__action-link");
    if (link) {
      link.setAttribute("aria-label", n < 1 ? "Open cart" : "Open cart, " + n + " items");
    }
  }

  syncHeaderCartBadge();
  window.addEventListener("buildmart-cart-changed", syncHeaderCartBadge);
})();
