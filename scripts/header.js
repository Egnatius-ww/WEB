(function () {
  var mount = document.getElementById("site-header-mount");
  if (!mount) return;

  mount.outerHTML = `
<header class="header" id="site-header">
  <div class="header__container flex items-center">
    <a class="header__link" href="catalog.html" aria-label="BuildMart home">
      <span class="header__link-container">
        <span class="header__link-text" aria-hidden="true">BM</span>
      </span>
      <span class="header__link-label">BuildMart</span>
    </a>
    <nav class="header__navigation" id="header-primary-nav" aria-label="Primary navigation">
      <a class="header__navigation-link" href="catalog.html">Products</a>
      <a class="header__navigation-link header__navigation-link--categories" href="#">Categories</a>
      <a class="header__navigation-link header__navigation-link--deals" href="#">Deals</a>
      <a class="header__navigation-link header__navigation-link--about" href="#">About</a>
    </nav>
    <div class="header__search-field" id="header-search-field">
      <svg class="header__search-icon" width="24" height="24" aria-hidden="true"><use href="../assets/icons/icon-search.svg"></use></svg>
      <input class="header__search-input" id="header-search-input" type="text" placeholder="Search products..." autocomplete="off" />
    </div>
    <div class="header__toolbar-end">
      <span class="header__search-decoy" aria-hidden="true">
        <svg class="header__search-decoy-svg" width="24" height="24" aria-hidden="true"><use href="../assets/icons/icon-search.svg"></use></svg>
      </span>
      <a class="header__action-link" href="cart.html" aria-label="Open cart">
        <svg class="header__cart-icon w-5 h-5" width="24" height="24" aria-hidden="true"><use href="../assets/icons/icon-cart.svg"></use></svg>
        <span class="header__cart-badge" id="header-cart-badge" hidden aria-hidden="true">0</span>
      </a>
      <button type="button" class="header__icon-btn header__menu-toggle" aria-label="Open menu" aria-expanded="false" aria-controls="header-mobile-panel">
        <svg class="header__icon-btn-svg" width="24" height="24" aria-hidden="true"><use href="../assets/icons/icon-menu.svg"></use></svg>
      </button>
    </div>
  </div>
  <div id="header-mobile-panel" class="header__mobile-panel" aria-hidden="true">
    <div class="header__search-field header__search-field--panel">
      <svg class="header__search-icon" width="24" height="24" aria-hidden="true"><use href="../assets/icons/icon-search.svg"></use></svg>
      <input class="header__search-input" id="header-search-input-mobile" type="text" placeholder="Search products..." autocomplete="off" />
    </div>
    <nav class="header__navigation header__navigation--panel" aria-label="Primary navigation">
      <a class="header__navigation-link" href="catalog.html">Products</a>
      <a class="header__navigation-link header__navigation-link--categories" href="#">Categories</a>
      <a class="header__navigation-link header__navigation-link--deals" href="#">Deals</a>
      <a class="header__navigation-link header__navigation-link--about" href="#">About</a>
    </nav>
  </div>
</header>
`.trim();

  var header = document.getElementById("site-header");
  var menuBtn = header && header.querySelector(".header__menu-toggle");
  var mobilePanel = document.getElementById("header-mobile-panel");
  var navPanel = mobilePanel && mobilePanel.querySelector(".header__navigation--panel");
  var desktopInput = document.getElementById("header-search-input");
  var mobileInput = document.getElementById("header-search-input-mobile");

  function setNavOpen(open) {
    if (!header || !menuBtn || !mobilePanel) return;
    if (open && desktopInput && mobileInput) {
      mobileInput.value = desktopInput.value;
    }
    if (!open && desktopInput && mobileInput) {
      desktopInput.value = mobileInput.value;
    }
    header.classList.toggle("header--nav-open", open);
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    mobilePanel.setAttribute("aria-hidden", String(!open));
  }

  if (menuBtn && mobilePanel) {
    menuBtn.addEventListener("click", function () {
      var open = !header.classList.contains("header--nav-open");
      setNavOpen(open);
    });
  }

  function closeNavOnNavigate(e) {
    if (!(e.target instanceof HTMLAnchorElement)) return;
    if (!header.classList.contains("header--nav-open")) return;
    setNavOpen(false);
  }

  if (navPanel) {
    navPanel.addEventListener("click", closeNavOnNavigate);
  }

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && header) {
      setNavOpen(false);
    }
  });

  window.addEventListener(
    "resize",
    function () {
      if (!header) return;
      if (window.matchMedia("(min-width: 768px)").matches) {
        if (desktopInput && mobileInput) {
          desktopInput.value = mobileInput.value;
        }
        setNavOpen(false);
      }
    },
    { passive: true }
  );

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
