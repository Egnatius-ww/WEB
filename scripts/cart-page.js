(function () {
  var root = document.getElementById("cartPage");
  if (!root) return;

  var emptyState = root.querySelector(".cart-page__empty-state");
  var filledState = root.querySelector(".cart-page__filled-state");
  if (!emptyState || !filledState) return;

  var params = new URLSearchParams(window.location.search);
  var hasItems =
    params.get("items") === "1" || window.localStorage.getItem("buildmartCartHasItems") === "1";

  if (hasItems) {
    root.classList.add("cart-page--has-items");
    emptyState.hidden = true;
    filledState.hidden = false;
    document.title = "Shopping Cart - BuildMart";
  }
})();
