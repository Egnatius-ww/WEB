(function () {
  var mount = document.getElementById("site-header-mount");
  if (!mount) return;

  mount.outerHTML = `
<header class="header">
  <div class="header__container flex items-center justify-between">
    <a class="header__link" href="/html/catalog.html" aria-label="BuildMart home">
      <span class="header__link-container">
        <span class="header__link-text" aria-hidden="true">BM</span>
      </span>
      <span class="header__link-label">BuildMart</span>
    </a>
    <nav class="header__navigation" aria-label="Primary navigation">
      <a class="header__navigation-link" href="/html/catalog.html">Products</a>
      <a class="header__navigation-link header__navigation-link--categories" href="#">Categories</a>
      <a class="header__navigation-link header__navigation-link--deals" href="#">Deals</a>
      <a class="header__navigation-link header__navigation-link--about" href="#">About</a>
    </nav>
    <div class="header__search-field">
      <svg class="header__search-icon" width="24" height="24" aria-hidden="true"><use href="../assets/icons.svg#sym-search"></use></svg>
      <input class="header__search-input" type="text" placeholder="Search products..." />
    </div>
    <a class="header__action-link" href="/cart" aria-label="Open cart">
      <svg class="header__cart-icon w-5 h-5" width="24" height="24" aria-hidden="true"><use href="../assets/icons.svg#sym-cart"></use></svg>
    </a>
  </div>
</header>
`.trim();
})();
